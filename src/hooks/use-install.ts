"use client";

import { useCallback, useSyncExternalStore } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: InstallPromptEvent | null = null;
let listening = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function listen() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event as InstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    emit();
  });
}

function subscribe(listener: () => void) {
  listen();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** 浏览器是否允许「安装到桌面」。 */
export function useInstall() {
  const canInstall = useSyncExternalStore(
    subscribe,
    () => Boolean(deferred),
    () => false,
  );

  const install = useCallback(async () => {
    if (!deferred) return false;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    deferred = null;
    emit();
    return choice.outcome === "accepted";
  }, []);

  return { canInstall, install };
}
