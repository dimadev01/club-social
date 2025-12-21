/*
  Warnings:

  - Added the required column `memberId` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "memberId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "due_createdAt_idx" ON "due"("createdAt");

-- CreateIndex
CREATE INDEX "payment_memberId_idx" ON "payment"("memberId");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE INDEX "payment_createdAt_idx" ON "payment"("createdAt");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
