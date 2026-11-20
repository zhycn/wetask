import { cn } from "@/lib/utils";

/** 品牌标识：圆角胶囊底 + 一个勾。 */
export function BrandMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid shrink-0 place-items-center rounded-[30%] text-white shadow-[0_4px_12px_-4px_rgba(226,85,43,0.6)]",
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundImage: "linear-gradient(145deg, #ff8a5c 0%, #e2552b 55%, #c7431d 100%)",
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" width={size * 0.58} height={size * 0.58}>
        <path
          d="M5 12.5l4.6 4.6L19 6.8"
          stroke="currentColor"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
