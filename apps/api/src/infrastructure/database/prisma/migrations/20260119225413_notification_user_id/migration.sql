-- Notification: Replace memberId with userId
-- Drop all existing notification data (approved by user)

-- Drop the foreign key constraint and index first
ALTER TABLE "notification" DROP CONSTRAINT IF EXISTS "notification_memberId_fkey";
DROP INDEX IF EXISTS "notification_memberId_idx";

-- Delete all existing notifications
DELETE FROM "notification";

-- Remove memberId column
ALTER TABLE "notification" DROP COLUMN "memberId";

-- Add userId column
ALTER TABLE "notification" ADD COLUMN "userId" TEXT NOT NULL;

-- Create foreign key constraint to user table
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create index on userId
CREATE INDEX "notification_userId_idx" ON "notification"("userId");

-- Add notificationPreferences column to user table
ALTER TABLE "user" ADD COLUMN "notificationPreferences" JSONB;
