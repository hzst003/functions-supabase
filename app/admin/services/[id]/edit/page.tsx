import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminServiceForm } from "@/components/AdminServiceForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminServiceById } from "@/lib/admin-services";

export const metadata: Metadata = {
  title: "编辑业务",
  robots: { index: false, follow: false },
};

export default async function AdminEditServicePage(
  props: PageProps<"/admin/services/[id]/edit">,
) {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const { id } = await props.params;
  const service = await getAdminServiceById(id);
  if (!service) notFound();

  return (
    <section>
      <div className="mb-6">
        <Link
          href="/admin/services"
          className="text-sm text-navy-800 hover:text-copper-600"
        >
          ← 返回业务列表
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-navy-950">编辑业务领域</h1>
      <p className="mt-2 text-sm text-slate-600">
        修改后保存即可更新内容库；未上传新封面时保留原图。
      </p>
      <div className="mt-8">
        <AdminServiceForm
          mode="edit"
          initial={{
            id: service.id,
            title: service.title,
            summary: service.summary,
            body: service.body,
            sort: service.sort,
            published: service.published,
            coverUrl: service.coverUrl,
          }}
        />
      </div>
    </section>
  );
}
