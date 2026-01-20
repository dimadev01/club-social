-- Rename the app setting key from 'send-member-notifications' to 'send-notifications'
UPDATE "app_setting"
SET "id" = 'send-notifications'
WHERE "id" = 'send-member-notifications';
