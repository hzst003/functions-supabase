import type { Metadata } from "next";
import Link from "next/link";
import { AdminMilestoneForm } from "@/components/AdminMilestoneForm";

export const metadata: Metadata = {
  title: "新增历程",
  robots: { index: false, follow: false },
};

export default function AdminNewMilestonePage() {
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
      <h1 className="text-2xl font-bold text-navy-950">新增发展历程</h1>
      <p className="mt-2 text-sm text-slate-600">
        保存后写入内容库，并显示在关于我们页的发展历程中。
      </p>
      <div className="mt-8">
        <AdminMilestoneForm mode="create" />
      </div>
    </section>
  );
}
