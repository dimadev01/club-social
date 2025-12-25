/*
  Warnings:

  - Changed the type of `entity` on the `audit_log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `action` on the `audit_log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "audit_log" DROP COLUMN "entity",
ADD COLUMN     "entity" TEXT NOT NULL,
DROP COLUMN "action",
ADD COLUMN     "action" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AuditAction";

-- DropEnum
DROP TYPE "AuditEntity";

-- CreateIndex
CREATE INDEX "audit_log_entity_entityId_idx" ON "audit_log"("entity", "entityId");
