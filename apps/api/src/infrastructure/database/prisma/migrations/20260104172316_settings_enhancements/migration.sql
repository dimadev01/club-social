-- AlterTable
ALTER TABLE "app_setting" ADD COLUMN     "scope" TEXT NOT NULL DEFAULT 'system';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "preferences" JSONB;
