import type { Metadata } from "next";
import { AdminProjectForm } from "@/components/AdminProjectForm";

export const metadata: Metadata = {
  title: "新增业绩",
  robots: { index: false, follow: false },
};

export default function AdminNewProjectPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold text-navy-950">新增工程业绩</h1>
      <p className="mt-2 text-sm text-slate-600">
        保存后写入内容库；勾选「立即发布」即可在前台展示。
      </p>
      <div className="mt-8">
        <AdminProjectForm mode="create" />
      </div>
    </section>
  );
}
