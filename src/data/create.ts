import type { TaskList } from "./types";

/** 项目与创作：推进一点点，也比停在原地好。 */
export const create: TaskList = {
  id: "create",
  name: "创作",
  short: "创",
  icon: "✍️",
  color: "#F43F5E",
  blurb: "给手上卡住的事，找一个 10 分钟就能推进的入口",
  tasks: [
    { id: "create-01", title: "提交一次代码 commit", estMin: 10 },
    { id: "create-02", title: "写 200 字想法", estMin: 12 },
    { id: "create-03", title: "修一个页面小问题", estMin: 20 },
    { id: "create-04", title: "给项目补一段 README 说明", estMin: 15 },
    { id: "create-05", title: "画一个草图 / 线框图", estMin: 15 },
    { id: "create-06", title: "记录一个今天冒出的点子", estMin: 5 },
    { id: "create-07", title: "整理一次项目待办", estMin: 10 },
    { id: "create-08", title: "拍 1 张可用的素材图", estMin: 8 },
    { id: "create-09", title: "给作品写 3 句介绍文案", estMin: 10 },
    { id: "create-10", title: "复盘一次昨天的工作", estMin: 15 },
  ],
};
