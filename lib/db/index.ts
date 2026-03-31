import { randomUUID } from "crypto";
import { Pool } from "pg";

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

const pool =
  globalForDb.pool ??
  new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export { pool };

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
  const { rows } = await pool.query<MaterialListRow>(`
    SELECT id, "项目名称", "品名", "材料编号", "规格", "数量"::text AS "数量", "单位"
    FROM material_lists
  `);
  return rows;
}

export async function fetchProjectsOrdered(): Promise<ProjectInfoRow[]> {
  const { rows } = await pool.query<ProjectInfoRow>(`
    SELECT id, code, "projectName", "constructionUnit", workflow, "initiatedAt",
           initiator, "approvalNode", "urgencyLevel", "reviewStatus", "receivedAt"
    FROM "ProjectInfo"
    ORDER BY "initiatedAt" DESC NULLS LAST
  `);
  return rows;
}

export async function fetchProjectByCode(
  code: string
): Promise<ProjectInfoRow | undefined> {
  const { rows } = await pool.query<ProjectInfoRow>(
    `
    SELECT id, code, "projectName", "constructionUnit", workflow, "initiatedAt",
           initiator, "approvalNode", "urgencyLevel", "reviewStatus", "receivedAt"
    FROM "ProjectInfo"
    WHERE code = $1
    LIMIT 1
    `,
    [code]
  );
  return rows[0];
}

export async function fetchMaterialsForProject(
  decodedCode: string,
  projectName: string | null
): Promise<MaterialListRow[]> {
  const { rows } = await pool.query<MaterialListRow>(
    `
    SELECT id, "项目名称", "品名", "材料编号", "规格", "数量"::text AS "数量", "单位"
    FROM material_lists
    WHERE "项目名称" = $1
       OR ($2::text IS NOT NULL AND "项目名称" = $2)
    `,
    [decodedCode, projectName]
  );
  return rows;
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
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM material_lists");
    if (rows.length > 0) {
      const cols = 7;
      const placeholders = rows
        .map((_, rowIdx) => {
          const base = rowIdx * cols + 1;
          return `($${base}, $${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6})`;
        })
        .join(", ");
      const params: unknown[] = [];
      for (const row of rows) {
        params.push(
          randomUUID(),
          row.项目名称,
          row.品名,
          row.材料编号,
          row.规格,
          row.数量,
          row.单位
        );
      }
      await client.query(
        `
        INSERT INTO material_lists (id, "项目名称", "品名", "材料编号", "规格", "数量", "单位")
        VALUES ${placeholders}
        `,
        params
      );
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
