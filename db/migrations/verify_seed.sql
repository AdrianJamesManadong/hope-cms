-- ============================================================
-- HopeDB CMS – Seed Verification Queries
-- Sprint 1 · PR-04 · db/verify-seed
-- Hope, Inc. Customer Management System
-- New Era University – CCS
-- ============================================================

-- ------------------------------------------------------------
-- 1. ROW COUNT CHECKS
-- Expected: customer=82, sales=124, product=52
--           salesDetail=~250, priceHist=~70
-- ------------------------------------------------------------

SELECT 'customer'    AS table_name, COUNT(*) AS row_count FROM customer
UNION ALL
SELECT 'sales',                      COUNT(*)             FROM sales
UNION ALL
SELECT 'salesDetail',                COUNT(*)             FROM salesDetail
UNION ALL
SELECT 'product',                    COUNT(*)             FROM product
UNION ALL
SELECT 'priceHist',                  COUNT(*)             FROM priceHist;


-- ------------------------------------------------------------
-- 2. CUSTOMER TABLE – record_status & stamp COLUMNS
-- All seeded customers should have record_status = 'ACTIVE'
-- stamp may be NULL on initial seed (no edits yet)
-- ------------------------------------------------------------

-- Check record_status values (should only show 'ACTIVE')
SELECT record_status, COUNT(*) AS count
FROM customer
GROUP BY record_status;

-- Check for any NULL record_status (should return 0 rows)
SELECT custno, custname
FROM customer
WHERE record_status IS NULL;


-- ------------------------------------------------------------
-- 3. FK CHECK – sales.custNo → customer.custno
-- Should return 0 rows (no orphaned sales records)
-- ------------------------------------------------------------

SELECT s.transNo, s.custNo
FROM sales s
LEFT JOIN customer c ON s.custNo = c.custno
WHERE c.custno IS NULL;


-- ------------------------------------------------------------
-- 4. FK CHECK – salesDetail.transNo → sales.transNo
-- Should return 0 rows
-- ------------------------------------------------------------

SELECT sd.transNo, sd.prodCode
FROM salesDetail sd
LEFT JOIN sales s ON sd.transNo = s.transNo
WHERE s.transNo IS NULL;


-- ------------------------------------------------------------
-- 5. FK CHECK – salesDetail.prodCode → product.prodCode
-- Should return 0 rows
-- ------------------------------------------------------------

SELECT sd.transNo, sd.prodCode
FROM salesDetail sd
LEFT JOIN product p ON sd.prodCode = p.prodCode
WHERE p.prodCode IS NULL;


-- ------------------------------------------------------------
-- 6. FK CHECK – priceHist.prodCode → product.prodCode
-- Should return 0 rows
-- ------------------------------------------------------------

SELECT ph.effDate, ph.prodCode
FROM priceHist ph
LEFT JOIN product p ON ph.prodCode = p.prodCode
WHERE p.prodCode IS NULL;


-- ------------------------------------------------------------
-- 7. PAYTERM CONSTRAINT CHECK – customer
-- Only 'COD', '30D', '45D' allowed
-- Should return 0 rows
-- ------------------------------------------------------------

SELECT custno, custname, payterm
FROM customer
WHERE payterm NOT IN ('COD', '30D', '45D');


-- ------------------------------------------------------------
-- 8. UNIT CONSTRAINT CHECK – product
-- Only 'pc', 'ea', 'mtr', 'pkg', 'ltr' allowed
-- Should return 0 rows
-- ------------------------------------------------------------

SELECT prodCode, description, unit
FROM product
WHERE unit NOT IN ('pc', 'ea', 'mtr', 'pkg', 'ltr');


-- ------------------------------------------------------------
-- 9. PRICE CONSTRAINT CHECK – priceHist
-- unitPrice must be > 0
-- Should return 0 rows
-- ------------------------------------------------------------

SELECT effDate, prodCode, unitPrice
FROM priceHist
WHERE unitPrice <= 0 OR unitPrice IS NULL;


-- ------------------------------------------------------------
-- 10. QUANTITY CONSTRAINT CHECK – salesDetail
-- quantity must be >= 0
-- Should return 0 rows
-- ------------------------------------------------------------

SELECT transNo, prodCode, quantity
FROM salesDetail
WHERE quantity < 0 OR quantity IS NULL;


-- ------------------------------------------------------------
-- 11. DUPLICATE PK CHECK – salesDetail (transNo + prodCode)
-- Should return 0 rows
-- ------------------------------------------------------------

SELECT transNo, prodCode, COUNT(*) AS duplicates
FROM salesDetail
GROUP BY transNo, prodCode
HAVING COUNT(*) > 1;


-- ------------------------------------------------------------
-- 12. DUPLICATE PK CHECK – priceHist (effDate + prodCode)
-- Should return 0 rows
-- ------------------------------------------------------------

SELECT effDate, prodCode, COUNT(*) AS duplicates
FROM priceHist
GROUP BY effDate, prodCode
HAVING COUNT(*) > 1;


-- ============================================================
-- SUMMARY: All queries above should return either:
--   - A count matching the expected row counts (section 1)
--   - 0 rows / only 'ACTIVE' status (all other sections)
-- ============================================================