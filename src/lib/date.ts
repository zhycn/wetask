/** 日期工具：全部按「用户本地时区」计算，避免跨时区/UTC 偏移导致的打卡错日。 */

const pad = (n: number) => String(n).padStart(2, "0");

/** 把 Date 转成本地日期键：YYYY-MM-DD */
export function toDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 解析 YYYY-MM-DD 为本地零点的 Date（不要用 new Date(string)，那会按 UTC 解析） */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** 在日期键上加减天数 */
export function shiftKey(key: string, delta: number): string {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + delta);
  return toDateKey(date);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export function weekdayName(key: string): string {
  return WEEKDAYS[fromDateKey(key).getDay()];
}

/** 11月20日 周四 */
export function formatDateLabel(key: string): string {
  const date = fromDateKey(key);
  return `${date.getMonth() + 1}月${date.getDate()}日 周${weekdayName(key)}`;
}

/** 今天 / 昨天 / 11月18日 */
export function formatRelativeDay(key: string, today: string = todayKey()): string {
  if (key === today) return "今天";
  if (key === shiftKey(today, -1)) return "昨天";
  const date = fromDateKey(key);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function greeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return "夜深了";
  if (hour < 11) return "早上好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  return "晚上好";
}
