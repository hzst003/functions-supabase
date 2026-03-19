/*
  Warnings:

  - The primary key for the `material_lists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `material_lists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "material_lists" DROP CONSTRAINT "material_lists_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "material_lists_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ProjectInfo" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "constructionUnit" TEXT,
    "workflow" TEXT,
    "initiatedAt" TIMESTAMP(3),
    "initiator" TEXT,
    "approvalNode" TEXT,
    "urgencyLevel" TEXT,
    "reviewStatus" TEXT,
    "receivedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInfo_code_key" ON "ProjectInfo"("code");
