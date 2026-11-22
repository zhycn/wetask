/**
 * 「不感兴趣」的微任务：按空间保存，只影响这个空间里抽到/看到的任务。
 * 隐藏不删除历史打卡记录——做过的事仍然算数。
 */
export type HiddenState = {
  version: 1;
  ids: string[];
};

export function hiddenKeyFor(workspaceId: string): string {
  return `wetask.hidden.v1:${workspaceId}`;
}

export const emptyHidden = (): HiddenState => ({ version: 1, ids: [] });

export function parseHidden(raw: unknown): HiddenState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<HiddenState>;
  if (!Array.isArray(value.ids)) return null;
  const ids = Array.from(new Set(value.ids.filter((id) => typeof id === "string" && id.length > 0)));
  return { version: 1, ids };
}

export function loadHidden(workspaceId: string): HiddenState {
  if (typeof window === "undefined") return emptyHidden();
  try {
    const raw = window.localStorage.getItem(hiddenKeyFor(workspaceId));
    if (!raw) return emptyHidden();
    return parseHidden(JSON.parse(raw)) ?? emptyHidden();
  } catch {
    return emptyHidden();
  }
}

export function saveHidden(workspaceId: string, state: HiddenState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(hiddenKeyFor(workspaceId), JSON.stringify(state));
  } catch {
    /* 隐私模式下静默失败 */
  }
}
