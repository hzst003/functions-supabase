import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMilestones } from "@/lib/admin-milestones";

export const metadata: Metadata = {
  title: "发展历程",
  robots: { index: false, follow: false },
};

export default async function AdminMilestonesPage() {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const milestones = await getAdminMilestones();

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">发展历程</h1>
          <p className="mt-2 text-sm text-slate-600">
            共 {milestones.length} 条。可编辑已有节点，或新增一条。
          </p>
        </div>
        <Link
          href="/admin/milestones/new"
          className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
        >
          新增历程
        </Link>
      </div>

      {milestones.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
          暂无发展历程，先新增一条。
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {milestones.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-copper-600">{item.year}</span>
                  <h2 className="truncate font-semibold text-navy-950">
                    {item.title}
                  </h2>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
              <Link
                href={`/admin/milestones/${item.id}/edit`}
                className="rounded border border-slate-300 px-3 py-1.5 text-sm text-navy-900 hover:bg-slate-50"
              >
                编辑
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
