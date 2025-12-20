/*
  Warnings:

  - The primary key for the `payment_due` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `payment_due` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `payment_due` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `payment_due` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `payment_due` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `payment_due` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `payment_due` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `payment_due` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment_due" DROP CONSTRAINT "payment_due_paymentId_fkey";

-- AlterTable
ALTER TABLE "payment_due" DROP CONSTRAINT "payment_due_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy",
ADD CONSTRAINT "payment_due_pkey" PRIMARY KEY ("paymentId", "dueId");

-- AddForeignKey
ALTER TABLE "payment_due" ADD CONSTRAINT "payment_due_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
