import { unstable_cache } from "next/cache";
import PocketBase from "pocketbase";
import { cache } from "react";
import type {
  Milestone,
  NewsItem,
  Project,
  Service,
  Settings,
} from "./types";

export const PB_URL =
  process.env.POCKETBASE_URL ||
  process.env.NEXT_PUBLIC_POCKETBASE_URL ||
  "http://127.0.0.1:8090";

export const PROJECTS_PER_PAGE = 6;
export const NEWS_PER_PAGE = 6;

const REVALIDATE_SECONDS = 60;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const PROJECTS_TAG = "projects";
const SERVICES_TAG = "services";
const NEWS_TAG = "news";
const SETTINGS_TAG = "settings";
const MILESTONES_TAG = "milestones";

export { PROJECT_CATEGORIES } from "./project-constants";

export function isValidProjectSlug(slug: string) {
  return SLUG_RE.test(slug);
}

export function createPb() {
  return new PocketBase(PB_URL);
}

/** Registered on each cover field. PocketBase rejects any other thumb size. */
export const COVER_THUMB = "800x450";

export function fileUrl(
  collectionId: string,
  recordId: string,
  filename: string,
) {
  if (!filename) return "";
  return `${PB_URL}/api/files/${collectionId}/${recordId}/${filename}?thumb=${COVER_THUMB}`;
}

export function assetUrl(
  collectionId: string,
  recordId: string,
  filename: string,
) {
  if (!collectionId || !recordId || !filename) return "";
  return `${PB_URL}/api/files/${collectionId}/${recordId}/${filename}`;
}

export function quoteFilter(value: string) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

const FALLBACK_SETTINGS: Settings = {
  id: "fallback",
  companyName: "启衡通信",
  tagline: "以通信工程，联通可信网络",
  aboutSubtitle: "以专业通信工程能力，服务运营商网络与政企数字化。",
  about:
    "<p>启衡通信是一家专业通信工程企业，业务覆盖 5G 基站建设、光纤传输、室内分布与弱电智能化。</p>",
  phone: "400-800-6688",
  email: "contact@qiheng-telecom.example",
  address: "上海市浦东新区张江高科技园区科苑路 88 号启衡通信大厦 12 层",
  years: 16,
  projectsCount: 480,
  clientsCount: 90,
  qualifications:
    "通信工程施工总承包一级；电子与智能化工程专业承包一级；信息通信网络系统集成甲级；安全生产许可证",
  logo: "",
  collectionId: "",
};

export type ListResult<T> = {
  items: T[];
  ok: boolean;
};

export type PageResult<T> = ListResult<T> & {
  page: number;
  totalPages: number;
  totalItems: number;
};

function isNotFound(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: number }).status === 404
  );
}

function logPbError(label: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const cause =
    error instanceof Error && error.cause instanceof Error
      ? error.cause.message
      : "";
  console.error(`[pb] ${label}: ${message}${cause ? ` (${cause})` : ""}`);
}

const readSettings = unstable_cache(
  async () => {
    const pb = createPb();
    return pb.collection("settings").getFirstListItem<Settings>("");
  },
  ["settings"],
  { revalidate: REVALIDATE_SECONDS, tags: [SETTINGS_TAG] },
);

const readServices = unstable_cache(
  async () => {
    const pb = createPb();
    return pb.collection("services").getFullList<Service>({
      filter: "published = true",
      sort: "sort",
    });
  },
  ["services"],
  { revalidate: REVALIDATE_SECONDS, tags: [SERVICES_TAG] },
);

const readFeaturedProjects = unstable_cache(
  async () => {
    const pb = createPb();
    const result = await pb.collection("projects").getList<Project>(1, 6, {
      filter: "published = true && featured = true",
      sort: "-year",
    });
    return result.items;
  },
  ["projects-featured"],
  { revalidate: REVALIDATE_SECONDS, tags: [PROJECTS_TAG] },
);

const readProjectsPage = unstable_cache(
  async (page: number, perPage: number, category: string) => {
    const pb = createPb();
    const filter = category
      ? `published = true && category = ${quoteFilter(category)}`
      : "published = true";
    const result = await pb.collection("projects").getList<Project>(page, perPage, {
      filter,
      sort: "-year",
    });
    return {
      items: result.items,
      page: result.page,
      totalPages: result.totalPages,
      totalItems: result.totalItems,
    };
  },
  ["projects-page"],
  { revalidate: REVALIDATE_SECONDS, tags: [PROJECTS_TAG] },
);

const readProjectBySlug = unstable_cache(
  async (slug: string) => {
    const pb = createPb();
    return pb
      .collection("projects")
      .getFirstListItem<Project>(
        `slug = ${quoteFilter(slug)} && published = true`,
      );
  },
  ["project-by-slug"],
  { revalidate: REVALIDATE_SECONDS, tags: [PROJECTS_TAG] },
);

const readProjectCategories = unstable_cache(
  async () => {
    const pb = createPb();
    const items = await pb.collection("projects").getFullList<{ category: string }>({
      filter: "published = true",
      fields: "category",
      sort: "category",
    });
    return [...new Set(items.map((item) => item.category).filter(Boolean))];
  },
  ["project-categories"],
  { revalidate: REVALIDATE_SECONDS, tags: [PROJECTS_TAG] },
);

const readProjectSlugs = unstable_cache(
  async () => {
    const pb = createPb();
    const items = await pb.collection("projects").getFullList<{ slug: string }>({
      filter: "published = true",
      fields: "slug",
      sort: "-year",
    });
    return items.map((item) => item.slug);
  },
  ["project-slugs"],
  { revalidate: REVALIDATE_SECONDS, tags: [PROJECTS_TAG] },
);

const readLatestNews = unstable_cache(
  async (limit: number) => {
    const pb = createPb();
    const result = await pb.collection("news").getList<NewsItem>(1, limit, {
      filter: "published = true",
      sort: "-publishedAt",
    });
    return result.items;
  },
  ["news-latest"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] },
);

const readNewsPage = unstable_cache(
  async (page: number, perPage: number) => {
    const pb = createPb();
    const result = await pb.collection("news").getList<NewsItem>(page, perPage, {
      filter: "published = true",
      sort: "-publishedAt",
    });
    return {
      items: result.items,
      page: result.page,
      totalPages: result.totalPages,
      totalItems: result.totalItems,
    };
  },
  ["news-page"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] },
);

const readNewsBySlug = unstable_cache(
  async (slug: string) => {
    const pb = createPb();
    return pb
      .collection("news")
      .getFirstListItem<NewsItem>(`slug = ${quoteFilter(slug)} && published = true`);
  },
  ["news-by-slug"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] },
);

const readNewsSlugs = unstable_cache(
  async () => {
    const pb = createPb();
    const items = await pb.collection("news").getFullList<{ slug: string }>({
      filter: "published = true",
      fields: "slug",
      sort: "-publishedAt",
    });
    return items.map((item) => item.slug);
  },
  ["news-slugs"],
  { revalidate: REVALIDATE_SECONDS, tags: [NEWS_TAG] },
);

const readMilestones = unstable_cache(
  async () => {
    const pb = createPb();
    return pb.collection("milestones").getFullList<Milestone>({
      sort: "year",
    });
  },
  ["milestones"],
  { revalidate: REVALIDATE_SECONDS, tags: [MILESTONES_TAG] },
);

export const getSettings = cache(async (): Promise<Settings> => {
  try {
    return await readSettings();
  } catch (error) {
    logPbError("getSettings", error);
    return FALLBACK_SETTINGS;
  }
});

export const getServices = cache(async (): Promise<ListResult<Service>> => {
  try {
    return { items: await readServices(), ok: true };
  } catch (error) {
    logPbError("getServices", error);
    return { items: [], ok: false };
  }
});

export const getFeaturedProjects = cache(
  async (): Promise<ListResult<Project>> => {
    try {
      return { items: await readFeaturedProjects(), ok: true };
    } catch (error) {
      logPbError("getFeaturedProjects", error);
      return { items: [], ok: false };
    }
  },
);

export const getProjectCategories = cache(async (): Promise<string[]> => {
  try {
    return await readProjectCategories();
  } catch (error) {
    logPbError("getProjectCategories", error);
    return [];
  }
});

export const getProjectsPage = cache(
  async (page: number, category = ""): Promise<PageResult<Project>> => {
    try {
      const result = await readProjectsPage(page, PROJECTS_PER_PAGE, category);
      return { ...result, ok: true };
    } catch (error) {
      logPbError("getProjectsPage", error);
      return {
        items: [],
        page,
        totalPages: 0,
        totalItems: 0,
        ok: false,
      };
    }
  },
);

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    if (!SLUG_RE.test(slug)) return null;
    try {
      return await readProjectBySlug(slug);
    } catch (error) {
      if (!isNotFound(error)) logPbError("getProjectBySlug", error);
      return null;
    }
  },
);

export const getProjectSlugs = cache(async (): Promise<string[]> => {
  try {
    return await readProjectSlugs();
  } catch (error) {
    logPbError("getProjectSlugs", error);
    return [];
  }
});

export const getLatestNews = cache(
  async (limit: number): Promise<ListResult<NewsItem>> => {
    try {
      return { items: await readLatestNews(limit), ok: true };
    } catch (error) {
      logPbError("getLatestNews", error);
      return { items: [], ok: false };
    }
  },
);

export const getNewsPage = cache(
  async (page: number): Promise<PageResult<NewsItem>> => {
    try {
      const result = await readNewsPage(page, NEWS_PER_PAGE);
      return { ...result, ok: true };
    } catch (error) {
      logPbError("getNewsPage", error);
      return {
        items: [],
        page,
        totalPages: 0,
        totalItems: 0,
        ok: false,
      };
    }
  },
);

export const getNewsBySlug = cache(
  async (slug: string): Promise<NewsItem | null> => {
    if (!SLUG_RE.test(slug)) return null;
    try {
      return await readNewsBySlug(slug);
    } catch (error) {
      if (!isNotFound(error)) logPbError("getNewsBySlug", error);
      return null;
    }
  },
);

export const getNewsSlugs = cache(async (): Promise<string[]> => {
  try {
    return await readNewsSlugs();
  } catch (error) {
    logPbError("getNewsSlugs", error);
    return [];
  }
});

export const getMilestones = cache(
  async (): Promise<ListResult<Milestone>> => {
    try {
      return { items: await readMilestones(), ok: true };
    } catch (error) {
      logPbError("getMilestones", error);
      return { items: [], ok: false };
    }
  },
);

export type InquiryInput = {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  message: string;
};

export async function createInquiry(data: InquiryInput) {
  const pb = createPb();
  return pb.collection("inquiries").create(data);
}
