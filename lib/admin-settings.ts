import { requireAdmin } from "./admin-auth";
import type { Settings } from "./types";

export async function getAdminSettings(): Promise<Settings | null> {
  const pb = await requireAdmin();
  if (!pb) return null;
  try {
    return await pb.collection("settings").getFirstListItem<Settings>("");
  } catch (error) {
    console.error("[admin] getAdminSettings", error);
    return null;
  }
}
