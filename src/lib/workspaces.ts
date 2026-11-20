/**
 * 本地空间（workspace）：同一台设备上可以有多个使用者，
 * 每个人的打卡记录彼此独立，不需要账号、不需要联网。
 *
 * 存储约定：
 * - 空间列表：wetask.workspaces.v1
 * - 当前空间：wetask.active-workspace.v1（sessionStorage 优先，实现「每个标签页各自一个空间」）
 * - 打卡记录：wetask.progress.v1:<空间ID>
 */

export type Workspace = {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
};

export const WORKSPACES_KEY = "wetask.workspaces.v1";
export const ACTIVE_KEY = "wetask.active-workspace.v1";
/** 早期单用户版本使用的 key，首次升级时迁入第一个空间 */
export const LEGACY_PROGRESS_KEY = "wetask.progress.v1";
export const MAX_WORKSPACES = 8;

export const WORKSPACE_EMOJIS = ["🌱", "🌊", "🔥", "🌙", "🍀", "☀️", "🎯", "🐳", "🍑", "⭐"];

export function progressKeyFor(workspaceId: string): string {
  return `${LEGACY_PROGRESS_KEY}:${workspaceId}`;
}

function safeRead(key: string, storage: "local" | "session" = "local"): string | null {
  try {
    return storage === "local" ? window.localStorage.getItem(key) : window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: string, storage: "local" | "session" = "local"): void {
  try {
    if (storage === "local") window.localStorage.setItem(key, value);
    else window.sessionStorage.setItem(key, value);
  } catch {
    /* 隐私模式下静默失败 */
  }
}

function newId(): string {
  return `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function makeWorkspace(name: string, emoji = WORKSPACE_EMOJIS[0]): Workspace {
  return {
    id: newId(),
    name: name.trim().slice(0, 12) || "未命名",
    emoji,
    createdAt: new Date().toISOString(),
  };
}

function parseList(raw: string | null): Workspace[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Workspace => {
      if (!item || typeof item !== "object") return false;
      const value = item as Partial<Workspace>;
      return (
        typeof value.id === "string" &&
        typeof value.name === "string" &&
        typeof value.emoji === "string" &&
        typeof value.createdAt === "string"
      );
    });
  } catch {
    return [];
  }
}

export function loadWorkspaces(): Workspace[] {
  if (typeof window === "undefined") return [];
  return parseList(safeRead(WORKSPACES_KEY));
}

export function saveWorkspaces(list: Workspace[]): void {
  safeWrite(WORKSPACES_KEY, JSON.stringify(list));
}

/** 当前标签页的空间：sessionStorage 优先，其次记住的上次选择。 */
export function readActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return safeRead(ACTIVE_KEY, "session") ?? safeRead(ACTIVE_KEY) ?? null;
}

export function writeActiveId(id: string): void {
  safeWrite(ACTIVE_KEY, id, "session");
  safeWrite(ACTIVE_KEY, id);
}

/**
 * 保证至少有一个空间，并把旧版单用户数据迁进来。
 * 幂等：已经有空间列表时直接返回。
 */
export function ensureWorkspaces(): { list: Workspace[]; activeId: string } {
  if (typeof window === "undefined") {
    return { list: [], activeId: "" };
  }

  let list = loadWorkspaces();

  if (list.length === 0) {
    const first = makeWorkspace("我的打卡", "🌱");
    const legacy = safeRead(LEGACY_PROGRESS_KEY);
    if (legacy) {
      // 把旧数据搬进第一个空间，旧 key 保留作为兜底，不做删除
      safeWrite(progressKeyFor(first.id), legacy);
    }
    list = [first];
    saveWorkspaces(list);
    writeActiveId(first.id);
  }

  const remembered = readActiveId();
  const activeId = list.some((item) => item.id === remembered) ? (remembered as string) : list[0].id;
  if (activeId !== remembered) writeActiveId(activeId);

  return { list, activeId };
}

export function addWorkspace(name: string, emoji?: string): Workspace | null {
  const list = loadWorkspaces();
  if (list.length >= MAX_WORKSPACES) return null;
  const workspace = makeWorkspace(name, emoji ?? WORKSPACE_EMOJIS[list.length % WORKSPACE_EMOJIS.length]);
  saveWorkspaces([...list, workspace]);
  return workspace;
}

export function updateWorkspaceMeta(id: string, patch: Partial<Pick<Workspace, "name" | "emoji">>): void {
  saveWorkspaces(
    loadWorkspaces().map((item) => (item.id === id ? { ...item, ...patch } : item)),
  );
}

export function removeWorkspace(id: string): void {
  const list = loadWorkspaces().filter((item) => item.id !== id);
  saveWorkspaces(list);
  try {
    window.localStorage.removeItem(progressKeyFor(id));
  } catch {
    /* ignore */
  }
}
