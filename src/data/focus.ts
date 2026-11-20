import type { TaskList } from "./types";

/** 专注与心态：让大脑从噪声里退出来一会儿。 */
export const focus: TaskList = {
  id: "focus",
  name: "专注",
  short: "静",
  icon: "🧘",
  color: "#8B5CF6",
  blurb: "焦虑、拖延、脑子很乱时，先做一件很小的事",
  tasks: [
    { id: "focus-01", title: "深呼吸 1 分钟", estMin: 3, hint: "吸气 4 秒，呼气 6 秒" },
    { id: "focus-02", title: "写下今天最想完成的一件事", estMin: 3 },
    { id: "focus-03", title: "冥想 5 分钟", estMin: 5 },
    { id: "focus-04", title: "关掉通知 10 分钟", estMin: 10 },
    { id: "focus-05", title: "记录此刻的 3 个感受", estMin: 5 },
    { id: "focus-06", title: "做一次 4-7-8 呼吸", estMin: 3 },
    { id: "focus-07", title: "写下 3 件值得感谢的小事", estMin: 6 },
    { id: "focus-08", title: "离开屏幕，看远处 5 分钟", estMin: 5 },
    { id: "focus-09", title: "清空大脑：把杂念写成清单", estMin: 10 },
    { id: "focus-10", title: "读一段让你平静的文字", estMin: 8 },
    { id: "focus-11", title: "只做一件事，专注 15 分钟", estMin: 15 },
  ],
};
