import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-4xl" aria-hidden="true">
        🧭
      </p>
      <h1 className="mt-4 text-[20px] font-bold tracking-tight">这里没有微任务</h1>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
        你要找的页面不存在。回到首页，随便抽一个 5 分钟能做完的小事吧。
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-brand px-6 text-[14px] font-semibold text-brand-ink"
      >
        回到 WeTask
      </Link>
    </main>
  );
}
