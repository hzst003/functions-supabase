import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { NewsCard } from "@/components/NewsCard";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { serviceAnchor } from "@/lib/format";
import {
  getFeaturedProjects,
  getLatestNews,
  fileUrl,
  getServices,
  getSettings,
} from "@/lib/pb";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default async function HomePage() {
  const [settings, services, projects, news] = await Promise.all([
    getSettings(),
    getServices(),
    getFeaturedProjects(),
    getLatestNews(3),
  ]);
  const domainValue =
    services.ok && services.items.length > 0
      ? `${services.items.length} 大领域`
      : "—";
  const coverage =
    services.items.length > 0
      ? services.items.map((item) => item.title).join("、")
      : "5G 基站、光纤传输、室分覆盖与弱电智能化";

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-navy-50 text-navy-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(30,79,140,0.14),transparent_42%),radial-gradient(circle_at_92%_0%,rgba(18,50,92,0.08),transparent_36%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 md:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-navy-700">
              Telecom · Network · Delivery
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {settings.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              {settings.companyName}专注于 {coverage}，以标准化作业与持证团队，为运营商与政企客户交付可信赖的通信网络。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/projects"
                className="rounded-lg bg-navy-900 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-navy-800"
              >
                查看业绩
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-navy-800 px-5 py-2.5 text-center text-sm font-semibold text-navy-900 hover:bg-white"
              >
                立即咨询
              </Link>
              <Link
                href="/admin/login"
                className="rounded-lg border border-navy-800 px-5 py-2.5 text-center text-sm font-semibold text-navy-900 hover:bg-white"
              >
                后台登录
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 self-end">
            {[
              { label: "深耕行业", value: `${settings.years}+ 年` },
              { label: "交付项目", value: `${settings.projectsCount}+` },
              { label: "服务客户", value: `${settings.clientsCount}+` },
              { label: "业务板块", value: domainValue },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="text-2xl font-bold text-navy-800">
                  {item.value}
                </div>
                <div className="mt-1 text-sm text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading
          eyebrow="Services"
          title={
            services.ok && services.items.length > 0
              ? `${services.items.length} 大业务领域`
              : "业务领域"
          }
          description="按网络场景组建专业团队。"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.items.length ? (
            services.items.map((service) => {
              const cover = fileUrl(
                service.collectionId,
                service.id,
                service.cover,
              );
              return (
                <Link
                  key={service.id}
                  href={`/services#${serviceAnchor(service.id)}`}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-copper-300 hover:shadow-md"
                >
                  <div className="relative h-36 bg-navy-100">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-navy-950">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {service.summary}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="md:col-span-2 lg:col-span-4">
              <EmptyState
                message={
                  services.ok
                    ? "暂无业务信息。"
                    : "业务信息暂时无法加载，请稍后刷新。"
                }
              />
            </div>
          )}
        </div>
        <div className="mt-6">
          <Link
            href="/services"
            className="text-sm font-medium text-navy-800 hover:text-copper-600"
          >
            了解全部业务 →
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <SectionHeading
            eyebrow="Projects"
            title="精选工程业绩"
            description="代表性项目覆盖 5G 宏站、骨干光缆、枢纽室分与园区弱电。"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.items.length ? (
              projects.items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="md:col-span-2 lg:col-span-3">
                <EmptyState
                  message={
                    projects.ok
                      ? "暂无精选业绩，请稍后查看。"
                      : "工程业绩暂时无法加载，请稍后刷新。"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionHeading eyebrow="News" title="最新动态" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {news.items.length ? (
            news.items.map((item) => <NewsCard key={item.id} item={item} />)
          ) : (
            <div className="md:col-span-3">
              <EmptyState
                message={
                  news.ok ? "暂无新闻动态。" : "新闻动态暂时无法加载，请稍后刷新。"
                }
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
