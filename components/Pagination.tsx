import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const linkClass =
    "rounded border border-slate-300 px-3 py-1.5 text-navy-900 hover:bg-slate-100";
  const disabledClass =
    "rounded border border-slate-200 px-3 py-1.5 text-slate-400";

  return (
    <nav aria-label="分页" className="mt-10 flex items-center justify-center gap-4 text-sm">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={linkClass}>
          上一页
        </Link>
      ) : (
        <span className={disabledClass}>上一页</span>
      )}
      <span className="text-slate-600">
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={linkClass}>
          下一页
        </Link>
      ) : (
        <span className={disabledClass}>下一页</span>
      )}
    </nav>
  );
}
