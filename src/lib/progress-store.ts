"use client";

import {
  emptyProgress,
  loadProgress,
  mergeProgress,
  saveProgress,
  toggleTask,
  type ProgressState,
} from "./progress";
import {
  ensureWorkspaces,
  progressKeyFor,
  readActiveId,
} from "./workspaces";

/**
 * 打卡记录的「外部存储」，按空间隔离。
 * 用 useSyncExternalStore 读取，天然避免 SSR/客户端不一致，
 * 同时支持跨标签页同步（storage 事件）。
 */
const SERVER_SNAPSHOT = emptyProgress();
let activeId: string | null = null;
let snapshot: ProgressState | null = null;
const listeners = new Set<() => void>();

function currentId(): string {
  if (!activeId) {
    const ensured = ensureWorkspaces();
    activeId = readActiveId() ?? ensured.activeId;
  }
  return activeId;
}

function read(): ProgressState {
  if (!snapshot) snapshot = loadProgress(progressKeyFor(currentId()));
  return snapshot;
}

export function getProgressSnapshot(): ProgressState {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  return read();
}

export function getProgressServerSnapshot(): ProgressState {
  return SERVER_SNAPSHOT;
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeProgress(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    // 只关心当前空间的数据变化；空间列表的变化由 workspace store 处理
    if (event.key !== progressKeyFor(currentId())) return;
    snapshot = loadProgress(progressKeyFor(currentId()));
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: ProgressState) {
  snapshot = next;
  saveProgress(next, progressKeyFor(currentId()));
  emit();
}

export function toggleProgressTask(taskId: string, dateKey: string) {
  write(toggleTask(read(), taskId, dateKey));
}

export function resetProgress() {
  write(emptyProgress());
}

export function mergeProgressFromFile(incoming: ProgressState) {
  write(mergeProgress(read(), incoming));
}

/** 切换空间：读取该空间的记录并通知所有订阅者。 */
export function switchProgressWorkspace(id: string) {
  activeId = id;
  snapshot = loadProgress(progressKeyFor(id));
  emit();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("wetask:workspace-changed"));
  }
}

export function currentWorkspaceId(): string {
  return currentId();
}
