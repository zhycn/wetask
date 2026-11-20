"use client";

import { useEffect, useRef, useState } from "react";
import type { TaskList } from "@/data/types";
import { TIME_FILTERS } from "@/lib/constants";
import { cn, withAlpha } from "@/lib/utils";
import { IconClose, IconEyeOff, IconFilter, IconSearch } from "./icons";

export type Filters = {
  category: string;
  maxMin: number | null;
  query: string;
  hideDone: boolean;
};

type Props = {
  lists: TaskList[];
  filters: Filters;
  visibleCount: number;
  totalCount: number;
  doneCount: number;
  onChange: (next: Filters) => void;
};

export function FilterBar({ lists, filters, visibleCount, totalCount, doneCount, onChange }: Props) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dirty =
    filters.category !== "all" ||
    filters.maxMin !== null ||
    filters.query !== "" ||
    filters.hideDone;

  const advancedActive = filters.maxMin !== null || filters.query !== "" || filters.hideDone;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const resetAll = () => onChange({ category: "all", maxMin: null, query: "", hideDone: false });

  return (
    <section
      id="pool"
      aria-label="筛选任务"
      className="sticky top-16 z-30 -mx-4 mt-10 border-y border-line/70 bg-paper/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar [mask-image:linear-gradient(to_right,black_calc(100%-28px),transparent)] sm:gap-1.5 sm:[mask-image:none]">
            <Chip
              active={filters.category === "all"}
              color="#e2552b"
              onClick={() => onChange({ ...filters, category: "all" })}
            >
              全部
              <Count>{totalCount}</Count>
            </Chip>
            {lists.map((list) => (
              <Chip
                key={list.id}
                active={filters.category === list.id}
                color={list.color}
                onClick={() => onChange({ ...filters, category: list.id })}
              >
                <span className="text-[13px] leading-none">{list.icon}</span>
                {list.name}
                <Count>{list.tasks.length}</Count>
              </Chip>
            ))}
          </div>

          <span className="hidden h-5 w-px shrink-0 bg-line lg:block" />

          <div className="hidden shrink-0 items-center gap-1 lg:flex">
            {TIME_FILTERS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onChange({ ...filters, maxMin: option.value })}
                aria-pressed={filters.maxMin === option.value}
                className={cn(
                  "rounded-full px-2.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition",
                  filters.maxMin === option.value
                    ? "bg-brand-soft text-brand ring-1 ring-brand/25 ring-inset"
                    : "text-ink-faint hover:bg-sunken hover:text-ink-soft",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label="更多筛选"
            className={cn(
              "relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition lg:hidden",
              mobileOpen || advancedActive
                ? "border-brand/30 bg-brand-soft text-brand"
                : "border-line bg-raised text-ink-soft",
            )}
          >
            <IconFilter className="h-4 w-4" />
            {advancedActive && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand ring-2 ring-paper" />
            )}
          </button>
        </div>

        <div
          className={cn(
            "gap-2.5",
            mobileOpen ? "flex flex-col items-stretch" : "hidden",
            "lg:flex lg:flex-row lg:items-center lg:gap-3",
          )}
        >
          <div className="flex w-full flex-wrap items-center gap-1 lg:hidden">
            {TIME_FILTERS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onChange({ ...filters, maxMin: option.value })}
                aria-pressed={filters.maxMin === option.value}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition",
                  filters.maxMin === option.value
                    ? "border-brand/25 bg-brand-soft text-brand"
                    : "border-line bg-raised text-ink-soft",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex w-full items-center gap-2 lg:contents">
          <div className="relative flex-1 lg:w-[260px] lg:flex-none">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              ref={searchRef}
              type="search"
              value={filters.query}
              onChange={(event) => onChange({ ...filters, query: event.target.value })}
              placeholder="搜一搜想做的事…"
              aria-label="搜索微任务"
              className="h-9 w-full rounded-full border border-line bg-raised pr-8 pl-9 text-[13px] text-ink transition placeholder:text-ink-faint focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/15"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => onChange({ ...filters, query: "" })}
                aria-label="清空搜索"
                className="absolute top-1/2 right-2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-ink-faint hover:bg-sunken hover:text-ink"
              >
                <IconClose className="h-3 w-3" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => onChange({ ...filters, hideDone: !filters.hideDone })}
            aria-pressed={filters.hideDone}
            aria-label={filters.hideDone ? "显示今天已完成的微任务" : "隐藏今天已完成的微任务"}
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-full border text-[12px] font-medium transition lg:w-auto lg:justify-start lg:px-3",
              filters.hideDone
                ? "border-brand/25 bg-brand-soft text-brand"
                : "border-line bg-raised text-ink-soft hover:border-line-strong",
            )}
          >
            <IconEyeOff className="h-4 w-4 lg:hidden" />
            <span
              className={cn(
                "hidden h-3.5 w-3.5 place-items-center rounded-full border lg:grid",
                filters.hideDone ? "border-brand bg-brand text-white" : "border-line-strong",
              )}
            >
              {filters.hideDone && (
                <svg viewBox="0 0 12 12" className="h-2 w-2" fill="none">
                  <path
                    d="M2 6.2 4.6 8.8 10 3.4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="hidden lg:inline">隐藏已完成</span>
            <span className="sr-only lg:hidden">隐藏已完成</span>
          </button>

          <p className="ml-auto hidden text-[12px] text-ink-faint lg:block">
            显示 <span className="num font-semibold text-ink-soft">{visibleCount}</span> 项 · 今日已完成{" "}
            <span className="num font-semibold text-ink-soft">{doneCount}</span> 项
          </p>

          {dirty && (
            <button
              type="button"
              onClick={resetAll}
              className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[12px] text-ink-soft transition hover:border-line-strong hover:text-ink"
            >
              重置
            </button>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-medium transition sm:py-1.5",
        active
          ? "border-transparent text-white shadow-sm"
          : "border-line bg-raised text-ink-soft hover:border-line-strong hover:text-ink",
      )}
      style={
        active
          ? { backgroundColor: color, boxShadow: `0 6px 16px -8px ${withAlpha(color, 0.9)}` }
          : undefined
      }
    >
      {children}
    </button>
  );
}

function Count({ children }: { children: React.ReactNode }) {
  return <span className="ml-0.5 text-[11px] opacity-60">{children}</span>;
}
