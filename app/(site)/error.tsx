"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-navy-950">页面暂时无法打开</h1>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        内容加载失败。请重试，或稍后再访问。
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-400 focus-visible:ring-offset-2"
      >
        重试
      </button>
    </section>
  );
}
