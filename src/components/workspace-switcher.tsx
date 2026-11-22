"use client";

import type { Workspace } from "@/lib/workspaces";
import { IconChevronDown } from "./icons";

type Props = {
  active: Workspace | null;
  count: number;
  onClick: () => void;
};

/** 页头的空间入口：显示当前是谁的空间，点开可以切换或新建。 */
export function WorkspaceSwitcher({ active, count, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`切换打卡空间，当前是${active?.name ?? "我的打卡"}`}
      className="group ml-1 flex h-9 items-center gap-2 rounded-full border border-line bg-raised pl-1 pr-2 transition hover:border-line-strong sm:ml-2 sm:pr-2.5"
    >
      <span
        aria-hidden="true"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sunken text-[14px]"
      >
        {active?.emoji ?? "🌱"}
      </span>
      <span className="hidden max-w-[92px] truncate text-[12px] font-medium text-ink sm:block">
        {active?.name ?? "我的打卡"}
      </span>
      {count > 1 && (
        <span className="hidden rounded-full bg-sunken px-1.5 py-0.5 text-[10px] font-semibold text-ink-soft sm:inline">
          {count}
        </span>
      )}
      <IconChevronDown className="h-3 w-3 shrink-0 text-ink-faint transition group-hover:text-ink-soft" />
    </button>
  );
}
