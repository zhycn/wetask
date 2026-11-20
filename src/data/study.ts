import type { TaskList } from "./types";

/** 学习：适合课间、自习、通勤时抽一件。 */
export const study: TaskList = {
  id: "study",
  name: "学习",
  short: "学",
  icon: "📚",
  color: "#3B82F6",
  blurb: "把「学一会儿」变成一个能立刻做完的小动作",
  tasks: [
    { id: "study-01", title: "背 10 个英语单词", estMin: 8, hint: "先读三遍，再遮住中文自测" },
    { id: "study-02", title: "朗读并复述一段课文", estMin: 10 },
    { id: "study-03", title: "做 1 页口算练习", estMin: 10 },
    { id: "study-04", title: "整理一页课堂笔记", estMin: 10 },
    { id: "study-05", title: "复习 3 道错题", estMin: 12, hint: "只看错因，不看答案" },
    { id: "study-06", title: "读 5 页课外书", estMin: 15 },
    { id: "study-07", title: "抄写 5 个好句子", estMin: 8 },
    { id: "study-08", title: "听一段英语播客，记 3 个生词", estMin: 15 },
    { id: "study-09", title: "用 3 句话复述今天学到的一个概念", estMin: 6 },
    { id: "study-10", title: "把一节课的重点画成思维导图", estMin: 20 },
    { id: "study-11", title: "背一首短诗", estMin: 12 },
    { id: "study-12", title: "整理本周错题本", estMin: 20 },
  ],
};
