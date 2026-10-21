import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { mailHref, phoneHref } from "@/lib/format";
import { getSettings } from "@/lib/pb";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "联系我们",
    description: `电话 ${settings.phone}，邮箱 ${settings.email}。欢迎咨询通信工程合作。`,
    alternates: { canonical: "/contact" },
  };
}

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        title="联系我们"
        subtitle="欢迎垂询通信工程合作、投标协作与技术交流。"
      />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-6">
        <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-navy-950">联系方式</h2>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
            <li>
              <span className="block text-slate-500">电话</span>
              <a href={phoneHref(settings.phone)} className="text-navy-900 hover:text-copper-600">
                {settings.phone}
              </a>
            </li>
            <li>
              <span className="block text-slate-500">邮箱</span>
              <a href={mailHref(settings.email)} className="text-navy-900 hover:text-copper-600">
                {settings.email}
              </a>
            </li>
            <li>
              <span className="block text-slate-500">地址</span>
              {settings.address}
            </li>
          </ul>
          <p className="mt-6 text-xs leading-6 text-slate-500">
            工作日 9:00–18:00 受理咨询。
          </p>
        </aside>
        <div>
          <h2 className="mb-4 text-xl font-semibold text-navy-950">在线留言</h2>
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
