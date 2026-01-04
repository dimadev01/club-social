-- This is an empty migration
INSERT INTO "app_setting" ("id", "value", "description", "updatedAt")
VALUES ('send-emails', '{"enabled": true}', 'When enabled, emails will be sent', NOW());
