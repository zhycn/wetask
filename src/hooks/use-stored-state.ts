"use client";

import { useEffect, useState } from "react";

/**
 * 把对象状态持久化到 localStorage。
 * 首次渲染始终用默认值（避免 SSR 与客户端不一致），挂载后再合并已存的值。
 */
export function useStoredState<T extends object>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<T> | null;
        if (parsed && typeof parsed === "object") {
          // 首次挂载时把持久化的筛选条件合并进来：这是与外部存储同步的合法用法
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setValue({ ...fallback, ...parsed });
        }
      }
    } catch {
      /* 忽略损坏的数据 */
    }
    setLoaded(true);
    // 只在 key 变化时读取，fallback 视为稳定常量
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* 隐私模式忽略 */
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded] as const;
}
