import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminFooterForm } from "@/components/AdminFooterForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminSettings } from "@/lib/admin-settings";

export const metadata: Metadata = {
  title: "页脚",
  robots: { index: false, follow: false },
};

export default async function AdminFooterPage() {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const settings = await getAdminSettings();

  return (
    <section>
      <h1 className="text-2xl font-bold text-navy-950">页脚</h1>
      <p className="mt-2 text-sm text-slate-600">
        修改页脚左侧的公司名称和标语。
      </p>
      <div className="mt-8">
        {settings ? (
          <AdminFooterForm
            id={settings.id}
            companyName={settings.companyName}
            tagline={settings.tagline}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
            页脚内容暂时无法加载，请稍后刷新。
          </p>
        )}
      </div>
    </section>
  );
}
