import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminContactForm } from "@/components/AdminContactForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminSettings } from "@/lib/admin-settings";

export const metadata: Metadata = {
  title: "联系方式",
  robots: { index: false, follow: false },
};

export default async function AdminContactPage() {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const settings = await getAdminSettings();

  return (
    <section>
      <h1 className="text-2xl font-bold text-navy-950">联系方式</h1>
      <p className="mt-2 text-sm text-slate-600">
        修改电话、邮箱和地址。保存后显示在页脚和「联系我们」页面。
      </p>
      <div className="mt-8">
        {settings ? (
          <AdminContactForm
            id={settings.id}
            phone={settings.phone}
            email={settings.email}
            address={settings.address}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
            联系方式暂时无法加载，请稍后刷新。
          </p>
        )}
      </div>
    </section>
  );
}
