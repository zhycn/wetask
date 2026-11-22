"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getHiddenServerSnapshot,
  getHiddenSnapshot,
  hideTask,
  subscribeHidden,
  unhideAll,
  unhideTask,
} from "@/lib/hidden-store";

/** 当前空间里被「不感兴趣」屏蔽的微任务。 */
export function useHidden() {
  const state = useSyncExternalStore(
    subscribeHidden,
    getHiddenSnapshot,
    getHiddenServerSnapshot,
  );

  const set = useMemo(() => new Set(state.ids), [state.ids]);

  return {
    ids: state.ids,
    set,
    hide: hideTask,
    unhide: unhideTask,
    unhideAll,
  };
}
