-- This is an empty migration.

INSERT INTO "app_setting" ("id", "value", "description", "updatedAt")
VALUES ('send-member-notifications', '{"enabled": false}', 'When enabled, member notifications will be sent', NOW());