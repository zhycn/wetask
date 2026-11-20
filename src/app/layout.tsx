import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wetask.cc"),
  title: {
    default: "WeTask · 不知道做什么时，上 WeTask",
    template: "%s · WeTask",
  },
  description:
    "WeTask 是一个开箱即用的微任务打卡站：67 个 5–25 分钟就能做完的小事，抽一个、做完、勾一下，记录连续打卡与成就面板。无需注册，数据只保存在你的浏览器。",
  keywords: ["微任务", "打卡", "习惯养成", "待办清单", "WeTask", "任务池"],
  authors: [{ name: "WeTask" }],
  creator: "WeTask",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://wetask.cc",
    siteName: "WeTask",
    title: "WeTask · 不知道做什么时，上 WeTask",
    description:
      "67 个 5–25 分钟就能做完的微任务，抽一个、做完、勾一下。开箱即用的打卡任务池，无需注册。",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeTask · 不知道做什么时，上 WeTask",
    description: "67 个 5–25 分钟就能做完的微任务，抽一个、做完、勾一下。",
  },
  robots: { index: true, follow: true },
  applicationName: "WeTask",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0d0b" },
  ],
};

/** 在首屏绘制前定好主题，避免深色模式闪一下白。 */
const THEME_SCRIPT = `(function(){try{var stored=localStorage.getItem("wetask.theme");var dark=stored?stored==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=dark?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full bg-paper text-ink">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
