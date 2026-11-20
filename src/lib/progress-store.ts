"use client";

import {
  STORAGE_KEY,
  emptyProgress,
  loadProgress,
  mergeProgress,
  saveProgress,
  toggleTask,
  type ProgressState,
} from "./progress";

/**
 * 打卡记录的「外部存储」。
 * 用 useSyncExternalStore 读取，天然避免 SSR/客户端不一致，
 * 同时支持跨标签页同步（storage 事件）。
 */
const SERVER_SNAPSHOT = emptyProgress();
let snapshot: ProgressState | null = null;
const listeners = new Set<() => void>();

function read(): ProgressState {
  if (!snapshot) snapshot = loadProgress();
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
    if (event.key !== STORAGE_KEY) return;
    snapshot = loadProgress();
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
  saveProgress(next);
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
