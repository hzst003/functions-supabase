import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminNewsForm } from "@/components/AdminNewsForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminNewsById } from "@/lib/admin-news";

export const metadata: Metadata = {
  title: "编辑新闻",
  robots: { index: false, follow: false },
};

export default async function AdminEditNewsPage(
  props: PageProps<"/admin/news/[id]/edit">,
) {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const { id } = await props.params;
  const item = await getAdminNewsById(id);
  if (!item) notFound();

  return (
    <section>
      <div className="mb-6">
        <Link
          href="/admin/news"
          className="text-sm text-navy-800 hover:text-copper-600"
        >
          ← 返回新闻列表
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-navy-950">编辑新闻动态</h1>
      <p className="mt-2 text-sm text-slate-600">
        修改后保存即可更新内容库；未上传新封面时保留原图。
      </p>
      <div className="mt-8">
        <AdminNewsForm
          mode="edit"
          initial={{
            id: item.id,
            title: item.title,
            slug: item.slug,
            summary: item.summary,
            body: item.body,
            publishedAt: item.publishedAt,
            published: item.published,
            coverUrl: item.coverUrl,
          }}
        />
      </div>
    </section>
  );
}
