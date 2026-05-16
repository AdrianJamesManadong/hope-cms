-- =============================================================
-- HopeCMS - Migration 008: Fix stamp column type on customer table
-- PR: fix/stamp-column-type
-- =============================================================

-- Change stamp column from TIMESTAMPTZ to TEXT
-- stamp stores audit trail strings like "UPD:b481e8f4 5/16/2026"
-- not a pure timestamp value

ALTER TABLE customer ALTER COLUMN stamp TYPE TEXT;