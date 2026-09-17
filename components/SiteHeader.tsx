import Link from "next/link";

type SiteHeaderProps = {
  title: string;
  backHref?: string;
  backLabel?: string;
};

export function SiteHeader({
  title,
  backHref = "/",
  backLabel = "返回",
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-2">
        <Link
          href={backHref}
          aria-label={backLabel}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg text-zinc-700 active:bg-zinc-100"
        >
          ←
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center text-[15px] font-semibold text-zinc-900">
          {title}
        </h1>
        <span className="w-11 shrink-0" aria-hidden />
      </div>
    </header>
  );
}
