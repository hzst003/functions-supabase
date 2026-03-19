-- CreateTable
CREATE TABLE "material_lists" (
    "id" SERIAL NOT NULL,
    "项目名称" TEXT,
    "品名" TEXT NOT NULL,
    "材料编号" TEXT NOT NULL,
    "规格" TEXT,
    "数量" DECIMAL(12,4) NOT NULL,
    "单位" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "material_lists_pkey" PRIMARY KEY ("id")
);
