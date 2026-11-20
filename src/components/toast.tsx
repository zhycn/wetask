"use client";

import { IconCheck, IconClose } from "./icons";

export type ToastPayload = {
  message: string;
  actionLabel?: string;
  action?: () => void;
};

type Props = {
  toast: (ToastPayload & { id: number }) | null;
  onClose: () => void;
};

export function Toaster({ toast, onClose }: Props) {
  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-8">
      <div
        role="status"
        aria-live="polite"
        className="animate-fade-up pointer-events-auto flex max-w-[92vw] items-center gap-2.5 rounded-full bg-ink py-2 pr-2 pl-3 text-[12.5px] font-medium text-paper shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)]"
      >
        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
          <IconCheck className="h-2.5 w-2.5" />
        </span>
        <span className="truncate">{toast.message}</span>
        {toast.actionLabel && toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.();
              onClose();
            }}
            className="ml-1 shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-medium transition hover:bg-white/25"
          >
            {toast.actionLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭提示"
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-paper/50 transition hover:bg-white/10 hover:text-paper"
        >
          <IconClose className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
