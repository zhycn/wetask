import type { TaskList } from "./types";

/** 运动：无需装备、随时能开始的短动作。 */
export const fitness: TaskList = {
  id: "fitness",
  name: "运动",
  short: "动",
  icon: "🏃",
  color: "#10B981",
  blurb: "疲惫的时候，先让身体动 5 分钟",
  tasks: [
    { id: "fit-01", title: "拉伸 5 分钟", estMin: 5, hint: "颈、肩、腰各 1 分钟" },
    { id: "fit-02", title: "做 20 个深蹲", estMin: 4 },
    { id: "fit-03", title: "原地开合跳 50 次", estMin: 3 },
    { id: "fit-04", title: "靠墙静蹲 1 分钟", estMin: 3 },
    { id: "fit-05", title: "快走或慢跑 15 分钟", estMin: 15 },
    { id: "fit-06", title: "跳绳 200 个", estMin: 8 },
    { id: "fit-07", title: "平板支撑 3 组", estMin: 6 },
    { id: "fit-08", title: "爬 10 层楼梯", estMin: 6 },
    { id: "fit-09", title: "做 10 个俯卧撑", estMin: 4 },
    { id: "fit-10", title: "颈部与肩部放松操", estMin: 5 },
    { id: "fit-11", title: "跟练一段 20 分钟瑜伽", estMin: 20 },
    { id: "fit-12", title: "睡前拉伸 8 分钟", estMin: 8 },
  ],
};
