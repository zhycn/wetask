"use client";

import type { MicroTask, TaskList } from "@/data/types";
import { ListCard } from "./list-card";

type VisibleList = { list: TaskList; tasks: MicroTask[] };

type Props = {
  visibleLists: VisibleList[];
  doneToday: Set<string>;
  totalVisible: number;
  onToggle: (taskId: string) => void;
  onPickFromList: (listId: string) => void;
  onResetFilters: () => void;
};

export function ListBoard({
  visibleLists,
  doneToday,
  totalVisible,
  onToggle,
  onPickFromList,
  onResetFilters,
}: Props) {
  return (
    <section aria-label="微任务清单" className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight">任务池</h2>
          <p className="mt-0.5 text-[12px] text-ink-faint">
            点一下就算打卡，再点一下可以撤销 · 每天零点重新开始
          </p>
        </div>
        <span className="hidden text-[12px] text-ink-faint sm:block">
          当前 <span className="num font-semibold text-ink-soft">{totalVisible}</span> 项可做
        </span>
      </div>

      {visibleLists.length === 0 ? (
        <div className="rounded-[26px] border border-dashed border-line bg-raised/50 px-6 py-16 text-center">
          <p className="text-2xl" aria-hidden="true">
            🧐
          </p>
          <h3 className="mt-3 text-[15px] font-semibold">没有找到符合的微任务</h3>
          <p className="mt-1 text-[12.5px] text-ink-faint">
            换个关键词，或者把时长和领域筛选放宽一点。
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-raised px-4 text-[12.5px] font-medium text-ink transition hover:border-line-strong"
          >
            清除全部筛选
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleLists.map(({ list, tasks }, index) => (
            <ListCard
              key={list.id}
              list={list}
              tasks={tasks}
              doneToday={doneToday}
              doneInList={list.tasks.filter((task) => doneToday.has(task.id)).length}
              index={index}
              onToggle={onToggle}
              onPickFromList={onPickFromList}
            />
          ))}
        </div>
      )}
    </section>
  );
}
