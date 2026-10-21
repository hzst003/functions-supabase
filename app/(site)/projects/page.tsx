import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { PageHero } from "@/components/PageHero";
import { Pagination } from "@/components/Pagination";
import { ProjectCard } from "@/components/ProjectCard";
import { pageHref, readCategory, readPage } from "@/lib/format";
import { getProjectCategories, getProjectsPage } from "@/lib/pb";

export const revalidate = 60;

export async function generateMetadata(
  props: PageProps<"/projects">,
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const categories = await getProjectCategories();
  const page = readPage(searchParams.page);
  const category = readCategory(searchParams.category, categories);

  return {
    title: category ? `${category}业绩` : "工程业绩",
    description: category
      ? `${category}方向的代表性通信工程业绩。`
      : "代表性通信工程业绩，展示网络建设与交付能力。",
    alternates: {
      canonical: pageHref("/projects", page, { category }),
    },
  };
}

function chipClass(active: boolean) {
  return active
    ? "rounded-full bg-navy-900 px-3 py-1.5 text-sm text-white"
    : "rounded-full border border-slate-300 px-3 py-1.5 text-sm text-navy-800 hover:bg-slate-100";
}

export default async function ProjectsPage(props: PageProps<"/projects">) {
  const searchParams = await props.searchParams;
  const categories = await getProjectCategories();
  const page = readPage(searchParams.page);
  const category = readCategory(searchParams.category, categories);
  const projects = await getProjectsPage(page, category);

  if (projects.ok && projects.totalPages > 0 && page > projects.totalPages) {
    redirect(pageHref("/projects", projects.totalPages, { category }));
  }

  return (
    <>
      <PageHero
        title="工程业绩"
        subtitle="精选代表性通信工程，展示网络建设与交付能力。"
      />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        {categories.length > 0 ? (
          <nav aria-label="业绩分类" className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/projects"
              aria-current={category ? undefined : "page"}
              className={chipClass(!category)}
            >
              全部
            </Link>
            {categories.map((item) => (
              <Link
                key={item}
                href={pageHref("/projects", 1, { category: item })}
                aria-current={item === category ? "page" : undefined}
                className={chipClass(item === category)}
              >
                {item}
              </Link>
            ))}
          </nav>
        ) : null}
        {projects.items.length ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <Pagination
              page={projects.page}
              totalPages={projects.totalPages}
              hrefFor={(nextPage) =>
                pageHref("/projects", nextPage, { category })
              }
            />
          </>
        ) : (
          <EmptyState
            message={
              projects.ok
                ? category
                  ? `暂无「${category}」相关业绩。`
                  : "暂无工程业绩，请稍后查看。"
                : "工程业绩暂时无法加载，请稍后刷新。"
            }
          />
        )}
      </section>
    </>
  );
}
