"use client";

import { switchProgressWorkspace } from "./progress-store";
import {
  addWorkspace,
  ensureWorkspaces,
  loadWorkspaces,
  removeWorkspace,
  saveWorkspaces,
  updateWorkspaceMeta,
  writeActiveId,
  type Workspace,
} from "./workspaces";

/**
 * 空间列表的外部存储：让页头、弹层里的空间信息保持一致。
 * 当前空间是「每个标签页各自一份」：两个人可以同时开两个标签页用不同空间。
 */
export type WorkspaceState = { list: Workspace[]; activeId: string };

const SERVER_SNAPSHOT: WorkspaceState = { list: [], activeId: "" };
let snapshot: WorkspaceState | null = null;
const listeners = new Set<() => void>();

function read(): WorkspaceState {
  if (!snapshot) snapshot = ensureWorkspaces();
  return snapshot;
}

function emit() {
  for (const listener of listeners) listener();
}

export function getWorkspaceSnapshot(): WorkspaceState {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  return read();
}

export function getWorkspaceServerSnapshot(): WorkspaceState {
  return SERVER_SNAPSHOT;
}

export function subscribeWorkspaces(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== "wetask.workspaces.v1") return;
    const list = loadWorkspaces();
    const activeId = list.some((item) => item.id === read().activeId)
      ? read().activeId
      : (list[0]?.id ?? "");
    snapshot = { list, activeId };
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function switchWorkspace(id: string): void {
  const state = read();
  if (!state.list.some((item) => item.id === id) || state.activeId === id) return;
  writeActiveId(id);
  snapshot = { ...state, activeId: id };
  switchProgressWorkspace(id);
  emit();
}

export function createWorkspace(name: string, emoji?: string): Workspace | null {
  const workspace = addWorkspace(name, emoji);
  if (!workspace) return null;
  writeActiveId(workspace.id);
  snapshot = { list: loadWorkspaces(), activeId: workspace.id };
  switchProgressWorkspace(workspace.id);
  emit();
  return workspace;
}

export function renameWorkspace(id: string, name: string): void {
  const clean = name.trim().slice(0, 12);
  if (!clean) return;
  updateWorkspaceMeta(id, { name: clean });
  snapshot = { ...read(), list: loadWorkspaces() };
  emit();
}

export function setWorkspaceEmoji(id: string, emoji: string): void {
  updateWorkspaceMeta(id, { emoji });
  snapshot = { ...read(), list: loadWorkspaces() };
  emit();
}

export function deleteWorkspace(id: string): boolean {
  const state = read();
  if (state.list.length <= 1) return false;
  const wasActive = state.activeId === id;
  removeWorkspace(id);
  const list = loadWorkspaces();
  if (list.length === 0) {
    // 兜底：删除后至少重建一个空间
    const ensured = ensureWorkspaces();
    saveWorkspaces(ensured.list);
    snapshot = ensured;
    switchProgressWorkspace(ensured.activeId);
    emit();
    return true;
  }
  const activeId = wasActive ? list[0].id : state.activeId;
  if (wasActive) {
    writeActiveId(activeId);
    switchProgressWorkspace(activeId);
  }
  snapshot = { list, activeId };
  emit();
  return true;
}
