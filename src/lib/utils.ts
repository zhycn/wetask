export type ClassValue = string | number | null | undefined | false | ClassValue[];

/** 极简 class 合并，避免额外依赖。 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  const walk = (value: ClassValue) => {
    if (!value && value !== 0) return;
    if (Array.isArray(value)) value.forEach(walk);
    else out.push(String(value));
  };
  values.forEach(walk);
  return out.join(" ");
}

/** #RRGGBB -> rgba(r,g,b,alpha) */
export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 把分钟数说成人话 */
export function formatMinutes(min: number): string {
  if (min < 60) return `${min} 分钟`;
  const hours = Math.floor(min / 60);
  const rest = min % 60;
  if (rest === 0) return `${hours} 小时`;
  return `${hours} 小时 ${rest} 分钟`;
}
