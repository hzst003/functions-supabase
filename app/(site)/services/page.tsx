import type { Metadata } from "next";
import Image from "next/image";
import { EmptyState } from "@/components/EmptyState";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { serviceAnchor } from "@/lib/format";
import { fileUrl, getServices } from "@/lib/pb";

export async function generateMetadata(): Promise<Metadata> {
  const services = await getServices();
  const names = services.items.map((item) => item.title).join("、");

  return {
    title: "业务领域",
    description: names
      ? `业务覆盖 ${names}。`
      : "覆盖无线、传输、室分与弱电智能化。",
    alternates: { canonical: "/services" },
  };
}

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        title="业务领域"
        subtitle={
          services.items.length
            ? services.items.map((item) => item.title).join("、")
            : "按网络场景组建专业团队。"
        }
      />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        {services.items.length ? (
          <div className="space-y-6">
            {services.items.map((service, index) => {
              const cover = fileUrl(
                service.collectionId,
                service.id,
                service.cover,
              );
              return (
                <article
                  key={service.id}
                  id={serviceAnchor(service.id)}
                  className="scroll-mt-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="grid md:grid-cols-[280px_1fr]">
                    <div className="relative h-48 bg-navy-100 md:h-auto md:min-h-48">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={service.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 280px"
                        />
                      ) : null}
                    </div>
                    <div className="p-6 md:p-8">
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-white">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h2 className="text-2xl font-bold text-navy-950">
                            {service.title}
                          </h2>
                          <p className="mt-2 text-sm text-slate-500">
                            {service.summary}
                          </p>
                          <RichText html={service.body} className="mt-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            message={
              services.ok
                ? "暂无业务信息。"
                : "业务信息暂时无法加载，请稍后刷新。"
            }
          />
        )}
      </section>
    </>
  );
}
