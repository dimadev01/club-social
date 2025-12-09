/*
  Warnings:

  - Added the required column `createdBy` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "updatedBy" TEXT NOT NULL;
