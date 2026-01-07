-- Consolidate electricity and guest pricing to use base prices (memberCategory = NULL)
-- These categories have the same price across all member categories, so we only need one base price each.

-- Step 1: Update one record per category to become the base price (set memberCategory = NULL)
-- For electricity: keep 5141cf5a-a169-4c89-bf9d-3c82f5dfb679 (currently 'member', amount 500000)
UPDATE "pricing"
SET "memberCategory" = NULL
WHERE "id" = '5141cf5a-a169-4c89-bf9d-3c82f5dfb679';

-- For guest: keep f87b702c-5bf0-4fff-857b-b7c92e967051 (currently 'member', amount 1150000)
UPDATE "pricing"
SET "memberCategory" = NULL
WHERE "id" = 'f87b702c-5bf0-4fff-857b-b7c92e967051';

-- Step 2: Hard-delete the redundant category-specific records for electricity
DELETE FROM "pricing"
WHERE "dueCategory" = 'electricity'
  AND "memberCategory" IS NOT NULL;

-- Step 3: Hard-delete the redundant category-specific records for guest
DELETE FROM "pricing"
WHERE "dueCategory" = 'guest'
  AND "memberCategory" IS NOT NULL;