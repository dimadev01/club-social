/*
  Warnings:

  - You are about to drop the column `type` on the `movement` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "movement_type_idx";

-- AlterTable
ALTER TABLE "movement" DROP COLUMN "type";
