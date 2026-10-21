import type { NewsItem } from "./types";
import { requireAdmin } from "./admin-auth";
import { fileUrl } from "./pb";

export type AdminNews = NewsItem & {
  coverUrl: string;
};

function withCover(item: NewsItem): AdminNews {
  return {
    ...item,
    coverUrl: fileUrl(item.collectionId, item.id, item.cover),
  };
}

export async function getAdminNews(): Promise<AdminNews[]> {
  const pb = await requireAdmin();
  if (!pb) return [];
  try {
    const items = await pb.collection("news").getFullList<NewsItem>({
      sort: "-publishedAt",
    });
    return items.map(withCover);
  } catch (error) {
    console.error("[admin] getAdminNews", error);
    return [];
  }
}

export async function getAdminNewsById(
  id: string,
): Promise<AdminNews | null> {
  if (!id || !/^[a-z0-9]+$/i.test(id)) return null;
  const pb = await requireAdmin();
  if (!pb) return null;
  try {
    const item = await pb.collection("news").getOne<NewsItem>(id);
    return withCover(item);
  } catch {
    return null;
  }
}
