import type { MetadataRoute } from "next";
import { getNewsSlugs, getProjectSlugs } from "@/lib/pb";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [projectSlugs, newsSlugs] = await Promise.all([
    getProjectSlugs(),
    getNewsSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/services",
    "/projects",
    "/news",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...projectSlugs.map((slug) => ({
      url: `${base}/projects/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...newsSlugs.map((slug) => ({
      url: `${base}/news/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
