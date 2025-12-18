-- AlterTable
ALTER TABLE "due" ALTER COLUMN "date" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "date" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "due_date_idx" ON "due"("date");

-- CreateIndex
CREATE INDEX "payment_date_idx" ON "payment"("date");
