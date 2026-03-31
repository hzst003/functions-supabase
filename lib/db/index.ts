import { randomUUID } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const globalForDb = globalThis as unknown as {
  supabase: SupabaseClient | undefined;
};

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function getSupabaseServerKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Missing required env var: SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)"
    );
  }
  return key;
}

const supabase =
  globalForDb.supabase ??
  createClient(
    getEnv("SUPABASE_URL"),
    getSupabaseServerKey(),
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

if (process.env.NODE_ENV !== "production") {
  globalForDb.supabase = supabase;
}

export type MaterialListRow = {
  id: string;
  项目名称: string | null;
  品名: string;
  材料编号: string;
  规格: string | null;
  数量: string;
  单位: string;
};

export type ProjectInfoRow = {
  id: string;
  code: string;
  projectName: string;
  constructionUnit: string | null;
  workflow: string | null;
  initiatedAt: Date | null;
  initiator: string | null;
  approvalNode: string | null;
  urgencyLevel: string | null;
  reviewStatus: string | null;
  receivedAt: Date | null;
};

export async function fetchAllMaterials(): Promise<MaterialListRow[]> {
  const { data, error } = await supabase
    .from("material_lists")
    .select('id, "项目名称", "品名", "材料编号", "规格", "数量", "单位"');
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: String(row.id),
    项目名称: row.项目名称 ?? null,
    品名: String(row.品名 ?? ""),
    材料编号: String(row.材料编号 ?? ""),
    规格: row.规格 ?? null,
    数量: String(row.数量 ?? ""),
    单位: String(row.单位 ?? ""),
  }));
}

export async function fetchProjectsOrdered(): Promise<ProjectInfoRow[]> {
  const { data, error } = await supabase
    .from("ProjectInfo")
    .select(
      'id, code, "projectName", "constructionUnit", workflow, "initiatedAt", initiator, "approvalNode", "urgencyLevel", "reviewStatus", "receivedAt"'
    )
    .order("initiatedAt", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: String(row.id),
    code: String(row.code ?? ""),
    projectName: String(row.projectName ?? ""),
    constructionUnit: row.constructionUnit ?? null,
    workflow: row.workflow ?? null,
    initiatedAt: row.initiatedAt ? new Date(String(row.initiatedAt)) : null,
    initiator: row.initiator ?? null,
    approvalNode: row.approvalNode ?? null,
    urgencyLevel: row.urgencyLevel ?? null,
    reviewStatus: row.reviewStatus ?? null,
    receivedAt: row.receivedAt ? new Date(String(row.receivedAt)) : null,
  }));
}

export async function fetchProjectByCode(
  code: string
): Promise<ProjectInfoRow | undefined> {
  const { data, error } = await supabase
    .from("ProjectInfo")
    .select(
      'id, code, "projectName", "constructionUnit", workflow, "initiatedAt", initiator, "approvalNode", "urgencyLevel", "reviewStatus", "receivedAt"'
    )
    .eq("code", code)
    .limit(1);
  if (error) throw error;
  const row = data?.[0];
  if (!row) return undefined;
  return {
    id: String(row.id),
    code: String(row.code ?? ""),
    projectName: String(row.projectName ?? ""),
    constructionUnit: row.constructionUnit ?? null,
    workflow: row.workflow ?? null,
    initiatedAt: row.initiatedAt ? new Date(String(row.initiatedAt)) : null,
    initiator: row.initiator ?? null,
    approvalNode: row.approvalNode ?? null,
    urgencyLevel: row.urgencyLevel ?? null,
    reviewStatus: row.reviewStatus ?? null,
    receivedAt: row.receivedAt ? new Date(String(row.receivedAt)) : null,
  };
}

export async function fetchMaterialsForProject(
  decodedCode: string,
  projectName: string | null
): Promise<MaterialListRow[]> {
  const candidateNames = new Set<string>();
  candidateNames.add(decodedCode);
  if (projectName) candidateNames.add(projectName);

  const merged = new Map<string, MaterialListRow>();
  for (const name of candidateNames) {
    const { data, error } = await supabase
      .from("material_lists")
      .select('id, "项目名称", "品名", "材料编号", "规格", "数量", "单位"')
      .eq("项目名称", name);
    if (error) throw error;
    for (const row of data ?? []) {
      const id = String(row.id);
      merged.set(id, {
        id,
        项目名称: row.项目名称 ?? null,
        品名: String(row.品名 ?? ""),
        材料编号: String(row.材料编号 ?? ""),
        规格: row.规格 ?? null,
        数量: String(row.数量 ?? ""),
        单位: String(row.单位 ?? ""),
      });
    }
  }
  return [...merged.values()];
}

type MaterialInsert = {
  项目名称: string | null;
  品名: string;
  材料编号: string;
  规格: string | null;
  数量: string;
  单位: string;
};

/** 与原先 Drizzle 行为一致：事务内先清空 material_lists 再批量插入 */
export async function replaceAllMaterialLists(
  rows: MaterialInsert[]
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("material_lists")
    .delete()
    .not("id", "is", null);
  if (deleteError) throw deleteError;

  if (rows.length === 0) return;

  const insertRows = rows.map((row) => ({
    id: randomUUID(),
    项目名称: row.项目名称,
    品名: row.品名,
    材料编号: row.材料编号,
    规格: row.规格,
    数量: row.数量,
    单位: row.单位,
  }));

  const chunkSize = 500;
  for (let i = 0; i < insertRows.length; i += chunkSize) {
    const chunk = insertRows.slice(i, i + chunkSize);
    const { error } = await supabase.from("material_lists").insert(chunk);
    if (error) throw error;
  }
}
