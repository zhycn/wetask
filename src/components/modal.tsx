"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  side?: "center" | "right";
  labelledBy?: string;
  /** 打开时优先聚焦的选择器，默认第一个可聚焦元素 */
  initialFocus?: string;
};

/** 弹层栈：Esc / Tab 只作用于最上层，避免嵌套弹层一起关闭。 */
const modalStack: symbol[] = [];

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** 可访问的弹层：Esc 关闭、焦点陷阱、滚动锁定、关闭后恢复焦点。 */
export function Modal({
  open,
  onClose,
  children,
  className,
  side = "center",
  labelledBy,
  initialFocus,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const token = Symbol("modal");
    modalStack.push(token);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const finePointer = window.matchMedia?.("(pointer: fine)").matches ?? true;
      const target =
        initialFocus && finePointer
          ? panelRef.current?.querySelector<HTMLElement>(initialFocus)
          : panelRef.current;
      target?.focus();
    }, 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (modalStack[modalStack.length - 1] !== token) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      const index = modalStack.indexOf(token);
      if (index >= 0) modalStack.splice(index, 1);
      previouslyFocused?.focus?.();
    };
  }, [open, initialFocus]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex",
        side === "center"
          ? "items-end justify-center sm:items-center sm:p-6"
          : "items-stretch justify-end p-0 sm:p-4",
      )}
    >
      <button
        type="button"
        aria-label="关闭"
        tabIndex={-1}
        onClick={onClose}
        className="animate-fade absolute inset-0 cursor-default bg-[#141210]/50 backdrop-blur-[3px]"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          "animate-sheet relative flex w-full flex-col overflow-hidden bg-raised shadow-[0_30px_80px_-20px_rgba(20,18,16,0.45)] outline-none",
          side === "center"
            ? "rounded-t-[28px] sm:max-w-[420px] sm:rounded-[28px]"
            : "h-dvh rounded-t-[28px] sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-[440px] sm:rounded-[28px]",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
