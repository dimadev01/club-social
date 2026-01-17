-- AlterTable
ALTER TABLE "group" ALTER COLUMN "discountPercent" DROP DEFAULT;

-- AlterTable
ALTER TABLE "member" ADD COLUMN     "notificationPreferences" JSONB;
