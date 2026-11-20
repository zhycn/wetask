/** 一个微任务：具体、可一次完成、预计 3–25 分钟。 */
export type MicroTask = {
  /** 全局唯一，打卡记录以此关联 */
  id: string;
  /** 一句具体的行动，动词开头 */
  title: string;
  /** 预计耗时（分钟） */
  estMin: number;
  /** 可选的一句提示，帮助用户立刻开始 */
  hint?: string;
};

/** 一个领域清单。一个清单 = 项目里的一个数据文件。 */
export type TaskList = {
  id: string;
  name: string;
  /** 首字缩写，用于紧凑展示 */
  short: string;
  icon: string;
  /** 主题色，卡片与进度条使用 */
  color: string;
  /** 一句话说明这个清单适合什么时候用 */
  blurb: string;
  tasks: MicroTask[];
};
