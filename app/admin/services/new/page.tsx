import type { Metadata } from "next";
import Link from "next/link";
import { AdminServiceForm } from "@/components/AdminServiceForm";

export const metadata: Metadata = {
  title: "新增业务",
  robots: { index: false, follow: false },
};

export default function AdminNewServicePage() {
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
      <h1 className="text-2xl font-bold text-navy-950">新增业务领域</h1>
      <p className="mt-2 text-sm text-slate-600">
        保存后写入内容库；勾选「立即发布」即可在前台展示。
      </p>
      <div className="mt-8">
        <AdminServiceForm mode="create" />
      </div>
    </section>
  );
}
