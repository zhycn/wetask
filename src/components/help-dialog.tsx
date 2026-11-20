"use client";

import { useInstall } from "@/hooks/use-install";
import { Modal } from "./modal";
import { IconArrowRight, IconClose, IconDice } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  onStart: () => void;
};

const STEPS = [
  {
    icon: "🎲",
    title: "抽一个",
    body: "点「随机来一个」，从 6 个领域的任务池里抽一条，不用自己想做什么。",
  },
  {
    icon: "⏳",
    title: "做掉它",
    body: "每条都标了预计耗时，5–25 分钟。抽到不想做的就换一条，不扣分。",
  },
  {
    icon: "✅",
    title: "勾一下",
    body: "做完点一下就算打卡，再点一次可以撤销。每天零点重新开始，成就永久累计；每周还可以休息 1 天，连续不会中断。",
  },
];

const SHORTCUTS = [
  { key: "R", label: "随机抽一个微任务" },
  { key: "/", label: "搜索微任务" },
  { key: "Esc", label: "关闭弹层" },
  { key: "Enter", label: "在抽任务弹层里直接打卡" },
];

export function HelpDialog({ open, onClose, onStart }: Props) {
  const { canInstall, install } = useInstall();
  return (
    <Modal open={open} onClose={onClose} labelledBy="help-title" className="sm:max-w-[440px]">
      <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 id="help-title" className="text-[15px] font-semibold tracking-tight">
            怎么用 WeTask
          </h2>
          <p className="mt-0.5 text-[11.5px] text-ink-faint">三步就够，不需要先做计划</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭说明"
          className="grid h-8 w-8 place-items-center rounded-full text-ink-faint transition hover:bg-sunken hover:text-ink"
        >
          <IconClose className="h-4 w-4" />
        </button>
      </header>

      <div className="px-5 py-4">
        <ol className="space-y-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3 rounded-2xl border border-line bg-sunken/30 p-3">
              <span
                aria-hidden="true"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-raised text-[17px] shadow-soft"
              >
                {step.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold">
                  <span className="num mr-1 text-ink-faint">{index + 1}.</span>
                  {step.title}
                </p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 rounded-2xl border border-line p-3">
          <p className="text-[12px] font-semibold">键盘快捷键</p>
          <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {SHORTCUTS.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <kbd className="min-w-[26px] rounded-md border border-line bg-raised px-1.5 py-0.5 text-center font-sans text-[10px] font-medium text-ink-soft">
                  {item.key}
                </kbd>
                <dd className="truncate text-[11.5px] text-ink-soft">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {canInstall && (
          <button
            type="button"
            onClick={async () => {
              const accepted = await install();
              if (accepted) onClose();
            }}
            className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-raised px-3.5 py-3 text-left transition hover:border-line-strong"
          >
            <span>
              <span className="block text-[12.5px] font-semibold">安装到桌面</span>
              <span className="mt-0.5 block text-[11px] text-ink-faint">
                像 App 一样打开，离线也能打卡
              </span>
            </span>
            <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-ink px-3 text-[11.5px] font-medium text-paper">
              安装
            </span>
          </button>
        )}

        <p className="mt-4 text-[11.5px] leading-relaxed text-ink-faint">
          无需注册。打卡记录只保存在这台设备的浏览器里，不上传、不外发；可以在「我的成就 → 数据备份」里导出成文件。
        </p>
      </div>

      <footer className="flex gap-2.5 border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-line bg-raised text-[13px] font-medium text-ink transition hover:border-line-strong"
        >
          知道了
        </button>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex h-11 flex-[1.3] items-center justify-center gap-2 rounded-full bg-brand text-[13px] font-semibold text-brand-ink transition hover:brightness-105"
        >
          <IconDice className="h-4 w-4" />
          随机来一个
          <IconArrowRight className="h-3.5 w-3.5 opacity-70" />
        </button>
      </footer>
    </Modal>
  );
}
