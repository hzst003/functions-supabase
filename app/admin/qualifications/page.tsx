import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminQualificationsForm } from "@/components/AdminQualificationsForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminSettings } from "@/lib/admin-settings";

export const metadata: Metadata = {
  title: "资质能力",
  robots: { index: false, follow: false },
};

export default async function AdminQualificationsPage() {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const settings = await getAdminSettings();

  return (
    <section>
      <h1 className="text-2xl font-bold text-navy-950">资质能力</h1>
      <p className="mt-2 text-sm text-slate-600">
        修改后显示在关于我们页面的「资质能力」一栏。
      </p>
      <div className="mt-8">
        {settings ? (
          <AdminQualificationsForm
            id={settings.id}
            initial={settings.qualifications}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
            资质能力暂时无法加载，请稍后刷新。
          </p>
        )}
      </div>
    </section>
  );
}
