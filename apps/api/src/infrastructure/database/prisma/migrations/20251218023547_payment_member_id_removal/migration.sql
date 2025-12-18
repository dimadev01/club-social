/*
  Warnings:

  - You are about to drop the column `memberId` on the `payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_memberId_fkey";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "memberId";
