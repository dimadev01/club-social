/*
  Warnings:

  - You are about to drop the column `notificationPreferences` on the `member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "member" DROP COLUMN "notificationPreferences";

-- AlterTable
ALTER TABLE "notification" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "attempts" DROP DEFAULT,
ALTER COLUMN "maxAttempts" DROP DEFAULT;
