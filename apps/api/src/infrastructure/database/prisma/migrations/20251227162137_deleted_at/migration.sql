/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `due` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `due` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `due_settlement` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `due_settlement` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `movement` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `movement` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `payment` table. All the data in the column will be lost.
  - Added the required column `source` to the `member_ledger_entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "due" DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy";

-- AlterTable
ALTER TABLE "due_settlement" DROP COLUMN "createdAt",
DROP COLUMN "createdBy";

-- AlterTable
ALTER TABLE "member" DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy";

-- AlterTable
ALTER TABLE "member_ledger_entry" ADD COLUMN     "source" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "movement" DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy";

-- AddForeignKey
ALTER TABLE "movement" ADD CONSTRAINT "movement_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
