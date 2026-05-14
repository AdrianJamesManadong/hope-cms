-- ============================================================
-- Hope, Inc. CMS
-- Migration: 001_initial_schema.sql
-- PR-01: db/initial-schema
-- HopeDB 5 CMS tables + record_status/stamp on customer only
-- ============================================================

-- 1. CUSTOMER TABLE
-- record_status and stamp added to customer ONLY
-- Other tables (sales, salesDetail, product, priceHist) unchanged

ALTER TABLE customer
  ALTER COLUMN stamp DROP DEFAULT;

ALTER TABLE customer
  ALTER COLUMN stamp TYPE TIMESTAMP USING NULL;

ALTER TABLE customer
  ALTER COLUMN stamp SET DEFAULT now();

-- Confirm record_status default is ACTIVE
ALTER TABLE customer
  ALTER COLUMN record_status SET DEFAULT 'ACTIVE';

-- ============================================================
-- VERIFICATION
-- Run after applying to confirm schema is correct
-- ============================================================

-- Should show: record_status (varchar, default 'ACTIVE') and stamp (timestamp, default now())
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'customer'
ORDER BY ordinal_position;

-- Should show 5 CMS tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('customer', 'sales', 'salesdetail', 'product', 'pricehist')
ORDER BY table_name;