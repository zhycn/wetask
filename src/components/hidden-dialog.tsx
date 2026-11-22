"use client";

import type { TaskList } from "@/data/types";
import { Modal } from "./modal";
import { IconClose, IconEyeOff, IconUndo } from "./icons";

type Props = {
  open: boolean;
  lists: TaskList[];
  hiddenIds: string[];
  onClose: () => void;
  onUnhide: (taskId: string) => void;
  onUnhideAll: () => void;
};

/** 管理「不感兴趣」的微任务：随时可以放回任务池。 */
export function HiddenDialog({ open, lists, hiddenIds, onClose, onUnhide, onUnhideAll }: Props) {
  const hidden = new Set(hiddenIds);
  const groups = lists
    .map((list) => ({ list, tasks: list.tasks.filter((task) => hidden.has(task.id)) }))
    .filter((group) => group.tasks.length > 0);

  return (
    <Modal open={open} onClose={onClose} labelledBy="hidden-title" className="sm:max-w-[440px]">
      <header className="flex items-start justify-between gap-3 border-b border-line px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <div>
          <h2
            id="hidden-title"
            className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight"
          >
            <IconEyeOff className="h-4 w-4 text-brand" />
            已屏蔽的微任务
          </h2>
          <p className="mt-1 text-[11.5px] leading-relaxed text-ink-faint">
            这些任务不会再出现在随机抽取和清单里，放回去就恢复。
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭已屏蔽列表"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-faint transition hover:bg-sunken hover:text-ink"
        >
          <IconClose className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
        {groups.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-sunken text-[26px]">
              👀
            </div>
            <h3 className="mt-4 text-[14px] font-semibold">还没有屏蔽任何任务</h3>
            <p className="mx-auto mt-1.5 max-w-[260px] text-[12px] leading-relaxed text-ink-soft">
              抽到不想做的任务时，点「不感兴趣」就会把它移出任务池。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map(({ list, tasks }) => (
              <section key={list.id}>
                <h3 className="flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-faint">
                  <span aria-hidden="true">{list.icon}</span>
                  {list.name}
                  <span className="num">· {tasks.length}</span>
                </h3>
                <ul className="mt-1.5 space-y-1">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center gap-2 rounded-xl border border-line bg-raised px-2.5 py-2"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] text-ink-soft">{task.title}</span>
                        <span className="num text-[10.5px] text-ink-faint">{task.estMin} 分钟</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onUnhide(task.id)}
                        className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-line px-2.5 text-[11px] font-medium text-ink-soft transition hover:border-line-strong hover:text-ink"
                      >
                        <IconUndo className="h-3 w-3" />
                        恢复
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <footer className="flex gap-2.5 border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-line bg-raised text-[13px] font-medium text-ink transition hover:border-line-strong"
        >
          完成
        </button>
        {groups.length > 0 && (
          <button
            type="button"
            onClick={onUnhideAll}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-ink text-[13px] font-semibold text-paper transition hover:opacity-85"
          >
            <IconUndo className="h-3.5 w-3.5" />
            全部恢复
          </button>
        )}
      </footer>
    </Modal>
  );
}
