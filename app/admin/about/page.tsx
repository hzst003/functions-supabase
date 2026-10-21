import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminAboutForm } from "@/components/AdminAboutForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminSettings } from "@/lib/admin-settings";

export const metadata: Metadata = {
  title: "关于我们",
  robots: { index: false, follow: false },
};

export default async function AdminAboutPage() {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const settings = await getAdminSettings();

  return (
    <section>
      <h1 className="text-2xl font-bold text-navy-950">关于我们</h1>
      <p className="mt-2 text-sm text-slate-600">
        修改页头说明和公司简介。资质能力、发展历程在对应菜单里改。
      </p>
      <div className="mt-8">
        {settings ? (
          <AdminAboutForm
            id={settings.id}
            aboutSubtitle={settings.aboutSubtitle}
            about={settings.about}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
            公司简介暂时无法加载，请稍后刷新。
          </p>
        )}
      </div>
    </section>
  );
}
