import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLogoForm } from "@/components/AdminLogoForm";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminSettings } from "@/lib/admin-settings";
import { assetUrl } from "@/lib/pb";

export const metadata: Metadata = {
  title: "标志",
  robots: { index: false, follow: false },
};

export default async function AdminLogoPage() {
  const pb = await requireAdmin();
  if (!pb) redirect("/admin/login");

  const settings = await getAdminSettings();

  return (
    <section>
      <h1 className="text-2xl font-bold text-navy-950">标志</h1>
      <p className="mt-2 text-sm text-slate-600">
        修改标志右侧的文字，也可更换左侧图片。未上传图片时，显示名称的第一个字。
      </p>
      <div className="mt-8">
        {settings ? (
          <AdminLogoForm
            id={settings.id}
            companyName={settings.companyName}
            logoUrl={assetUrl(
              settings.collectionId,
              settings.id,
              settings.logo,
            )}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
            标志暂时无法加载，请稍后刷新。
          </p>
        )}
      </div>
    </section>
  );
}
