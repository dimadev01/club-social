/*
  Warnings:

  - You are about to drop the `user_preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_preferences" DROP CONSTRAINT "user_preferences_userId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "preferences" JSONB,
ALTER COLUMN "emailVerified" DROP DEFAULT,
ALTER COLUMN "banned" DROP DEFAULT,
ALTER COLUMN "updatedBy" DROP NOT NULL;

-- DropTable
DROP TABLE "user_preferences";
