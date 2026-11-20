/** 每日目标：达到就算「今天没白过」，避免用户被 60+ 个任务吓退。 */
export const DAILY_GOAL = 3;

/** 时长筛选档位（分钟）。 */
export const TIME_FILTERS: { label: string; value: number | null }[] = [
  { label: "不限时长", value: null },
  { label: "≤ 5 分钟", value: 5 },
  { label: "≤ 10 分钟", value: 10 },
  { label: "≤ 15 分钟", value: 15 },
];
