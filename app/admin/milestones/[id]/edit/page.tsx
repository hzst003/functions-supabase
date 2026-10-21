import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminMilestoneForm } from "@/components/AdminMilestoneForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminMilestoneById } from "@/lib/admin-milestones";

export const metadata: Metadata = {
  title: "编辑历程",
  robots: { index: false, follow: false },
};

export default async function AdminEditMilestonePage(
  props: PageProps<"/admin/milestones/[id]/edit">,
) {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const { id } = await props.params;
  const milestone = await getAdminMilestoneById(id);
  if (!milestone) notFound();

  return (
    <section>
      <div className="mb-6">
        <Link
          href="/admin/milestones"
          className="text-sm text-navy-800 hover:text-copper-600"
        >
          ← 返回发展历程
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-navy-950">编辑发展历程</h1>
      <p className="mt-2 text-sm text-slate-600">
        修改后保存即可更新关于我们页上的对应节点。
      </p>
      <div className="mt-8">
        <AdminMilestoneForm
          mode="edit"
          initial={{
            id: milestone.id,
            year: milestone.year,
            title: milestone.title,
            description: milestone.description,
          }}
        />
      </div>
    </section>
  );
}
