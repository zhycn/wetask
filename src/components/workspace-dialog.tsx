"use client";

import { useMemo, useState } from "react";
import { allTasks } from "@/data";
import type { MicroTask } from "@/data/types";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { computeStats, loadProgress } from "@/lib/progress";
import {
  MAX_WORKSPACES,
  WORKSPACE_EMOJIS,
  progressKeyFor,
  type Workspace,
} from "@/lib/workspaces";
import { cn } from "@/lib/utils";
import { Modal } from "./modal";
import { IconCheck, IconClose, IconPencil, IconPlus, IconTrash, IconUsers } from "./icons";

type Props = {
  open: boolean;
  onClose: () => void;
  today: string;
  onToast: (message: string) => void;
};

type Summary = { done: number; streak: number };

const TASK_META = allTasks as (MicroTask & { listId: string })[];

export function WorkspaceDialog({ open, onClose, today, onToast }: Props) {
  const spaces = useWorkspaces();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState(WORKSPACE_EMOJIS[1]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState(WORKSPACE_EMOJIS[0]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const summaries = useMemo(() => {
    if (!open || !today) return {} as Record<string, Summary>;
    const result: Record<string, Summary> = {};
    for (const workspace of spaces.list) {
      const stats = computeStats(loadProgress(progressKeyFor(workspace.id)), TASK_META, today);
      result[workspace.id] = { done: stats.todayDone, streak: stats.currentStreak };
    }
    return result;
  }, [open, spaces.list, today]);

  const resetForms = () => {
    setCreating(false);
    setNewName("");
    setEditingId(null);
    setConfirmDelete(false);
  };

  const startEdit = (workspace: Workspace) => {
    setEditingId(workspace.id);
    setEditName(workspace.name);
    setEditEmoji(workspace.emoji);
    setConfirmDelete(false);
    setCreating(false);
  };

  const handleSwitch = (workspace: Workspace) => {
    if (workspace.id === spaces.activeId) return;
    spaces.switchWorkspace(workspace.id);
    resetForms();
    onClose();
    onToast(`已切换到「${workspace.name}」的空间`);
  };

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const created = spaces.createWorkspace(name, newEmoji);
    if (!created) {
      onToast(`最多只能建 ${MAX_WORKSPACES} 个空间`);
      return;
    }
    resetForms();
    onClose();
    onToast(`已创建「${created.name}」的空间`);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;
    spaces.renameWorkspace(editingId, editName);
    spaces.setWorkspaceEmoji(editingId, editEmoji);
    resetForms();
    onToast("空间信息已更新");
  };

  const handleDelete = () => {
    if (!editingId) return;
    const target = spaces.list.find((item) => item.id === editingId);
    const ok = spaces.deleteWorkspace(editingId);
    resetForms();
    if (ok) onToast(`已删除「${target?.name ?? "空间"}」的打卡记录`);
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="ws-title" className="sm:max-w-[440px]">
      <header className="flex items-start justify-between gap-3 border-b border-line px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
        <div>
          <h2 id="ws-title" className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight">
            <IconUsers className="h-4 w-4 text-brand" />
            打卡空间
          </h2>
          <p className="mt-1 text-[11.5px] leading-relaxed text-ink-faint">
            同一台设备上，每个人的打卡记录彼此独立。切换空间不会互相影响。
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭空间管理"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-faint transition hover:bg-sunken hover:text-ink"
        >
          <IconClose className="h-4 w-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
        <ul className="space-y-2">
          {spaces.list.map((workspace) => {
            const isActive = workspace.id === spaces.activeId;
            const summary = summaries[workspace.id];

            if (editingId === workspace.id) {
              return (
                <li key={workspace.id} className="rounded-2xl border border-brand/25 bg-brand-soft/30 p-3">
                  <p className="text-[12px] font-semibold">编辑「{workspace.name}」</p>
                  <EmojiPicker value={editEmoji} onChange={setEditEmoji} />
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleSaveEdit();
                      if (event.key === "Escape") resetForms();
                    }}
                    maxLength={12}
                    aria-label="空间名字"
                    className="mt-2 h-9 w-full rounded-xl border border-line bg-raised px-3 text-[13px] text-ink focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/15"
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={!editName.trim()}
                      className="h-8 rounded-full bg-ink px-3.5 text-[12px] font-semibold text-paper disabled:opacity-50"
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={resetForms}
                      className="h-8 rounded-full px-3 text-[12px] text-ink-soft hover:bg-sunken"
                    >
                      取消
                    </button>
                    {spaces.list.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="ml-auto inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[12px] text-ink-faint transition hover:text-red-500"
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                        删除
                      </button>
                    )}
                  </div>
                  {confirmDelete && (
                    <div className="mt-2 rounded-xl border border-red-500/25 bg-red-500/5 p-2.5">
                      <p className="text-[11.5px] leading-snug text-ink-soft">
                        删除后，这个空间的所有打卡记录都无法恢复。
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={handleDelete}
                          className="h-8 rounded-full bg-red-500 px-3 text-[11.5px] font-semibold text-white"
                        >
                          确认删除
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(false)}
                          className="h-8 rounded-full px-3 text-[11.5px] text-ink-soft hover:bg-sunken"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={workspace.id}>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-2xl border p-1.5 pr-1 transition",
                    isActive
                      ? "border-brand/25 bg-brand-soft/40"
                      : "border-line bg-raised hover:border-line-strong",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleSwitch(workspace)}
                    aria-current={isActive ? "true" : undefined}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1.5 py-1.5 text-left"
                  >
                    <span
                      aria-hidden="true"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sunken text-[16px]"
                    >
                      {workspace.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[13px] font-semibold">{workspace.name}</span>
                        {isActive && (
                          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-brand px-1.5 py-0.5 text-[9.5px] font-medium text-brand-ink">
                            <IconCheck className="h-2.5 w-2.5" />
                            当前
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-faint">
                        今日 {summary?.done ?? 0} 项 · 连续 {summary?.streak ?? 0} 天
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(workspace)}
                    aria-label={`编辑${workspace.name}`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-faint transition hover:bg-sunken hover:text-ink"
                  >
                    <IconPencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {creating ? (
          <div className="mt-3 rounded-2xl border border-line bg-sunken/40 p-3">
            <p className="text-[12px] font-semibold">新建空间</p>
            <EmojiPicker value={newEmoji} onChange={setNewEmoji} />
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleCreate();
                if (event.key === "Escape") setCreating(false);
              }}
              maxLength={12}
              placeholder="给这个空间起个名字，比如「小明」"
              aria-label="新空间名字"
              className="mt-2 h-9 w-full rounded-xl border border-line bg-raised px-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/15"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="h-8 rounded-full bg-brand px-3.5 text-[12px] font-semibold text-brand-ink disabled:opacity-50"
              >
                创建并切换
              </button>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="h-8 rounded-full px-3 text-[12px] text-ink-soft hover:bg-sunken"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setCreating(true);
            }}
            disabled={spaces.list.length >= MAX_WORKSPACES}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line-strong py-3 text-[12.5px] font-medium text-ink-soft transition hover:border-brand/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconPlus className="h-4 w-4" />
            {spaces.list.length >= MAX_WORKSPACES ? `最多 ${MAX_WORKSPACES} 个空间` : "新建空间"}
          </button>
        )}

        <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-faint">
          数据只保存在这台设备的浏览器里，可以用来区分家里的每个人。
        </p>
      </div>

      <footer className="border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onClose}
          className="h-10 w-full rounded-full border border-line bg-raised text-[13px] font-medium text-ink transition hover:border-line-strong"
        >
          完成
        </button>
      </footer>
    </Modal>
  );
}

function EmojiPicker({ value, onChange }: { value: string; onChange: (emoji: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {WORKSPACE_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          aria-label={`使用 ${emoji} 作为头像`}
          aria-pressed={value === emoji}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-full text-[15px] transition",
            value === emoji ? "bg-raised ring-1 ring-brand/40" : "hover:bg-raised/70",
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
