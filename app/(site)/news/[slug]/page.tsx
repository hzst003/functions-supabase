import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import { formatDate } from "@/lib/format";
import { fileUrl, getNewsBySlug, getNewsSlugs } from "@/lib/pb";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/news/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "新闻未找到" };
  const cover = fileUrl(item.collectionId, item.id, item.cover);
  const path = `/news/${item.slug}`;
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: path },
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      url: path,
      ...(cover ? { images: [{ url: cover, alt: item.title }] } : {}),
    },
    twitter: cover
      ? {
          card: "summary_large_image",
          title: item.title,
          description: item.summary,
          images: [cover],
        }
      : { card: "summary", title: item.title, description: item.summary },
  };
}

export default async function NewsDetailPage(
  props: PageProps<"/news/[slug]">,
) {
  const { slug } = await props.params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const cover = fileUrl(item.collectionId, item.id, item.cover);

  return (
    <>
      <PageHero title={item.title} subtitle={item.summary} />
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        {cover ? (
          <div className="relative mb-8 h-56 overflow-hidden rounded-xl bg-navy-100 md:h-72">
            <Image
              src={cover}
              alt={item.title}
              fill
              preload
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 48rem"
            />
          </div>
        ) : null}
        <time className="text-sm text-slate-500">
          {formatDate(item.publishedAt)}
        </time>
        <RichText html={item.body} className="mt-6" />
        <Link
          href="/news"
          className="mt-10 inline-block text-sm font-medium text-navy-800 hover:text-copper-600"
        >
          ← 返回新闻列表
        </Link>
      </section>
    </>
  );
}
