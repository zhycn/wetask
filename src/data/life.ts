import type { TaskList } from "./types";

/** 生活效率：顺手就能收拾好的小事，做完空间会变清爽。 */
export const life: TaskList = {
  id: "life",
  name: "生活",
  short: "生",
  icon: "🧺",
  color: "#F59E0B",
  blurb: "把生活环境恢复一点点秩序，心情会跟着好",
  tasks: [
    { id: "life-01", title: "整理桌面 5 分钟", estMin: 5 },
    { id: "life-02", title: "起身喝水并走两圈", estMin: 3 },
    { id: "life-03", title: "收拾书包 / 背包", estMin: 6 },
    { id: "life-04", title: "洗掉积攒的杯子碗筷", estMin: 8 },
    { id: "life-05", title: "清理手机相册 20 张", estMin: 10 },
    { id: "life-06", title: "给房间通一次风", estMin: 3 },
    { id: "life-07", title: "整理一处抽屉", estMin: 15 },
    { id: "life-08", title: "列一份本周采购清单", estMin: 8 },
    { id: "life-09", title: "丢掉 3 件不需要的东西", estMin: 10 },
    { id: "life-10", title: "把桌面文件归档到文件夹", estMin: 12 },
    { id: "life-11", title: "给植物浇水", estMin: 3 },
    { id: "life-12", title: "提前准备好明天的衣服", estMin: 5 },
  ],
};
