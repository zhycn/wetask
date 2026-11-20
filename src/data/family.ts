import type { TaskList } from "./types";

/** 家庭陪伴：把注意力交给身边的人，10 分钟也算数。 */
export const family: TaskList = {
  id: "family",
  name: "陪伴",
  short: "伴",
  icon: "🫶",
  color: "#14B8A6",
  blurb: "关系不靠大场面，靠这些很小但真的在场",
  tasks: [
    { id: "family-01", title: "陪孩子读 10 分钟书", estMin: 10 },
    { id: "family-02", title: "整理一处公共区域", estMin: 10 },
    { id: "family-03", title: "给家人倒杯水", estMin: 3 },
    { id: "family-04", title: "给爸妈发一条问候", estMin: 5 },
    { id: "family-05", title: "陪家人聊 10 分钟", estMin: 10 },
    { id: "family-06", title: "一起做一顿简单的饭", estMin: 25 },
    { id: "family-07", title: "帮家人做一件小事", estMin: 8 },
    { id: "family-08", title: "拍一张合照", estMin: 5 },
    { id: "family-09", title: "问家人今天过得怎么样", estMin: 5 },
    { id: "family-10", title: "和家人一起散步", estMin: 20 },
  ],
};
