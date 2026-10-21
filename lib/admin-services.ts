import type { Service } from "./types";
import { requireAdmin } from "./admin-auth";
import { fileUrl } from "./pb";

export type AdminService = Service & {
  coverUrl: string;
};

function withCover(service: Service): AdminService {
  return {
    ...service,
    coverUrl: fileUrl(service.collectionId, service.id, service.cover),
  };
}

export async function getAdminServices(): Promise<AdminService[]> {
  const pb = await requireAdmin();
  if (!pb) return [];
  try {
    const items = await pb.collection("services").getFullList<Service>({
      sort: "sort",
    });
    return items.map(withCover);
  } catch (error) {
    console.error("[admin] getAdminServices", error);
    return [];
  }
}

export async function getAdminServiceById(
  id: string,
): Promise<AdminService | null> {
  if (!id || !/^[a-z0-9]+$/i.test(id)) return null;
  const pb = await requireAdmin();
  if (!pb) return null;
  try {
    const service = await pb.collection("services").getOne<Service>(id);
    return withCover(service);
  } catch {
    return null;
  }
}
