import { create } from "./create";
import { family } from "./family";
import { fitness } from "./fitness";
import { focus } from "./focus";
import { life } from "./life";
import { study } from "./study";
import type { MicroTask, TaskList } from "./types";

/**
 * 任务池汇总。新增一个领域只需要两步：
 * 1. 在 src/data/ 下新建一个清单文件；
 * 2. 在下面的数组里 import 并注册。
 */
export const taskLists: TaskList[] = [study, fitness, life, focus, create, family];

export const allTasks: (MicroTask & { listId: string; listName: string; color: string })[] =
  taskLists.flatMap((list) =>
    list.tasks.map((task) => ({
      ...task,
      listId: list.id,
      listName: list.name,
      color: list.color,
    })),
  );

export const taskIndex: Record<string, MicroTask & { listId: string; color: string }> =
  Object.fromEntries(allTasks.map((task) => [task.id, task]));

export const listIndex: Record<string, TaskList> = Object.fromEntries(
  taskLists.map((list) => [list.id, list]),
);

export const totalTaskCount = allTasks.length;

export type { MicroTask, TaskList };
