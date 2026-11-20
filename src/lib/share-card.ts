import { formatDateLabel } from "./date";
import type { Stats } from "./progress";
import type { TaskList } from "@/data/types";

const W = 1080;
const H = 1440;
const PAD = 72;

const INK = "#1C1A16";
const INK_SOFT = "#6F685C";
const PAPER = "#FAF8F4";
const WHITE = "#FFFFFF";

const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif';

function font(ctx: CanvasRenderingContext2D, size: number, weight = 400) {
  ctx.font = `${weight} ${size}px ${FONT}`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function hexToRgba(hex: string, alpha: number) {
  const n = hex.replace("#", "");
  const full =
    n.length === 3
      ? n
          .split("")
          .map((c) => c + c)
          .join("")
      : n;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * 把成就数据画成一张 1080×1440 的分享图。
 * 纯 Canvas 绘制：无第三方依赖、无跨域资源、中文用系统字体。
 */
export async function renderShareCard(
  stats: Stats,
  lists: TaskList[],
  todayIso: string,
): Promise<string> {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* 字体加载失败也继续画，兜底用系统字体 */
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("浏览器不支持 Canvas");

  // 背景
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#FCFAF6");
  bg.addColorStop(0.55, PAPER);
  bg.addColorStop(1, "#F2EBDF");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 柔和光斑
  const glow1 = ctx.createRadialGradient(W - 80, 40, 0, W - 80, 40, 620);
  glow1.addColorStop(0, "rgba(226, 85, 43, 0.16)");
  glow1.addColorStop(1, "rgba(226, 85, 43, 0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, 900);

  const glow2 = ctx.createRadialGradient(0, H, 0, 0, H, 560);
  glow2.addColorStop(0, "rgba(139, 92, 246, 0.12)");
  glow2.addColorStop(1, "rgba(139, 92, 246, 0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, H - 800, W, 800);

  // 品牌区
  const tile = 88;
  const tileGradient = ctx.createLinearGradient(PAD, 72, PAD + tile, 72 + tile);
  tileGradient.addColorStop(0, "#FF8A5C");
  tileGradient.addColorStop(1, "#E2552B");
  ctx.fillStyle = tileGradient;
  roundRect(ctx, PAD, 72, tile, tile, 26);
  ctx.fill();

  // 勾
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(PAD + 24, 72 + 46);
  ctx.lineTo(PAD + 38, 72 + 60);
  ctx.lineTo(PAD + 64, 72 + 30);
  ctx.stroke();

  ctx.fillStyle = INK;
  font(ctx, 46, 700);
  ctx.textBaseline = "alphabetic";
  ctx.fillText("WeTask", PAD + 112, 132);

  ctx.fillStyle = INK_SOFT;
  font(ctx, 24, 500);
  ctx.textAlign = "right";
  ctx.fillText("wetask.cc", W - PAD, 126);
  ctx.textAlign = "left";

  // 标题
  ctx.fillStyle = INK;
  font(ctx, 62, 700);
  ctx.fillText("我的微任务打卡", PAD, 262);

  ctx.fillStyle = INK_SOFT;
  font(ctx, 27, 400);
  ctx.fillText(formatDateLabel(todayIso), PAD, 310);

  // 顶部统计卡
  const cards = [
    { label: "连续打卡", value: stats.currentStreak, unit: "天" },
    { label: "累计完成", value: stats.totalCheckins, unit: "项" },
    { label: "累计投入", value: stats.minutes, unit: "分钟" },
  ];
  const cardW = 300;
  const cardH = 196;
  const cardGap = 18;
  cards.forEach((card, index) => {
    const x = PAD + index * (cardW + cardGap);
    const y = 356;
    ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
    roundRect(ctx, x, y, cardW, cardH, 34);
    ctx.fill();
    ctx.strokeStyle = "rgba(28, 26, 22, 0.07)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = INK_SOFT;
    font(ctx, 24, 500);
    ctx.fillText(card.label, x + 32, y + 56);

    ctx.fillStyle = INK;
    font(ctx, 78, 700);
    ctx.fillText(String(card.value), x + 30, y + 146);
    const valueWidth = ctx.measureText(String(card.value)).width;
    ctx.fillStyle = INK_SOFT;
    font(ctx, 26, 500);
    ctx.fillText(card.unit, x + 34 + valueWidth, y + 146);
  });

  // 最近 7 天
  ctx.fillStyle = INK_SOFT;
  font(ctx, 26, 600);
  ctx.fillText("最近 7 天", PAD, 636);

  ctx.textAlign = "right";
  font(ctx, 24, 500);
  ctx.fillText(`本周完成 ${stats.weekCheckins} 项`, W - PAD, 636);
  ctx.textAlign = "left";

  const cell = 122;
  const gap = (W - PAD * 2 - cell * 7) / 6;
  const maxCount = Math.max(1, ...stats.last7.map((d) => d.count));

  stats.last7.forEach((day, index) => {
    const x = PAD + index * (cell + gap);
    const y = 668;

    if (day.isRest) {
      ctx.fillStyle = "rgba(28, 26, 22, 0.04)";
      roundRect(ctx, x, y, cell, cell, 26);
      ctx.fill();
      ctx.strokeStyle = "rgba(28, 26, 22, 0.18)";
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 7]);
      roundRect(ctx, x, y, cell, cell, 26);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = INK_SOFT;
      font(ctx, 20, 500);
      ctx.textAlign = "center";
      ctx.fillText(day.label, x + cell / 2, y + 32);
      ctx.fillStyle = "rgba(28, 26, 22, 0.35)";
      font(ctx, 34, 600);
      ctx.fillText("休", x + cell / 2, y + 88);
      ctx.textAlign = "left";
      return;
    }

    const intensity = day.count === 0 ? 0 : 0.18 + (day.count / maxCount) * 0.62;
    ctx.fillStyle = day.count === 0 ? "rgba(28, 26, 22, 0.04)" : hexToRgba("#E2552B", intensity);
    roundRect(ctx, x, y, cell, cell, 26);
    ctx.fill();

    if (day.isToday) {
      ctx.strokeStyle = "rgba(226, 85, 43, 0.65)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.fillStyle = day.count > 0 ? "rgba(255,255,255,0.86)" : INK_SOFT;
    font(ctx, 20, 500);
    ctx.textAlign = "center";
    ctx.fillText(day.label, x + cell / 2, y + 32);
    ctx.fillStyle = day.count > 0 ? WHITE : "rgba(28,26,22,0.25)";
    font(ctx, 46, 700);
    ctx.fillText(day.count > 0 ? String(day.count) : "·", x + cell / 2, y + 92);
    ctx.textAlign = "left";
  });

  // 领域分布
  ctx.fillStyle = INK_SOFT;
  font(ctx, 26, 600);
  ctx.fillText("各领域完成", PAD, 872);

  const maxList = Math.max(1, ...lists.map((list) => stats.byList[list.id] ?? 0));
  const rowY = 908;
  const rowH = 62;
  const barX = PAD + 168;
  const barW = W - PAD - 96 - barX;

  lists.forEach((list, index) => {
    const y = rowY + index * rowH;
    const count = stats.byList[list.id] ?? 0;

    ctx.fillStyle = list.color;
    ctx.beginPath();
    ctx.arc(PAD + 12, y + 4, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = INK;
    font(ctx, 26, 500);
    ctx.fillText(list.name, PAD + 36, y + 14);

    ctx.fillStyle = "rgba(28, 26, 22, 0.06)";
    roundRect(ctx, barX, y - 6, barW, 18, 9);
    ctx.fill();

    if (count > 0) {
      ctx.fillStyle = list.color;
      roundRect(ctx, barX, y - 6, Math.max(18, (count / maxList) * barW), 18, 9);
      ctx.fill();
    }

    ctx.fillStyle = count > 0 ? INK : INK_SOFT;
    font(ctx, 26, 600);
    ctx.textAlign = "right";
    ctx.fillText(`${count}`, W - PAD, y + 14);
    ctx.textAlign = "left";
  });

  // 小结
  const litDomains = lists.filter((list) => (stats.byList[list.id] ?? 0) > 0).length;
  ctx.fillStyle = INK_SOFT;
  font(ctx, 25, 500);
  ctx.fillText(
    `本周完成 ${stats.weekCheckins} 项 · 点亮 ${litDomains}/${lists.length} 个领域`,
    PAD,
    1300,
  );

  // 页脚
  ctx.strokeStyle = "rgba(28, 26, 22, 0.1)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(PAD, 1330);
  ctx.lineTo(W - PAD, 1330);
  ctx.stroke();

  ctx.fillStyle = INK;
  font(ctx, 30, 600);
  ctx.fillText("不知道做什么时，上 WeTask", PAD, 1382);

  ctx.fillStyle = INK_SOFT;
  font(ctx, 23, 400);
  ctx.textAlign = "right";
  ctx.fillText(`${pad2(new Date().getHours())}:${pad2(new Date().getMinutes())} 生成`, W - PAD, 1382);
  ctx.textAlign = "left";

  return canvas.toDataURL("image/png");
}

/** 生成分享文案。 */
export function buildShareText(stats: Stats): string {
  const parts: string[] = [];
  if (stats.currentStreak > 0) parts.push(`我在 WeTask 连续打卡 ${stats.currentStreak} 天`);
  else parts.push("我在 WeTask 用微任务打卡");
  if (stats.totalCheckins > 0) {
    parts.push(`累计完成 ${stats.totalCheckins} 个微任务`);
    if (stats.minutes > 0) parts.push(`投入约 ${stats.minutes} 分钟`);
  }
  const head = parts.join("，").replace(/，投入/, "、投入");
  return `${head}。今天已完成 ${stats.todayDone} 项。不知道做什么时，上 WeTask → wetask.cc`;
}
