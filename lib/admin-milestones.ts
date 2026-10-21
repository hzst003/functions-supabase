import type { Milestone } from "./types";
import { requireAdmin } from "./admin-auth";

export async function getAdminMilestones(): Promise<Milestone[]> {
  const pb = await requireAdmin();
  if (!pb) return [];
  try {
    return await pb.collection("milestones").getFullList<Milestone>({
      sort: "year",
    });
  } catch (error) {
    console.error("[admin] getAdminMilestones", error);
    return [];
  }
}

export async function getAdminMilestoneById(
  id: string,
): Promise<Milestone | null> {
  if (!id || !/^[a-z0-9]+$/i.test(id)) return null;
  const pb = await requireAdmin();
  if (!pb) return null;
  try {
    return await pb.collection("milestones").getOne<Milestone>(id);
  } catch {
    return null;
  }
}
