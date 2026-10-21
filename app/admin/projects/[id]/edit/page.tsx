import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminProjectForm } from "@/components/AdminProjectForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProjectById } from "@/lib/admin-projects";

export const metadata: Metadata = {
  title: "编辑业绩",
  robots: { index: false, follow: false },
};

export default async function AdminEditProjectPage(
  props: PageProps<"/admin/projects/[id]/edit">,
) {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const { id } = await props.params;
  const project = await getAdminProjectById(id);
  if (!project) notFound();

  return (
    <section>
      <div className="mb-6">
        <Link
          href="/admin/projects"
          className="text-sm text-navy-800 hover:text-copper-600"
        >
          ← 返回业绩列表
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-navy-950">编辑工程业绩</h1>
      <p className="mt-2 text-sm text-slate-600">
        修改后保存即可更新内容库；未上传新封面时保留原图。
      </p>
      <div className="mt-8">
        <AdminProjectForm
          mode="edit"
          initial={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            category: project.category,
            year: project.year,
            location: project.location,
            client: project.client,
            summary: project.summary,
            body: project.body,
            featured: project.featured,
            published: project.published,
            coverUrl: project.coverUrl,
          }}
        />
      </div>
    </section>
  );
}
