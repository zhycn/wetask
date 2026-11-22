"use client";

import { useSyncExternalStore } from "react";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaceServerSnapshot,
  getWorkspaceSnapshot,
  renameWorkspace,
  setWorkspaceEmoji,
  subscribeWorkspaces,
  switchWorkspace,
} from "@/lib/workspace-store";

/** 空间列表 + 当前空间；切换后打卡数据会跟着切换。 */
export function useWorkspaces() {
  const state = useSyncExternalStore(
    subscribeWorkspaces,
    getWorkspaceSnapshot,
    getWorkspaceServerSnapshot,
  );

  return {
    list: state.list,
    activeId: state.activeId,
    active: state.list.find((item) => item.id === state.activeId) ?? state.list[0] ?? null,
    switchWorkspace,
    createWorkspace,
    renameWorkspace,
    setWorkspaceEmoji,
    deleteWorkspace,
  };
}
