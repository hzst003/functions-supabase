import {
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const materialLists = pgTable("material_lists", {
  // 库表无 DEFAULT uuid；插入时需由应用传入 id（与旧 Prisma 行为一致）
  id: uuid("id").primaryKey(),
  项目名称: text("项目名称"),
  品名: text("品名").notNull(),
  材料编号: text("材料编号").notNull(),
  规格: text("规格"),
  数量: decimal("数量", { precision: 12, scale: 4 }).notNull(),
  单位: text("单位").notNull().default(""),
});

export const projectInfo = pgTable("ProjectInfo", {
  id: uuid("id").primaryKey(),
  code: text("code").notNull().unique(),
  projectName: text("projectName").notNull(),
  constructionUnit: text("constructionUnit"),
  workflow: text("workflow"),
  initiatedAt: timestamp("initiatedAt", { mode: "date", precision: 3 }),
  initiator: text("initiator"),
  approvalNode: text("approvalNode"),
  urgencyLevel: text("urgencyLevel"),
  reviewStatus: text("reviewStatus"),
  receivedAt: timestamp("receivedAt", { mode: "date", precision: 3 }),
});
