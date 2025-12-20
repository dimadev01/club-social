/*
  Warnings:

  - You are about to drop the column `dueId` on the `payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_dueId_fkey";

-- DropIndex
DROP INDEX "payment_dueId_idx";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "dueId";

-- CreateTable
CREATE TABLE "payment_due" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "dueId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,

    CONSTRAINT "payment_due_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_due_paymentId_idx" ON "payment_due"("paymentId");

-- CreateIndex
CREATE INDEX "payment_due_dueId_idx" ON "payment_due"("dueId");

-- AddForeignKey
ALTER TABLE "payment_due" ADD CONSTRAINT "payment_due_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_due" ADD CONSTRAINT "payment_due_dueId_fkey" FOREIGN KEY ("dueId") REFERENCES "due"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
