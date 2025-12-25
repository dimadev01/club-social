/*
  Warnings:

  - Added the required column `mode` to the `movement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movement" ADD COLUMN     "mode" TEXT NOT NULL;
