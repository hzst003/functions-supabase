import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { WenwanGallery } from "@/components/WenwanGallery";
import { getWenwanCategories, getWenwanItems } from "@/lib/wenwan";

export const metadata: Metadata = {
  title: "文玩古物",
  description: "文玩古物图鉴与参考价",
};

export default function WenwanPage() {
  const items = getWenwanItems();
  const categories = getWenwanCategories(items);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader title="文玩古物" backHref="/" />
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-3">
        <WenwanGallery items={items} categories={categories} />
      </main>
    </div>
  );
}
