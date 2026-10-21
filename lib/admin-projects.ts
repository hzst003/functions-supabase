import type { Project } from "./types";
import { requireAdmin } from "./admin-auth";
import { fileUrl } from "./pb";

export type AdminProject = Project & {
  coverUrl: string;
};

function withCover(project: Project): AdminProject {
  return {
    ...project,
    coverUrl: fileUrl(project.collectionId, project.id, project.cover),
  };
}

export async function getAdminProjects(): Promise<AdminProject[]> {
  const pb = await requireAdmin();
  if (!pb) return [];
  try {
    const items = await pb.collection("projects").getFullList<Project>({
      sort: "-year",
    });
    return items.map(withCover);
  } catch (error) {
    console.error("[admin] getAdminProjects", error);
    return [];
  }
}

export async function getAdminProjectById(
  id: string,
): Promise<AdminProject | null> {
  if (!id || !/^[a-z0-9]+$/i.test(id)) return null;
  const pb = await requireAdmin();
  if (!pb) return null;
  try {
    const project = await pb.collection("projects").getOne<Project>(id);
    return withCover(project);
  } catch {
    return null;
  }
}
