"use client";

import { useId } from "react";
import { IconArrowRight, IconDice, IconFlame, IconSparkle } from "./icons";
import { DAILY_GOAL } from "@/lib/constants";

type Props = {
  todayDone: number;
  currentStreak: number;
  totalCheckins: number;
  yesterdayCount: number;
  totalTasks: number;
  listCount: number;
  dateLabel: string;
  greeting: string;
  onPick: () => void;
  onOpenAchievements: () => void;
};

export function Hero({
  todayDone,
  currentStreak,
  totalCheckins,
  yesterdayCount,
  totalTasks,
  listCount,
  dateLabel,
  greeting,
  onPick,
  onOpenAchievements,
}: Props) {
  const gradientId = useId();
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, todayDone / DAILY_GOAL);
  const goalDone = todayDone >= DAILY_GOAL;

  return (
    <section className="relative pt-8 sm:pt-12 lg:pt-14" aria-labelledby="hero-title">
      <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:gap-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-raised/80 px-3 py-1.5 text-[12px] font-medium text-ink-soft shadow-soft">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            {greeting}，今天是 {dateLabel}
          </div>

          <h1
            id="hero-title"
            className="mt-5 text-[38px] leading-[1.08] font-bold tracking-tight text-balance sm:text-[52px] lg:text-[60px]"
          >
            不知道做什么时，
            <br />
            上{" "}
            <span className="relative inline-block text-brand">
              WeTask
              <svg
                aria-hidden="true"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1.5 left-0 h-2.5 w-full text-brand/45"
              >
                <path
                  d="M2 8.5C40 3.5 92 2.5 198 6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-ink-soft sm:text-base">
            {totalTasks} 个 5–25 分钟就能做完的小事，已经按领域替你挑好。
            不用想「该做什么」，抽一个、做完、勾掉——今天的自己就算赢了一点。
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onPick}
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-brand pl-5 pr-6 text-[15px] font-semibold text-brand-ink shadow-[0_14px_30px_-14px_rgba(226,85,43,0.9)] transition hover:brightness-105 active:scale-[0.985]"
            >
              <IconDice className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-rotate-12" />
              随机来一个
              <kbd className="ml-0.5 hidden rounded-md border border-white/25 bg-white/10 px-1.5 py-0.5 font-sans text-[10px] font-medium text-white/75 transition group-hover:border-white/40 sm:inline">
                R
              </kbd>
            </button>
            <button
              type="button"
              onClick={onOpenAchievements}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-raised px-5 text-[15px] font-medium text-ink transition hover:border-line-strong hover:bg-sunken/60 active:scale-[0.985]"
            >
              我的成就
              <IconArrowRight className="h-4 w-4 text-ink-faint" />
            </button>
          </div>

          <dl className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px]">
            <div className="flex items-baseline gap-2">
              <dt className="text-ink-faint">今日完成</dt>
              <dd className="num text-[17px] font-bold">{todayDone}</dd>
            </div>
            <div className="h-3 w-px bg-line" />
            <div className="flex items-baseline gap-2">
              <dt className="flex items-center gap-1 text-ink-faint">
                <IconFlame className="h-3.5 w-3.5 text-brand" />
                连续
              </dt>
              <dd className="num text-[17px] font-bold">{currentStreak}</dd>
              <span className="text-ink-faint">天</span>
            </div>
            <div className="h-3 w-px bg-line" />
            <div className="flex items-baseline gap-2">
              <dt className="text-ink-faint">累计</dt>
              <dd className="num text-[17px] font-bold">{totalCheckins}</dd>
              <span className="text-ink-faint">项</span>
            </div>
            <div className="hidden h-3 w-px bg-line sm:block" />
            <div className="hidden items-baseline gap-2 sm:flex">
              <dt className="text-ink-faint">任务池</dt>
              <dd className="num text-[17px] font-bold">{listCount}</dd>
              <span className="text-ink-faint">个领域</span>
            </div>
          </dl>

          {todayDone === 0 && yesterdayCount > 0 && (
            <p className="mt-4 text-[12px] text-ink-faint">
              昨天完成 <span className="num font-semibold text-ink-soft">{yesterdayCount}</span>{" "}
              项，今天想继续吗？先来一个 5 分钟的就好。
            </p>
          )}

          <div className="mt-6 rounded-2xl border border-line bg-raised/70 px-4 py-3 lg:hidden">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="font-medium text-ink-soft">今日目标 · {DAILY_GOAL} 项就够</span>
              <span className="num font-semibold text-ink-faint">
                {Math.min(todayDone, DAILY_GOAL)}
                <span className="font-normal">/{DAILY_GOAL}</span>
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sunken">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
                style={{ width: `${Math.min(100, (todayDone / DAILY_GOAL) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="animate-rise relative overflow-hidden rounded-[28px] border border-line bg-raised p-6 shadow-soft">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-2xl"
            />
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink-soft">今日目标</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sunken px-2 py-1 text-[11px] font-medium text-ink-soft">
                <IconSparkle className="h-3 w-3 text-brand" />
                {DAILY_GOAL} 项就够
              </span>
            </div>

            <div className="relative mx-auto mt-5 grid h-[152px] w-[152px] place-items-center">
              <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ff8a5c" />
                    <stop offset="100%" stopColor="#e2552b" />
                  </linearGradient>
                </defs>
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke="var(--line)"
                  strokeWidth="9"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.16,1,0.3,1)" }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="num text-[30px] leading-none font-bold">
                    {Math.min(todayDone, DAILY_GOAL)}
                    <span className="text-[15px] font-medium text-ink-faint">/{DAILY_GOAL}</span>
                  </div>
                  <div className="mt-1 text-[11px] font-medium text-ink-faint">
                    {goalDone ? "目标达成 🎉" : todayDone > 0 ? "今天已打卡" : "还没开始"}
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[12px] leading-relaxed text-ink-faint">
              {goalDone
                ? "今天已经很不错了，剩下的留给明天。"
                : `再完成 ${DAILY_GOAL - todayDone} 项就能收工，5 分钟也算。`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
