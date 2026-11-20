import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconDice(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconTrophy(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H5.5A1.5 1.5 0 0 0 4 7.5C4 10 5.8 11.5 8 11.7" />
      <path d="M16 6h2.5A1.5 1.5 0 0 1 20 7.5c0 2.5-1.8 4-4 4.2" />
      <path d="M12 13v4" />
      <path d="M8.5 20h7" />
      <path d="M10 17h4l.6 3H9.4l.6-3Z" />
    </Base>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Base strokeWidth={2.4} {...props}>
      <path d="m4.5 12.5 5 5L19.5 6.5" />
    </Base>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Base strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Base>
  );
}

export function IconFlame(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3s5 4.2 5 9a5 5 0 0 1-10 0c0-2 1-3.6 1-3.6S8.6 10 10 11c0-3 2-8 2-8Z" />
    </Base>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Base>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="5" width="17" height="16" rx="4" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </Base>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Base>
  );
}

export function IconSun(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </Base>
  );
}

export function IconMoon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </Base>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M10 4h4M6.5 7l.8 12a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9L17.5 7" />
      <path d="M10.5 11v5.5M13.5 11v5.5" />
    </Base>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.5v11" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4.5 17v2.5h15V17" />
    </Base>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 20.5v-11" />
      <path d="m7.5 13.5 4.5-4.5 4.5 4.5" />
      <path d="M4.5 7V4.5h15V7" />
    </Base>
  );
}

export function IconCopy(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="9" y="9" width="11.5" height="11.5" rx="3" />
      <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-6A3.5 3.5 0 0 0 3 6.5v6A2.5 2.5 0 0 0 5.5 15" />
    </Base>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </Base>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18.2l-1.8-5.6L4.7 10.8 10.2 9 12 3.5Z" />
      <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </Base>
  );
}

export function IconUndo(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 9h9.5a5.5 5.5 0 1 1 0 11H8" />
      <path d="M7.5 5 3.5 9l4 4" />
    </Base>
  );
}

export function IconTarget(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconShare(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 15V3.5M8 7l4-3.5L16 7" />
      <path d="M5 13v5.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V13" />
    </Base>
  );
}

export function IconEyeOff(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A9.7 9.7 0 0 1 12 6c5 0 8.5 4.2 9.4 6-.3.6-1 1.8-2.2 3" />
      <path d="M6.3 7.9C4.4 9.2 3.1 11 2.6 12c.9 1.8 4.4 6 9.4 6 1.5 0 2.8-.4 4-1" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </Base>
  );
}

export function IconHelp(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.3a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2.9-1.2 1.8" />
      <circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 6.5h16M7 12h10M10.5 17.5h3" />
    </Base>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2.2" />
    </Base>
  );
}
