-- AlterTable
ALTER TABLE "group" ADD COLUMN "deletedAt" TIMESTAMP(3),
ADD COLUMN "deletedBy" TEXT;
