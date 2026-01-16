-- Seed group-discount-tiers setting with default tiers
INSERT INTO "app_setting" ("id", "value", "description", "scope", "updatedAt")
VALUES ('group-discount-tiers', '[{"minSize": 3, "maxSize": 3, "percent": 20}, {"minSize": 4, "maxSize": 4, "percent": 30}, {"minSize": 5, "maxSize": 5, "percent": 40}]', 'Discount tiers for group memberships', 'app', NOW());
