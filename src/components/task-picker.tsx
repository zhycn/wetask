"use client";

import { useEffect } from "react";
import type { MicroTask, TaskList } from "@/data/types";
import { Modal } from "./modal";
import { IconCheck, IconClose, IconDice, IconSparkle } from "./icons";
import { withAlpha } from "@/lib/utils";

type Pick = { task: MicroTask; list: TaskList } | null;

type Props = {
  open: boolean;
  pick: Pick;
  scopeLabel: string;
  onClose: () => void;
  onReroll: () => void;
  onComplete: () => void;
  onOpenAchievements: () => void;
  progress: { done: number; total: number } | null;
};

export function TaskPicker({
  open,
  pick,
  scopeLabel,
  onClose,
  onReroll,
  onComplete,
  onOpenAchievements,
  progress,
}: Props) {
  const color = pick?.list.color ?? "#e2552b";

  // 打开时按 R 换一条；Enter 交给主按钮原生触发
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.isContentEditable) return;
      if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        onReroll();
        return;
      }
      // 焦点还在弹层本身时，回车 = 直接打卡；焦点在按钮上时交给按钮原生行为
      if (event.key === "Enter" && document.activeElement?.getAttribute("role") === "dialog") {
        event.preventDefault();
        onComplete();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onReroll, onComplete]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="picker-title"
      className="sm:max-w-[452px]"
    >
      <div
        aria-hidden="true"
        className="h-1.5 w-full shrink-0"
        style={{ background: `linear-gradient(90deg, ${color}, ${withAlpha(color, 0.35)})` }}
      />

      <div className="p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium"
            style={{ backgroundColor: withAlpha(color, 0.12), color }}
          >
            <span aria-hidden="true">{pick?.list.icon ?? "✨"}</span>
            {pick ? pick.list.name : scopeLabel}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="-mr-1 grid h-8 w-8 place-items-center rounded-full text-ink-faint transition hover:bg-sunken hover:text-ink"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        {pick ? (
          <>
            <h2
              id="picker-title"
              key={pick.task.id}
              className="animate-fade-up mt-5 text-[27px] leading-[1.35] font-bold tracking-tight text-balance sm:text-[29px]"
            >
              {pick.task.title}
            </h2>

            {pick.task.hint && (
              <p className="animate-fade-up mt-2.5 text-[13px] leading-relaxed text-ink-soft">
                {pick.task.hint}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-2 text-[12px]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-sunken/60 px-2.5 py-1 font-medium text-ink-soft">
                <IconSparkle className="h-3.5 w-3.5 text-brand" />
                预计 {pick.task.estMin} 分钟
              </span>
              <span className="text-ink-faint">做完就回来勾一下</span>
              {progress && progress.total > 0 && (
                <span className="ml-auto text-ink-faint">
                  今天这个领域 <span className="num font-semibold text-ink-soft">{progress.done}</span>/
                  {progress.total}
                </span>
              )}
            </div>

            <div className="mt-7 flex gap-2.5">
              <button
                type="button"
                onClick={onReroll}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-raised text-[14px] font-medium text-ink transition hover:border-line-strong hover:bg-sunken/60 active:scale-[0.99]"
              >
                <IconDice className="h-4 w-4" />
                换一条
              </button>
              <button
                type="button"
                onClick={onComplete}
                className="inline-flex h-11 flex-[1.35] items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-semibold text-brand-ink shadow-[0_12px_26px_-14px_rgba(226,85,43,0.95)] transition hover:brightness-105 active:scale-[0.99]"
              >
                <IconCheck className="h-4 w-4" />
                完成，打卡
              </button>
            </div>
          </>
        ) : (
          <>
            <h2
              id="picker-title"
              className="mt-5 text-[25px] leading-snug font-bold tracking-tight text-balance"
            >
              {scopeLabel}的任务，今天都完成啦 🎉
            </h2>
            <p className="mt-2.5 text-[13px] leading-relaxed text-ink-soft">
              已经很好了。要么换个领域，要么去看看今天的成果。
            </p>
            <div className="mt-7 flex gap-2.5">
              <button
                type="button"
                onClick={onReroll}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-raised text-[14px] font-medium text-ink transition hover:border-line-strong"
              >
                <IconDice className="h-4 w-4" />
                换一批看看
              </button>
              <button
                type="button"
                onClick={onOpenAchievements}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-semibold text-brand-ink"
              >
                看我的成就
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line bg-sunken/40 px-5 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] text-[11px] text-ink-faint">
        <span>抽到不想做的就换一条，不扣分。</span>
        <span className="hidden items-center gap-2 sm:flex">
          <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 font-sans text-[10px] text-ink-soft">
            R
          </kbd>
          换一条
          <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 font-sans text-[10px] text-ink-soft">
            ↵
          </kbd>
          打卡
        </span>
      </div>
    </Modal>
  );
}
