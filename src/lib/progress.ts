import { shiftKey, toDateKey, todayKey } from "./date";

/**
 * 打卡记录只保存「每个日期完成了哪些微任务」。
 * 其它数据（累计数、连续天数、每个任务完成过几次、领域分布）都由它推导，
 * 避免出现多份真相不一致。
 */
export type ProgressState = {
  version: 1;
  /** 日期键(YYYY-MM-DD) -> 当天完成的 microTaskId 列表（已去重） */
  days: Record<string, string[]>;
};

export const STORAGE_KEY = "wetask.progress.v1";

export const emptyProgress = (): ProgressState => ({ version: 1, days: {} });

export function parseProgress(raw: unknown): ProgressState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<ProgressState>;
  if (!value.days || typeof value.days !== "object") return null;
  const days: Record<string, string[]> = {};
  for (const [key, ids] of Object.entries(value.days)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
    if (!Array.isArray(ids)) continue;
    const unique = Array.from(new Set(ids.filter((id) => typeof id === "string" && id.length > 0)));
    if (unique.length > 0) days[key] = unique;
  }
  return { version: 1, days };
}

/** 合并两份记录（用于导入备份，取并集，不覆盖已有数据）。 */
export function mergeProgress(base: ProgressState, incoming: ProgressState): ProgressState {
  const days: Record<string, string[]> = { ...base.days };
  for (const [key, ids] of Object.entries(incoming.days)) {
    days[key] = Array.from(new Set([...(days[key] ?? []), ...ids]));
  }
  return { version: 1, days };
}

export function loadProgress(key: string = STORAGE_KEY): ProgressState {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return emptyProgress();
    const parsed: unknown = JSON.parse(raw);
    return parseProgress(parsed) ?? emptyProgress();
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(state: ProgressState, key: string = STORAGE_KEY): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* 隐私模式或空间不足时静默失败，保证页面可用 */
  }
}

/** 勾选 / 取消勾选某个任务（同一天内可撤销误点）。 */
export function toggleTask(
  state: ProgressState,
  taskId: string,
  dateKey: string = todayKey(),
): ProgressState {
  const current = state.days[dateKey] ?? [];
  const exists = current.includes(taskId);
  const nextDay = exists ? current.filter((id) => id !== taskId) : [...current, taskId];
  const days = { ...state.days };

  if (nextDay.length > 0) days[dateKey] = nextDay;
  else delete days[dateKey];

  return { ...state, days };
}

export function completedOn(state: ProgressState, dateKey: string): Set<string> {
  return new Set(state.days[dateKey] ?? []);
}

export function completionCount(state: ProgressState, taskId: string): number {
  let count = 0;
  for (const ids of Object.values(state.days)) if (ids.includes(taskId)) count += 1;
  return count;
}

export function lastCompletedOn(state: ProgressState, taskId: string): string | null {
  let latest: string | null = null;
  for (const [key, ids] of Object.entries(state.days)) {
    if (ids.includes(taskId) && (!latest || key > latest)) latest = key;
  }
  return latest;
}

export type DayStat = {
  key: string;
  count: number;
  isToday: boolean;
  label: string;
  /** 被「每周休息日」补上的空缺 */
  isRest: boolean;
};

export type Stats = {
  today: string;
  todayDone: number;
  totalCheckins: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  /** 今天还没打卡，但昨天的连续记录还在 */
  streakPendingToday: boolean;
  uniqueTasksDone: number;
  minutes: number;
  byList: Record<string, number>;
  byTask: Record<string, number>;
  last7: DayStat[];
  last30: DayStat[];
  weekCheckins: number;
  weekMinutes: number;
  /** 上一个 7 天的完成数，用于本周对比 */
  prevWeekCheckins: number;
  /** 被「每周休息日」自动补上的日期 */
  restDays: string[];
  /** 当前连续记录里包含的休息日天数 */
  currentStreakRest: number;
  /** 本周的休息日额度是否还没用 */
  restAvailableThisWeek: boolean;
  /** 昨天完成了多少项（回来了的提示） */
  yesterdayCount: number;
};

type TaskMeta = { id: string; estMin: number; listId: string };

const DAY_LABEL = ["日", "一", "二", "三", "四", "五", "六"];

/** 尚未拿到本地日期时的空统计（服务端渲染与首帧使用）。 */
export function emptyStats(today = ""): Stats {
  return {
    today,
    todayDone: 0,
    totalCheckins: 0,
    activeDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    streakPendingToday: false,
    uniqueTasksDone: 0,
    minutes: 0,
    byList: {},
    byTask: {},
    last7: [],
    last30: [],
    weekCheckins: 0,
    weekMinutes: 0,
    prevWeekCheckins: 0,
    restDays: [],
    currentStreakRest: 0,
    restAvailableThisWeek: true,
    yesterdayCount: 0,
  };
}

/** 自然周（周一为一周开始）的标识。 */
function weekKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return toDateKey(date);
}

/** 找出可以被「每周休息日」补上的单个空缺。 */
function findRestDays(activeKeys: string[]): Set<string> {
  const usedWeeks = new Set<string>();
  const rest = new Set<string>();
  for (let index = 0; index < activeKeys.length - 1; index += 1) {
    const gap = shiftKey(activeKeys[index], 1);
    if (gap === activeKeys[index + 1]) continue;
    // 只补前后都打了卡的单个空缺；断两天以上就是真的中断
    if (shiftKey(gap, 1) !== activeKeys[index + 1]) continue;
    const week = weekKey(gap);
    if (usedWeeks.has(week)) continue;
    usedWeeks.add(week);
    rest.add(gap);
  }
  return rest;
}

/** 由打卡记录推导所有成就数据。 */
export function computeStats(state: ProgressState, tasks: TaskMeta[], today: string): Stats {
  const metaById = new Map(tasks.map((task) => [task.id, task]));
  const dayKeys = Object.keys(state.days).sort();

  const byTask: Record<string, number> = {};
  const byList: Record<string, number> = {};
  let totalCheckins = 0;
  let minutes = 0;

  for (const key of dayKeys) {
    for (const taskId of state.days[key]) {
      const meta = metaById.get(taskId);
      if (!meta) continue; // 任务池里已删除的旧任务，忽略但不清除记录
      byTask[taskId] = (byTask[taskId] ?? 0) + 1;
      byList[meta.listId] = (byList[meta.listId] ?? 0) + 1;
      totalCheckins += 1;
      minutes += meta.estMin;
    }
  }

  /**
   * 连续天数：每周允许 1 天「休息日」不中断。
   * 依据 2026 年 Berkeley 的 RCT：允许每周 1–2 天跳过日的组，习惯自动化程度显著更高。
   * 规则很克制：只补「前后两天都打了卡」的单个空缺，每周最多补 1 天，绝不掩盖真正的放弃。
   */
  const activeSet = new Set(dayKeys);
  const restSet = findRestDays(dayKeys);
  const covered = Array.from(new Set([...dayKeys, ...restSet])).sort();

  const streakPendingToday = !activeSet.has(today);
  const coveredSet = new Set(covered);
  let cursor = coveredSet.has(today) ? today : shiftKey(today, -1);
  let currentStreak = 0;
  let currentStreakRest = 0;
  while (coveredSet.has(cursor)) {
    if (activeSet.has(cursor)) currentStreak += 1;
    else currentStreakRest += 1;
    cursor = shiftKey(cursor, -1);
  }

  let longestStreak = 0;
  let runActive = 0;
  let prevKey: string | null = null;
  for (const key of covered) {
    if (!prevKey || shiftKey(prevKey, 1) !== key) runActive = 0;
    if (activeSet.has(key)) runActive += 1;
    longestStreak = Math.max(longestStreak, runActive);
    prevKey = key;
  }

  const weekSet = new Set(Array.from(restSet, (key) => weekKey(key)));
  const restAvailableThisWeek = !weekSet.has(weekKey(today));

  const dayStat = (offset: number): DayStat => {
    const key = shiftKey(today, offset);
    const date = new Date(`${key}T00:00:00`);
    return {
      key,
      count: (state.days[key] ?? []).filter((id) => metaById.has(id)).length,
      isToday: key === today,
      label: DAY_LABEL[date.getDay()],
      isRest: restSet.has(key),
    };
  };

  const last7 = Array.from({ length: 7 }, (_, index) => dayStat(index - 6));
  const last30 = Array.from({ length: 30 }, (_, index) => dayStat(index - 29));
  const prevWeekCheckins = Array.from({ length: 7 }, (_, index) => dayStat(index - 13)).reduce(
    (sum, day) => sum + day.count,
    0,
  );

  return {
    today,
    todayDone: (state.days[today] ?? []).filter((id) => metaById.has(id)).length,
    totalCheckins,
    activeDays: dayKeys.filter((key) => (state.days[key] ?? []).some((id) => metaById.has(id)))
      .length,
    currentStreak,
    longestStreak,
    streakPendingToday,
    uniqueTasksDone: Object.keys(byTask).length,
    minutes,
    byList,
    byTask,
    last7,
    last30,
    prevWeekCheckins,
    restDays: Array.from(restSet).sort(),
    currentStreakRest,
    restAvailableThisWeek,
    yesterdayCount: (state.days[shiftKey(today, -1)] ?? []).filter((id) => metaById.has(id)).length,
    weekCheckins: last7.reduce((sum, day) => sum + day.count, 0),
    weekMinutes: last7.reduce(
      (sum, day) =>
        sum + (state.days[day.key] ?? []).reduce((s, id) => s + (metaById.get(id)?.estMin ?? 0), 0),
      0,
    ),
  };
}
