-- AlterTable
ALTER TABLE "payment_due" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "payment_due_status_idx" ON "payment_due"("status");
