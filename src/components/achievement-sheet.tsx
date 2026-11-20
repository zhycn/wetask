"use client";

import { useMemo, useRef, useState } from "react";
import type { TaskList } from "@/data/types";
import { parseProgress, type ProgressState, type Stats } from "@/lib/progress";
import { buildShareText, renderShareCard } from "@/lib/share-card";
import { formatDateLabel } from "@/lib/date";
import { cn, withAlpha } from "@/lib/utils";
import { Modal } from "./modal";
import { SharePreview } from "./share-preview";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconClose,
  IconCopy,
  IconDownload,
  IconFlame,
  IconTarget,
  IconTrash,
  IconUpload,
} from "./icons";

type Props = {
  open: boolean;
  stats: Stats;
  lists: TaskList[];
  progress: ProgressState;
  onImport: (incoming: ProgressState) => void;
  onClose: () => void;
  onReset: () => void;
  onPick: () => void;
  onToast: (message: string) => void;
};

export function AchievementSheet({
  open,
  stats,
  lists,
  progress,
  onImport,
  onClose,
  onReset,
  onPick,
  onToast,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"save" | "copy" | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const ranked = useMemo(
    () =>
      lists
        .map((list) => ({ list, count: stats.byList[list.id] ?? 0 }))
        .sort((a, b) => b.count - a.count),
    [lists, stats.byList],
  );

  const maxDay = Math.max(1, ...stats.last7.map((day) => day.count));
  const maxList = Math.max(1, ...ranked.map((entry) => entry.count));
  const maxMonth = Math.max(1, ...stats.last30.map((day) => day.count));
  const empty = stats.totalCheckins === 0;
  const weekDelta = stats.weekCheckins - stats.prevWeekCheckins;
  const unlockedCount = BADGES.filter((badge) => badge.test(stats)).length;

  const handleSave = async () => {
    setBusy("save");
    try {
      const dataUrl = await renderShareCard(stats, lists, stats.today);
      setPreview(dataUrl);
    } catch {
      onToast("生成图片失败了，试试复制文案");
    } finally {
      setBusy(null);
    }
  };

  const handleExport = () => {
    const payload = {
      app: "WeTask",
      version: 1,
      exportedAt: new Date().toISOString(),
      days: progress.days,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wetask-backup-${stats.today || "export"}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onToast("备份文件已导出");
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseProgress(JSON.parse(text));
      if (!parsed) {
        onToast("备份文件格式不对，没有导入");
        return;
      }
      const days = Object.keys(parsed.days).length;
      if (days === 0) {
        onToast("这个备份里没有打卡记录");
        return;
      }
      onImport(parsed);
      onToast(`已合并 ${days} 天的打卡记录`);
    } catch {
      onToast("读取文件失败，请确认是 WeTask 导出的 JSON");
    }
  };

  const handleCopy = async () => {
    setBusy("copy");
    const text = buildShareText(stats);
    try {
      await navigator.clipboard.writeText(text);
      onToast("分享文案已复制");
    } catch {
      onToast("浏览器不允许复制，请手动选中文案");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
    <Modal open={open} onClose={onClose} side="right" labelledBy="ach-title">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-raised px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <div>
          <h2 id="ach-title" className="text-[16px] font-semibold tracking-tight">
            我的成就
          </h2>
          <p className="mt-0.5 text-[11.5px] text-ink-faint">
            {formatDateLabel(stats.today)} · 只保存在这台设备
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭成就面板"
          className="grid h-8 w-8 place-items-center rounded-full text-ink-faint transition hover:bg-sunken hover:text-ink"
        >
          <IconClose className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-6">
        {empty ? (
          <div className="py-14 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-soft text-[30px]">
              🏁
            </div>
            <h3 className="mt-4 text-[16px] font-semibold">还没有任何打卡记录</h3>
            <p className="mx-auto mt-1.5 max-w-[260px] text-[12.5px] leading-relaxed text-ink-soft">
              完成第一个微任务，这里就会开始记录你的连续天数、领域分布和投入时间。
            </p>
            <button
              type="button"
              onClick={onPick}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-[13px] font-semibold text-brand-ink"
            >
              先来一个微任务
            </button>
          </div>
        ) : (
          <>
            {/* 连续打卡 */}
            <div className="relative overflow-hidden rounded-[22px] border border-brand/15 bg-gradient-to-br from-brand-soft via-brand-soft/60 to-transparent p-5">
              <div
                aria-hidden="true"
                className="absolute -top-8 -right-4 text-[86px] leading-none opacity-20 select-none"
              >
                🔥
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-brand">
                <IconFlame className="h-3.5 w-3.5" />
                当前连续打卡
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="num text-[46px] leading-none font-bold tracking-tight">
                  {stats.currentStreak}
                </span>
                <span className="text-[13px] font-medium text-ink-soft">天</span>
                <span className="ml-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10.5px] font-medium text-brand">
                  最长 {stats.longestStreak} 天
                </span>
              </div>
              <p className="mt-2 text-[12px] text-ink-soft">
                {stats.streakPendingToday
                  ? "今天还没打卡，完成一项就能把连续记录接上。"
                  : `今天已打卡，明天再来一次就是 ${stats.currentStreak + 1} 天。`}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-faint">
                {stats.currentStreakRest > 0
                  ? `这段连续里含 ${stats.currentStreakRest} 天休息日，休息不算中断。`
                  : stats.restAvailableThisWeek
                    ? "每周可以休息 1 天，连续记录不会中断。"
                    : "本周的休息日已经用过了。"}
              </p>
            </div>

            {/* 四宫格 */}
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <StatTile
                icon={<IconCheck className="h-3.5 w-3.5" />}
                label="累计完成"
                value={stats.totalCheckins}
                unit="项"
              />
              <StatTile
                icon={<IconCalendar className="h-3.5 w-3.5" />}
                label="打卡天数"
                value={stats.activeDays}
                unit="天"
              />
              <StatTile
                icon={<IconClock className="h-3.5 w-3.5" />}
                label="累计投入"
                value={stats.minutes}
                unit="分钟"
              />
              <StatTile
                icon={<IconTarget className="h-3.5 w-3.5" />}
                label="解锁任务"
                value={stats.uniqueTasksDone}
                unit={`/${lists.reduce((sum, list) => sum + list.tasks.length, 0)}`}
              />
            </div>

            {/* 最近 7 天 */}
            <section className="mt-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[13px] font-semibold">最近 7 天</h3>
                <span className="text-[11px] text-ink-faint">
                  本周 {stats.weekCheckins} 项
                  {stats.prevWeekCheckins > 0 && (
                    <span className={cn("ml-1.5 font-medium", weekDelta >= 0 ? "text-emerald-600" : "text-ink-soft")}>
                      {weekDelta >= 0 ? `+${weekDelta}` : weekDelta}
                    </span>
                  )}
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-1.5 rounded-2xl border border-line bg-raised px-3 py-3">
                {stats.last7.map((day) => {
                  const intensity = day.count === 0 ? 0 : 0.22 + (day.count / maxDay) * 0.78;
                  if (day.isRest) {
                    return (
                      <div key={day.key} className="flex flex-1 flex-col items-center gap-1.5">
                        <div
                          title={`${day.key}：休息日`}
                          className="grid aspect-square w-full max-w-[42px] place-items-center rounded-[11px] border border-dashed border-ink-faint/40 text-[11px] text-ink-faint"
                        >
                          休
                        </div>
                        <span className="text-[10px] text-ink-faint">{day.label}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={day.key} className="flex flex-1 flex-col items-center gap-1.5">
                      <div
                        title={`${day.key}：${day.count} 项`}
                        className={cn(
                          "grid aspect-square w-full max-w-[42px] place-items-center rounded-[11px] text-[12px] font-semibold transition",
                          day.count === 0
                            ? "border border-line/80 bg-sunken/50 text-ink-faint/50"
                            : "text-white",
                        )}
                        style={
                          day.count > 0
                            ? { backgroundColor: withAlpha("#e2552b", intensity) }
                            : undefined
                        }
                      >
                        {day.count > 0 ? day.count : ""}
                        {day.count === 0 && day.isToday ? (
                          <span className="h-1 w-1 rounded-full bg-ink-faint/50" />
                        ) : null}
                      </div>
                      <span
                        className={cn(
                          "text-[10px]",
                          day.isToday ? "font-semibold text-ink" : "text-ink-faint",
                        )}
                      >
                        {day.isToday ? "今天" : day.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 近 30 天 */}
            <section className="mt-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[13px] font-semibold">近 30 天</h3>
                <span className="flex items-center gap-1 text-[10.5px] text-ink-faint">
                  少
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-sunken" />
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: withAlpha("#e2552b", 0.35) }} />
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: withAlpha("#e2552b", 0.7) }} />
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: "#e2552b" }} />
                  多
                </span>
              </div>
              <div className="mt-3 grid grid-cols-10 gap-1.5 rounded-2xl border border-line bg-raised p-3">
                {stats.last30.map((day) => {
                  const level = day.count === 0 ? 0 : Math.min(3, Math.ceil((day.count / maxMonth) * 3));
                  return (
                    <div
                      key={day.key}
                      title={`${day.key}：${day.isRest ? "休息日" : `${day.count} 项`}`}
                      className={cn(
                        "aspect-square rounded-[4px]",
                        level === 0 && "bg-sunken",
                        day.isRest && "border border-dashed border-ink-faint/50",
                        day.isToday && "ring-1 ring-brand/50 ring-offset-1 ring-offset-raised",
                      )}
                      style={
                        level > 0
                          ? { backgroundColor: withAlpha("#e2552b", 0.25 + level * 0.25) }
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            </section>

            {/* 领域分布 */}
            <section className="mt-6">
              <h3 className="text-[13px] font-semibold">各领域完成</h3>
              <div className="mt-3 space-y-2.5">
                {ranked.map(({ list, count }) => (
                  <div key={list.id} className="flex items-center gap-3">
                    <span className="w-[52px] shrink-0 text-[12px] font-medium text-ink-soft">
                      {list.name}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-sunken">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${count === 0 ? 0 : Math.max(6, (count / maxList) * 100)}%`,
                          backgroundColor: list.color,
                        }}
                      />
                    </div>
                    <span
                      className={cn(
                        "num w-6 shrink-0 text-right text-[11.5px] font-semibold",
                        count > 0 ? "text-ink" : "text-ink-faint",
                      )}
                    >
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 徽章 */}
            <section className="mt-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[13px] font-semibold">徽章</h3>
                <span className="num text-[11px] text-ink-faint">
                  {unlockedCount}/{BADGES.length}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {BADGES.map((badge) => {
                  const unlocked = badge.test(stats);
                  return (
                    <div
                      key={badge.id}
                      title={`${badge.label} · ${badge.desc}`}
                      className={cn(
                        "rounded-2xl border px-2 py-2.5 text-center transition",
                        unlocked
                          ? "border-brand/20 bg-brand-soft/60"
                          : "border-line bg-sunken/40 opacity-55",
                      )}
                    >
                      <div className="text-[18px]" aria-hidden="true">
                        {unlocked ? "🏅" : "🔒"}
                      </div>
                      <div className="mt-1 truncate text-[11px] font-semibold">{badge.label}</div>
                      <div className="mt-0.5 truncate text-[9.5px] text-ink-faint">{badge.desc}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="mt-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[13px] font-semibold">数据备份</h3>
                <span className="text-[10.5px] text-ink-faint">换设备、换浏览器时用得上</span>
              </div>
              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-raised text-[12px] font-medium text-ink transition hover:border-line-strong"
                >
                  <IconDownload className="h-3.5 w-3.5" />
                  导出备份
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-raised text-[12px] font-medium text-ink transition hover:border-line-strong"
                >
                  <IconUpload className="h-3.5 w-3.5" />
                  导入备份
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={handleImport}
                />
              </div>
            </section>

            <div className="mt-6 border-t border-line pt-4">
              {confirmReset ? (
                <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/5 p-2.5">
                  <p className="flex-1 pl-1 text-[11.5px] leading-snug text-ink-soft">
                    清空后所有打卡记录都会消失，无法恢复。
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onReset();
                      setConfirmReset(false);
                      onToast("打卡记录已清空");
                    }}
                    className="h-8 shrink-0 rounded-full bg-red-500 px-3 text-[11.5px] font-semibold text-white"
                  >
                    确认清空
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="h-8 shrink-0 rounded-full px-2 text-[11.5px] text-ink-soft hover:bg-sunken"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="mx-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] text-ink-faint transition hover:text-red-500"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                  清空打卡记录
                </button>
              )}
              <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-faint">
                数据只保存在当前浏览器，换设备或清理缓存会丢失。
              </p>
            </div>
          </>
        )}
      </div>

      {!empty && (
        <footer className="border-t border-line bg-raised px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleSave}
              disabled={busy === "save"}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-[13px] font-semibold text-paper transition hover:opacity-85 disabled:opacity-60"
            >
              <IconDownload className="h-4 w-4" />
              {busy === "save" ? "生成中…" : "生成分享图"}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={busy === "copy"}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-raised text-[13px] font-medium text-ink transition hover:border-line-strong disabled:opacity-60"
            >
              <IconCopy className="h-4 w-4" />
              {busy === "copy" ? "复制中…" : "复制文案"}
            </button>
          </div>
        </footer>
      )}
    </Modal>

    <SharePreview
      dataUrl={preview}
      filename={`wetask-${stats.today}.png`}
      onClose={() => setPreview(null)}
      onToast={onToast}
    />
    </>
  );
}

function StatTile({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-raised px-3.5 py-3">
      <div className="flex items-center gap-1 text-[11px] font-medium text-ink-faint">
        {icon}
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-0.5">
        <span className="num text-[22px] leading-none font-bold">{value}</span>
        <span className="text-[11px] font-medium text-ink-faint">{unit}</span>
      </div>
    </div>
  );
}

const BADGES = [
  {
    id: "first",
    label: "第一步",
    desc: "完成第 1 项",
    test: (s: Stats) => s.totalCheckins >= 1,
  },
  {
    id: "ten",
    label: "小有所成",
    desc: "累计 10 项",
    test: (s: Stats) => s.totalCheckins >= 10,
  },
  {
    id: "streak3",
    label: "三日不断",
    desc: "连续 3 天",
    test: (s: Stats) => s.longestStreak >= 3,
  },
  {
    id: "streak7",
    label: "一周坚持",
    desc: "连续 7 天",
    test: (s: Stats) => s.longestStreak >= 7,
  },
  {
    id: "hour",
    label: "一小时",
    desc: "投入 60 分钟",
    test: (s: Stats) => s.minutes >= 60,
  },
  {
    id: "allround",
    label: "全面发展",
    desc: "4 个领域",
    test: (s: Stats) => Object.values(s.byList).filter((n) => n > 0).length >= 4,
  },
];
