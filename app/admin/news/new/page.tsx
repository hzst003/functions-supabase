import type { Metadata } from "next";
import { AdminNewsForm } from "@/components/AdminNewsForm";

export const metadata: Metadata = {
  title: "新增新闻",
  robots: { index: false, follow: false },
};

export default function AdminNewNewsPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold text-navy-950">新增新闻动态</h1>
      <p className="mt-2 text-sm text-slate-600">
        保存后写入内容库；勾选「立即发布」即可在前台展示。
      </p>
      <div className="mt-8">
        <AdminNewsForm mode="create" />
      </div>
    </section>
  );
}
