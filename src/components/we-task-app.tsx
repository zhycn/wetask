"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { taskIndex, taskLists } from "@/data";
import type { MicroTask, TaskList } from "@/data/types";
import { AchievementSheet } from "./achievement-sheet";
import { BrandMark } from "./brand-mark";
import { FilterBar, type Filters } from "./filter-bar";
import { HelpDialog } from "./help-dialog";
import { Hero } from "./hero";
import { IconDice, IconTrophy } from "./icons";
import { ListBoard } from "./list-board";
import { SiteHeader } from "./site-header";
import { TaskPicker } from "./task-picker";
import { TodayStrip } from "./today-strip";
import { Toaster, type ToastPayload } from "./toast";
import { useProgress } from "@/hooks/use-progress";
import { useStoredState } from "@/hooks/use-stored-state";
import { useTheme } from "@/hooks/use-theme";
import { DAILY_GOAL } from "@/lib/constants";
import { formatDateLabel, greeting } from "@/lib/date";

type Pick = { task: MicroTask; list: TaskList } | null;

const EMPTY_FILTERS: Filters = { category: "all", maxMin: null, query: "", hideDone: false };

export function WeTaskApp() {
  const { state, stats, doneToday, toggle, reset, importProgress } = useProgress();
  const { theme, toggle: toggleTheme } = useTheme();

  const [filters, setFilters] = useStoredState<Filters>("wetask.filters.v1", EMPTY_FILTERS);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerCategory, setPickerCategory] = useState<string | null>(null);
  const [pick, setPick] = useState<Pick>(null);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState<(ToastPayload & { id: number }) | null>(null);

  const toastTimer = useRef<number | null>(null);
  const prevToday = useRef<string | null>(null);

  useEffect(() => {
    if (!stats.today) return;
    if (prevToday.current && prevToday.current !== stats.today) {
      setToast({ message: "新的一天，今天的清单已经刷新", id: Date.now() });
    }
    prevToday.current = stats.today;
  }, [stats.today]);

  const notify = useCallback((payload: ToastPayload | string) => {
    const next = typeof payload === "string" ? { message: payload } : payload;
    setToast({ ...next, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4200);
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [toast]);

  const visibleLists = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return taskLists
      .filter((list) => filters.category === "all" || filters.category === list.id)
      .map((list) => ({
        list,
        tasks: list.tasks.filter((task) => {
          if (filters.hideDone && doneToday.has(task.id)) return false;
          if (filters.maxMin !== null && task.estMin > filters.maxMin) return false;
          if (!query) return true;
          return (
            task.title.toLowerCase().includes(query) ||
            (task.hint ?? "").toLowerCase().includes(query) ||
            list.name.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((entry) => entry.tasks.length > 0);
  }, [filters, doneToday]);

  const todayCompleted = useMemo(() => {
    if (!stats.today) return [];
    return (state.days[stats.today] ?? [])
      .map((id) => taskIndex[id])
      .filter((task): task is (typeof taskIndex)[string] => Boolean(task));
  }, [state.days, stats.today]);

  const visibleCount = useMemo(
    () => visibleLists.reduce((sum, entry) => sum + entry.tasks.length, 0),
    [visibleLists],
  );

  const buildPool = useCallback(
    (category: string | null) => {
      const target = category ?? filters.category;
      return taskLists
        .filter((list) => target === "all" || list.id === target)
        .flatMap((list) =>
          list.tasks
            .filter((task) => filters.maxMin === null || task.estMin <= filters.maxMin)
            .map((task) => ({ task, list })),
        );
    },
    [filters.category, filters.maxMin],
  );

  const draw = useCallback(
    (category: string | null, excludeId?: string) => {
      const pool = buildPool(category);
      let candidates = pool.filter((entry) => !doneToday.has(entry.task.id));
      if (excludeId && candidates.length > 1) {
        candidates = candidates.filter((entry) => entry.task.id !== excludeId);
      }
      if (candidates.length === 0) {
        setPick(null);
        return;
      }
      const choice = candidates[Math.floor(Math.random() * candidates.length)];
      setPick(choice);
    },
    [buildPool, doneToday],
  );

  const openPicker = useCallback(
    (category: string | null = null) => {
      setPickerCategory(category);
      setPickerOpen(true);
      draw(category);
    },
    [draw],
  );

  const handleToggle = useCallback(
    (taskId: string) => {
      const wasDone = doneToday.has(taskId);
      toggle(taskId);
      const nextToday = wasDone ? stats.todayDone - 1 : stats.todayDone + 1;

      if (wasDone) {
        notify("已撤销打卡");
        return;
      }
      if (nextToday === DAILY_GOAL) {
        notify(`今日目标达成 🎉 今天已完成 ${nextToday} 项`);
        return;
      }
      notify({
        message: `已打卡 · 今天第 ${nextToday} 项`,
        actionLabel: "撤销",
        action: () => toggle(taskId),
      });
    },
    [doneToday, notify, stats.todayDone, toggle],
  );

  const handleCompletePick = useCallback(() => {
    if (!pick) return;
    const task = pick.task;
    setPickerOpen(false);
    if (doneToday.has(task.id)) {
      notify("这一项今天已经打过卡了");
      return;
    }
    toggle(task.id);
    const nextToday = stats.todayDone + 1;
    notify({
      message:
        nextToday === DAILY_GOAL
          ? `今日目标达成 🎉 已完成 ${nextToday} 项`
          : `完成「${task.title}」· 今天第 ${nextToday} 项`,
      actionLabel: "再来一个",
      action: () => openPicker(pickerCategory),
    });
  }, [doneToday, notify, openPicker, pick, pickerCategory, stats.todayDone, toggle]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }
      if (pickerOpen || achievementsOpen) return;
      if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        openPicker();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPicker, pickerOpen, achievementsOpen]);

  const handleReset = useCallback(() => {
    reset();
    notify("打卡记录已清空");
  }, [notify, reset]);

  const scopeLabel = pickerCategory
    ? (taskLists.find((list) => list.id === pickerCategory)?.name ?? "全部领域")
    : filters.category === "all"
      ? "全部领域"
      : (taskLists.find((list) => list.id === filters.category)?.name ?? "全部领域");

  return (
    <div id="top" className="relative min-h-dvh">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(226,85,43,0.10),transparent)]" />
        <div className="absolute top-[42%] -left-48 h-[460px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.06),transparent)]" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.05),transparent)]" />
      </div>

      <a
        href="#pool"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-[13px] focus:text-paper"
      >
        跳到任务池
      </a>

      <SiteHeader
        todayDone={stats.todayDone}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
      />

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 sm:px-6 sm:pb-10 lg:px-8">
        <Hero
          todayDone={stats.todayDone}
          currentStreak={stats.currentStreak}
          totalCheckins={stats.totalCheckins}
          yesterdayCount={stats.yesterdayCount}
          totalTasks={taskLists.reduce((sum, list) => sum + list.tasks.length, 0)}
          listCount={taskLists.length}
          dateLabel={stats.today ? formatDateLabel(stats.today) : "今天"}
          greeting={stats.today ? greeting(new Date()) : "你好"}
          onPick={() => openPicker()}
          onOpenAchievements={() => setAchievementsOpen(true)}
        />

        <FilterBar
          lists={taskLists}
          filters={filters}
          visibleCount={visibleCount}
          totalCount={taskLists.reduce((sum, list) => sum + list.tasks.length, 0)}
          doneCount={stats.todayDone}
          onChange={setFilters}
        />

        <TodayStrip
          tasks={todayCompleted}
          onUndo={handleToggle}
          onOpenAchievements={() => setAchievementsOpen(true)}
        />

        <ListBoard
          visibleLists={visibleLists}
          doneToday={doneToday}
          totalVisible={visibleCount}
          onToggle={handleToggle}
          onPickFromList={(listId) => openPicker(listId)}
          onResetFilters={() => setFilters(EMPTY_FILTERS)}
        />

        <footer className="mt-14 border-t border-line/70 pt-8 pb-8 sm:pb-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <BrandMark size={28} />
              <div>
                <p className="text-[13px] font-semibold tracking-tight">WeTask</p>
                <p className="text-[11.5px] text-ink-faint">不知道做什么时，上 WeTask</p>
              </div>
            </div>
            <div className="text-[11.5px] leading-relaxed text-ink-faint sm:text-right">
              <p>免费 · 无广告 · 无追踪 · 无需注册</p>
              <p>数据只保存在本机浏览器，不上传任何内容</p>
              <button
                type="button"
                onClick={() => setHelpOpen(true)}
                className="mt-1.5 text-[11.5px] font-medium text-ink-soft underline decoration-line-strong underline-offset-4 transition hover:text-ink"
              >
                使用说明与快捷键
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* 移动端底部快捷操作 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/92 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => openPicker()}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand text-[14px] font-semibold text-brand-ink shadow-[0_10px_24px_-14px_rgba(226,85,43,0.9)] active:scale-[0.99]"
          >
            <IconDice className="h-4 w-4" />
            随机来一个
          </button>
          <button
            type="button"
            onClick={() => setAchievementsOpen(true)}
            aria-label="打开我的成就"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-raised text-ink active:scale-[0.98]"
          >
            <IconTrophy className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <TaskPicker
        open={pickerOpen}
        pick={pick}
        scopeLabel={scopeLabel}
        onClose={() => setPickerOpen(false)}
        onReroll={() => draw(pickerCategory, pick?.task.id)}
        onComplete={handleCompletePick}
        onOpenAchievements={() => {
          setPickerOpen(false);
          setAchievementsOpen(true);
        }}
        progress={
          pick
            ? {
                done: pick.list.tasks.filter((task) => doneToday.has(task.id)).length,
                total: pick.list.tasks.length,
              }
            : null
        }
      />

      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} onStart={() => {
        setHelpOpen(false);
        openPicker();
      }} />

      <AchievementSheet
        open={achievementsOpen}
        stats={stats}
        lists={taskLists}
        progress={state}
        onImport={importProgress}
        onClose={() => setAchievementsOpen(false)}
        onReset={handleReset}
        onPick={() => {
          setAchievementsOpen(false);
          openPicker();
        }}
        onToast={notify}
      />

      <Toaster toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
