import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminServices } from "@/lib/admin-services";

export const metadata: Metadata = {
  title: "业务列表",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const services = await getAdminServices();

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">业务领域</h1>
          <p className="mt-2 text-sm text-slate-600">
            共 {services.length} 条。可编辑或新增业务板块。
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
        >
          新增业务
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
          暂无业务，先新增一条。
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {services.map((service) => (
            <li
              key={service.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-semibold text-navy-950">
                    {service.title}
                  </h2>
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      service.published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {service.published ? "已发布" : "未发布"}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    排序 {service.sort}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                  {service.summary}
                </p>
              </div>
              <Link
                href={`/admin/services/${service.id}/edit`}
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
