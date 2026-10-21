import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { NewsCard } from "@/components/NewsCard";
import { PageHero } from "@/components/PageHero";
import { Pagination } from "@/components/Pagination";
import { pageHref, readPage } from "@/lib/format";
import { getNewsPage } from "@/lib/pb";

export async function generateMetadata(
  props: PageProps<"/news">,
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const page = readPage(searchParams.page);
  return {
    title: "新闻动态",
    description: "公司最新进展、项目交付与行业荣誉。",
    alternates: { canonical: pageHref("/news", page) },
  };
}

export const revalidate = 60;

export default async function NewsPage(props: PageProps<"/news">) {
  const searchParams = await props.searchParams;
  const page = readPage(searchParams.page);
  const news = await getNewsPage(page);

  if (news.ok && news.totalPages > 0 && page > news.totalPages) {
    redirect(pageHref("/news", news.totalPages));
  }

  return (
    <>
      <PageHero title="新闻动态" subtitle="了解公司最新进展与荣誉。" />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        {news.items.length ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {news.items.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
            <Pagination
              page={news.page}
              totalPages={news.totalPages}
              hrefFor={(nextPage) => pageHref("/news", nextPage)}
            />
          </>
        ) : (
          <EmptyState
            message={
              news.ok ? "暂无新闻动态。" : "新闻动态暂时无法加载，请稍后刷新。"
            }
          />
        )}
      </section>
    </>
  );
}
