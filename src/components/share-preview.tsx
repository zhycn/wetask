"use client";

import { useState } from "react";
import { Modal } from "./modal";
import { IconClose, IconCopy, IconDownload, IconShare } from "./icons";

type Props = {
  dataUrl: string | null;
  filename: string;
  onClose: () => void;
  onToast: (message: string) => void;
};

/** 生成后先预览，再决定保存或复制——比直接下载更符合「晒成就」的场景。 */
export function SharePreview({ dataUrl, filename, onClose, onToast }: Props) {
  const [busy, setBusy] = useState<"download" | "copy" | null>(null);

  const handleDownload = () => {
    if (!dataUrl) return;
    setBusy("download");
    try {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      link.click();
      onToast("图片已保存到下载文件夹");
    } finally {
      setBusy(null);
    }
  };

  const handleCopy = async () => {
    if (!dataUrl) return;
    setBusy("copy");
    try {
      const blob = await (await fetch(dataUrl)).blob();
      if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
        throw new Error("unsupported");
      }
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      onToast("图片已复制，可以直接粘贴发送");
    } catch {
      onToast("当前浏览器不支持复制图片，请用「保存图片」");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Modal open={Boolean(dataUrl)} onClose={onClose} labelledBy="share-title" className="sm:max-w-[400px]">
      <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h2 id="share-title" className="text-[15px] font-semibold tracking-tight">
            分享图已生成
          </h2>
          <p className="mt-0.5 text-[11.5px] text-ink-faint">1080 × 1440 · 适合发朋友圈和小红书</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭分享图"
          className="grid h-8 w-8 place-items-center rounded-full text-ink-faint transition hover:bg-sunken hover:text-ink"
        >
          <IconClose className="h-4 w-4" />
        </button>
      </header>

      <div className="px-5 py-4">
        {dataUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- 运行时生成的 data URL
          <img
            src={dataUrl}
            alt="我的 WeTask 微任务打卡成就图"
            className="w-full rounded-2xl border border-line shadow-soft"
          />
        )}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-ink-faint">
          <IconShare className="h-3.5 w-3.5" />
          图里只有统计数字，不包含任何个人信息
        </p>
      </div>

      <footer className="flex gap-2.5 border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy === "download"}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-[13px] font-semibold text-paper transition hover:opacity-85 disabled:opacity-60"
        >
          <IconDownload className="h-4 w-4" />
          {busy === "download" ? "保存中…" : "保存图片"}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={busy === "copy"}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-raised text-[13px] font-medium text-ink transition hover:border-line-strong disabled:opacity-60"
        >
          <IconCopy className="h-4 w-4" />
          {busy === "copy" ? "复制中…" : "复制图片"}
        </button>
      </footer>
    </Modal>
  );
}
