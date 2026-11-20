"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { allTasks, type MicroTask } from "@/data";
import {
  computeStats,
  emptyStats,
  type ProgressState,
} from "@/lib/progress";
import {
  getProgressServerSnapshot,
  getProgressSnapshot,
  mergeProgressFromFile,
  resetProgress,
  subscribeProgress,
  toggleProgressTask,
} from "@/lib/progress-store";
import { todayKey } from "@/lib/date";

type TaskMeta = MicroTask & { listId: string; color: string };

const taskMeta = allTasks as TaskMeta[];

function subscribeToday(onChange: () => void): () => void {
  const timer = window.setInterval(onChange, 30_000);
  const sync = () => onChange();
  window.addEventListener("focus", sync);
  document.addEventListener("visibilitychange", sync);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", sync);
    document.removeEventListener("visibilitychange", sync);
  };
}

/** 本地日期键：服务端返回空串，挂载后再读，跨零点自动更新。 */
export function useToday(): string {
  return useSyncExternalStore(
    subscribeToday,
    () => todayKey(),
    () => "",
  );
}

export function useProgress() {
  const today = useToday();
  const state: ProgressState = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );

  const toggle = useCallback(
    (taskId: string) => {
      toggleProgressTask(taskId, today || todayKey());
    },
    [today],
  );

  const reset = useCallback(() => resetProgress(), []);
  const importProgress = useCallback((incoming: ProgressState) => mergeProgressFromFile(incoming), []);

  const stats = useMemo(
    () => (today ? computeStats(state, taskMeta, today) : emptyStats()),
    [state, today],
  );

  const doneToday = useMemo(
    () => new Set(today ? (state.days[today] ?? []) : []),
    [state.days, today],
  );

  return { state, stats, doneToday, toggle, reset, importProgress, today };
}
