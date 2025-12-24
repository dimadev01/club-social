-- AlterEnum
ALTER TYPE "AuditEntity" ADD VALUE 'PRICING';

-- CreateTable
CREATE TABLE "pricing" (
    "id" TEXT NOT NULL,
    "dueCategory" TEXT NOT NULL,
    "memberCategory" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "effectiveFrom" TEXT NOT NULL,
    "effectiveTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "pricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pricing_dueCategory_idx" ON "pricing"("dueCategory");

-- CreateIndex
CREATE INDEX "pricing_memberCategory_idx" ON "pricing"("memberCategory");

-- CreateIndex
CREATE INDEX "pricing_effectiveFrom_idx" ON "pricing"("effectiveFrom");

-- CreateIndex
CREATE INDEX "pricing_effectiveTo_idx" ON "pricing"("effectiveTo");

-- CreateIndex
CREATE INDEX "pricing_dueCategory_memberCategory_effectiveFrom_effectiveT_idx" ON "pricing"("dueCategory", "memberCategory", "effectiveFrom", "effectiveTo");
