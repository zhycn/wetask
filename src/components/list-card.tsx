"use client";

import type { MicroTask, TaskList } from "@/data/types";
import { cn, withAlpha } from "@/lib/utils";
import { IconCheck, IconDice } from "./icons";

type Props = {
  list: TaskList;
  tasks: MicroTask[];
  doneToday: Set<string>;
  doneInList: number;
  totalCount: number;
  index: number;
  onToggle: (taskId: string) => void;
  onPickFromList: (listId: string) => void;
};

export function ListCard({
  list,
  tasks,
  doneToday,
  doneInList,
  totalCount,
  index,
  onToggle,
  onPickFromList,
}: Props) {
  const total = totalCount;
  const ratio = total === 0 ? 0 : doneInList / total;

  return (
    <section
      className="animate-rise group/list flex flex-col rounded-[26px] border border-line bg-raised p-5 shadow-soft transition-shadow duration-300 hover:shadow-lift"
      style={{ "--rise-delay": `${index * 60}ms` } as React.CSSProperties}
      aria-labelledby={`list-${list.id}`}
    >
      <header className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-[20px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]"
          style={{ backgroundColor: withAlpha(list.color, 0.13) }}
        >
          {list.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 id={`list-${list.id}`} className="truncate text-[15.5px] font-semibold tracking-tight">
              {list.name}
            </h3>
            <span className="num text-[11px] font-medium text-ink-faint">
              {doneInList}/{total}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[12px] text-ink-faint">{list.blurb}</p>
        </div>
        <button
          type="button"
          onClick={() => onPickFromList(list.id)}
          aria-label={`从「${list.name}」随机抽一个微任务`}
          title="从这个清单随机抽一个"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-faint transition hover:bg-sunken hover:text-ink focus-visible:opacity-100 sm:opacity-0 sm:group-hover/list:opacity-100"
        >
          <IconDice className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-sunken" aria-hidden="true">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${Math.max(ratio * 100, ratio > 0 ? 4 : 0)}%`,
            backgroundColor: list.color,
          }}
        />
      </div>

      {tasks.length === 0 ? (
        <p className="mt-5 mb-1 rounded-2xl border border-dashed border-line px-3 py-6 text-center text-[12px] text-ink-faint">
          这个筛选下没有符合的微任务
        </p>
      ) : (
        <ul className="mt-3 -mx-1 space-y-0.5">
          {tasks.map((task) => {
            const done = doneToday.has(task.id);
            return (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => onToggle(task.id)}
                  aria-pressed={done}
                  aria-label={`${task.title}，预计 ${task.estMin} 分钟${done ? "，今天已完成" : ""}`}
                  className="group flex min-h-[42px] w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-sunken/70 focus-visible:bg-sunken/70 sm:min-h-[38px]"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border transition-all duration-200 sm:h-[19px] sm:w-[19px]",
                      done
                        ? "animate-check-ring border-transparent text-white"
                        : "border-line-strong text-transparent group-hover:border-ink-faint",
                    )}
                    style={
                      done
                        ? {
                            backgroundColor: list.color,
                            "--flash-color": withAlpha(list.color, 0.45),
                          } as React.CSSProperties
                        : undefined
                    }
                  >
                    <IconCheck className={cn("h-[11px] w-[11px]", done && "animate-pop")} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-[14px] leading-snug transition-colors sm:text-[13.5px]",
                        done ? "text-ink-faint line-through decoration-ink-faint/40" : "text-ink",
                      )}
                    >
                      {task.title}
                    </span>
                    {task.hint && !done && (
                      <span className="mt-0.5 block truncate text-[11px] text-ink-faint">
                        {task.hint}
                      </span>
                    )}
                  </span>
                  <span className="num shrink-0 rounded-full bg-sunken px-2 py-0.5 text-[11px] font-medium text-ink-soft transition group-hover:bg-paper sm:px-1.5 sm:text-[10.5px]">
                    {task.estMin} 分
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {doneInList > 0 && doneInList >= total && (
        <p className="mt-3 text-center text-[11px] font-medium text-ink-faint">
          这个清单今天全部完成 🎉
        </p>
      )}
    </section>
  );
}
