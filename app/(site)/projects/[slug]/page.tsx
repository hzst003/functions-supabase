import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { fileUrl, getProjectBySlug, getProjectSlugs } from "@/lib/pb";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "项目未找到" };
  const cover = fileUrl(project.collectionId, project.id, project.cover);
  const path = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      url: path,
      ...(cover ? { images: [{ url: cover, alt: project.title }] } : {}),
    },
    twitter: cover
      ? {
          card: "summary_large_image",
          title: project.title,
          description: project.summary,
          images: [cover],
        }
      : { card: "summary", title: project.title, description: project.summary },
  };
}

export default async function ProjectDetailPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const cover = fileUrl(project.collectionId, project.id, project.cover);

  return (
    <>
      <PageHero title={project.title} subtitle={project.summary} />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="relative mb-8 h-56 overflow-hidden rounded-xl bg-navy-100 md:h-72">
          {cover ? (
            <Image
              src={cover}
              alt={project.title}
              fill
              preload
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 72rem"
            />
          ) : null}
        </div>
        <dl className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 text-sm md:grid-cols-4">
          <div>
            <dt className="text-slate-500">类别</dt>
            <dd className="mt-1 font-medium text-navy-950">{project.category}</dd>
          </div>
          <div>
            <dt className="text-slate-500">年份</dt>
            <dd className="mt-1 font-medium text-navy-950">{project.year}</dd>
          </div>
          <div>
            <dt className="text-slate-500">地点</dt>
            <dd className="mt-1 font-medium text-navy-950">{project.location}</dd>
          </div>
          <div>
            <dt className="text-slate-500">业主</dt>
            <dd className="mt-1 font-medium text-navy-950">{project.client}</dd>
          </div>
        </dl>
        <RichText html={project.body} className="mt-8 max-w-3xl" />
        <Link
          href="/projects"
          className="mt-10 inline-block text-sm font-medium text-navy-800 hover:text-copper-600"
        >
          ← 返回业绩列表
        </Link>
      </section>
    </>
  );
}
