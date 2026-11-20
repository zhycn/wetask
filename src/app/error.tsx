"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-4xl" aria-hidden="true">
        🧹
      </p>
      <h1 className="mt-4 text-[20px] font-bold tracking-tight">页面出了点小状况</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
        你的打卡记录还在本地，不受影响。刷新一下通常就好了。
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center rounded-full bg-brand px-6 text-[14px] font-semibold text-brand-ink"
      >
        重新加载
      </button>
    </main>
  );
}
