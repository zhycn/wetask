import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WeTask · 微任务打卡",
    short_name: "WeTask",
    description: "67 个 5–25 分钟就能做完的微任务，抽一个、做完、勾一下。",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#e2552b",
    lang: "zh-CN",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
