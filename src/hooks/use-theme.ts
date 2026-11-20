"use client";

import { useCallback, useSyncExternalStore } from "react";

const THEME_KEY = "wetask.theme";

export type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** 主题切换：首屏由 inline script 决定，之后由 data-theme 属性驱动。 */
export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    readTheme,
    () => "light" as Theme,
  );

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* 隐私模式忽略 */
    }
  }, []);

  return { theme, toggle };
}
