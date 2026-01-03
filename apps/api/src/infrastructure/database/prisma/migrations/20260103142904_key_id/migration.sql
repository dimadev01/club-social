/*
  Warnings:

  - The primary key for the `app_setting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `key` on the `app_setting` table. All the data in the column will be lost.
  - Added the required column `id` to the `app_setting` table without a default value. This is not possible if the table is not empty.

*/

-- Drop existing values
DELETE FROM "app_setting";

-- AlterTable
ALTER TABLE "app_setting" DROP CONSTRAINT "app_setting_pkey",
DROP COLUMN "key",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "app_setting_pkey" PRIMARY KEY ("id");


INSERT INTO "app_setting" ("id", "value", "description", "updatedAt")
VALUES ('maintenance-mode', '{"enabled": false}', 'When enabled, only admins can access the system', NOW());
