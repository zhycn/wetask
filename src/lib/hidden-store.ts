"use client";

import {
  emptyHidden,
  hiddenKeyFor,
  loadHidden,
  saveHidden,
  type HiddenState,
} from "./hidden";
import { currentWorkspaceId } from "./progress-store";

/**
 * 「不感兴趣」列表的外部存储，按空间隔离。
 * 切换空间时通过 wetask:workspace-changed 事件重新加载。
 */
const SERVER_SNAPSHOT: HiddenState = emptyHidden();
let workspaceId = "";
let snapshot: HiddenState | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function sync(): HiddenState {
  const id = currentWorkspaceId();
  if (!snapshot || workspaceId !== id) {
    workspaceId = id;
    snapshot = loadHidden(id);
  }
  return snapshot;
}

export function getHiddenSnapshot(): HiddenState {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  return sync();
}

export function getHiddenServerSnapshot(): HiddenState {
  return SERVER_SNAPSHOT;
}

export function subscribeHidden(listener: () => void): () => void {
  listeners.add(listener);
  sync();

  const onStorage = (event: StorageEvent) => {
    if (event.key !== hiddenKeyFor(workspaceId)) return;
    snapshot = loadHidden(workspaceId);
    emit();
  };
  const onWorkspaceChanged = () => {
    snapshot = null;
    sync();
    emit();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener("wetask:workspace-changed", onWorkspaceChanged);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("wetask:workspace-changed", onWorkspaceChanged);
  };
}

function write(ids: string[]) {
  const next: HiddenState = { version: 1, ids };
  workspaceId = currentWorkspaceId();
  snapshot = next;
  saveHidden(workspaceId, next);
  emit();
}

/** 实时判断（不依赖 React 状态），用于抽取时的兜底过滤。 */
export function isTaskHidden(taskId: string): boolean {
  if (typeof window === "undefined") return false;
  return sync().ids.includes(taskId);
}

export function hideTask(taskId: string): void {
  const state = sync();
  if (state.ids.includes(taskId)) return;
  write([...state.ids, taskId]);
}

export function unhideTask(taskId: string): void {
  const state = sync();
  if (!state.ids.includes(taskId)) return;
  write(state.ids.filter((id) => id !== taskId));
}

export function unhideAll(): void {
  write([]);
}
