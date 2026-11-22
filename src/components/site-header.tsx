"use client";

import { BrandMark } from "./brand-mark";
import { IconHelp, IconMoon, IconSun, IconTrophy } from "./icons";
import type { Theme } from "@/hooks/use-theme";
import type { Workspace } from "@/lib/workspaces";
import { WorkspaceSwitcher } from "./workspace-switcher";

type Props = {
  todayDone: number;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenAchievements: () => void;
  onOpenHelp: () => void;
  workspace: Workspace | null;
  workspaceCount: number;
  onOpenWorkspaces: () => void;
};

export function SiteHeader({
  todayDone,
  theme,
  onToggleTheme,
  onOpenAchievements,
  onOpenHelp,
  workspace,
  workspaceCount,
  onOpenWorkspaces,
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5 rounded-full" aria-label="WeTask 首页">
          <BrandMark size={34} />
          <span className="flex items-baseline gap-2">
            <span className="text-[17px] font-bold tracking-tight">WeTask</span>
            <span className="hidden text-[12px] font-medium text-ink-faint sm:inline">
              微任务打卡
            </span>
          </span>
        </a>

        <WorkspaceSwitcher active={workspace} count={workspaceCount} onClick={onOpenWorkspaces} />

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <span
            className="hidden items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 text-[12px] font-medium text-ink-soft sm:inline-flex"
            title="今日完成的微任务"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            今日 <span className="num font-semibold text-ink">{todayDone}</span>
            <span className="text-ink-faint">项</span>
          </span>

          <button
            type="button"
            onClick={onOpenHelp}
            aria-label="查看使用说明"
            className="hidden h-9 w-9 place-items-center rounded-full border border-line bg-raised text-ink-soft transition hover:border-line-strong hover:text-ink sm:grid"
          >
            <IconHelp className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-raised text-ink-soft transition hover:border-line-strong hover:text-ink"
          >
            {theme === "dark" ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenAchievements}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[13px] font-semibold text-paper transition hover:opacity-85 active:scale-[0.98] sm:gap-2 sm:px-4"
          >
            <IconTrophy className="h-4 w-4" />
            我的成就
          </button>
        </div>
      </div>
    </header>
  );
}
