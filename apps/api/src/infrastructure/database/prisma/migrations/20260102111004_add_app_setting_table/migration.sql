-- CreateTable
CREATE TABLE "app_setting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "app_setting_pkey" PRIMARY KEY ("key")
);

-- Seed maintenance-mode setting
INSERT INTO "app_setting" ("key", "value", "description", "updatedAt")
VALUES ('maintenance-mode', '{"enabled": false}', 'When enabled, only admins can access the system', NOW());
