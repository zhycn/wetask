"use client";

import type { MicroTask } from "@/data/types";
import { IconArrowRight, IconCheck, IconClose } from "./icons";

type CompletedTask = MicroTask & { listId: string; color: string };

type Props = {
  tasks: CompletedTask[];
  onUndo: (taskId: string) => void;
  onOpenAchievements: () => void;
};

/** 今日已完成回顾：不用在 6 列里找自己做过什么，也能一键撤销。 */
export function TodayStrip({ tasks, onUndo, onOpenAchievements }: Props) {
  if (tasks.length === 0) return null;

  return (
    <section
      aria-label="今天已完成"
      className="animate-fade-up mt-6 flex items-center gap-3 rounded-2xl border border-line bg-raised/70 px-3.5 py-2.5"
    >
      <div className="flex shrink-0 items-center gap-2 text-[12px] font-medium text-ink-soft">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-ink">
          <IconCheck className="h-3 w-3" />
        </span>
        今天完成
        <span className="num text-[13px] font-bold text-ink">{tasks.length}</span>
      </div>

      <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar [mask-image:linear-gradient(to_right,black_calc(100%-20px),transparent)] sm:[mask-image:none]">
        <ul className="flex items-center gap-1.5">
          {tasks.map((task) => (
            <li key={task.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onUndo(task.id)}
                title="点击撤销这一项"
                className="group inline-flex max-w-[220px] items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-[11.5px] text-ink-soft transition hover:border-line-strong hover:text-ink"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: task.color }}
                />
                <span className="truncate">{task.title}</span>
                <IconClose className="h-3 w-3 shrink-0 opacity-0 transition group-hover:opacity-70" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={onOpenAchievements}
        className="hidden shrink-0 items-center gap-0.5 text-[11.5px] font-medium text-ink-faint transition hover:text-ink sm:inline-flex"
      >
        看成就
        <IconArrowRight className="h-3.5 w-3.5" />
      </button>
    </section>
  );
}
