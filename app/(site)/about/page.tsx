import type { Metadata } from "next";
import { EmptyState } from "@/components/EmptyState";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { SectionHeading } from "@/components/SectionHeading";
import { getMilestones, getSettings } from "@/lib/pb";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "关于我们",
    description: `${settings.companyName}的公司简介、资质能力与发展历程。`,
    alternates: { canonical: "/about" },
  };
}

export const revalidate = 60;

export default async function AboutPage() {
  const [settings, milestones] = await Promise.all([
    getSettings(),
    getMilestones(),
  ]);

  return (
    <>
      <PageHero
        title="关于我们"
        subtitle={
          settings.aboutSubtitle ||
          "以专业通信工程能力，服务运营商网络与政企数字化。"
        }
      />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <SectionHeading title="公司简介" />
        <RichText html={settings.about} className="mt-6 max-w-3xl" />
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-navy-950">资质能力</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
            {settings.qualifications}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <SectionHeading title="发展历程" />
          <div className="mt-8 space-y-4">
            {milestones.items.length ? (
              milestones.items.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-[100px_1fr]"
                >
                  <div className="text-xl font-bold text-copper-600">
                    {item.year}
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-950">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState
                message={
                  milestones.ok
                    ? "暂无发展历程。"
                    : "发展历程暂时无法加载，请稍后刷新。"
                }
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
