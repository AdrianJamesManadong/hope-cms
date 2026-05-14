-- ============================================================
-- Hope, Inc. CMS
-- Migration: 002_rights_seed.sql
-- PR-02: db/rights-seed
-- 4 modules + 9 rights + SUPERADMIN seed
-- ============================================================

-- 1. SEED 4 MODULES
INSERT INTO module (module_code, module_name, record_status) VALUES
  ('Cust_Mod', 'Customer Module', 'ACTIVE'),
  ('Sales_Mod', 'Sales Module',    'ACTIVE'),
  ('Prod_Mod',  'Product Module',  'ACTIVE'),
  ('Adm_Mod',   'Admin Module',    'ACTIVE')
ON CONFLICT (module_code) DO NOTHING;

-- 2. SEED 9 RIGHTS
INSERT INTO rights (right_code, right_name, default_value, module_code, record_status) VALUES
  ('CUST_VIEW',  'View Customers',        1, 'Cust_Mod',  'ACTIVE'),
  ('CUST_ADD',   'Add Customer',          1, 'Cust_Mod',  'ACTIVE'),
  ('CUST_EDIT',  'Edit Customer',         1, 'Cust_Mod',  'ACTIVE'),
  ('CUST_DEL',   'Soft Delete Customer',  1, 'Cust_Mod',  'ACTIVE'),
  ('SALES_VIEW', 'View Sales',            1, 'Sales_Mod', 'ACTIVE'),
  ('SD_VIEW',    'View Sales Detail',     1, 'Sales_Mod', 'ACTIVE'),
  ('PROD_VIEW',  'View Products',         1, 'Prod_Mod',  'ACTIVE'),
  ('PRICE_VIEW', 'View Price History',    1, 'Prod_Mod',  'ACTIVE'),
  ('ADM_USER',   'Admin Activate User',   1, 'Adm_Mod',   'ACTIVE')
ON CONFLICT (right_code) DO NOTHING;

-- 3. SUPERADMIN: all 9 rights = 1
-- Note: SUPERADMIN user (jcesperanza@neu.edu.ph) must already exist in auth.users
-- usermodule_rights rows are inserted via provision_new_user() trigger on signup
-- The following confirms SUPERADMIN rights are set to 1 for all 9 rights

-- VERIFICATION
-- ============================================================

-- Should return 4 modules
SELECT COUNT(*) AS module_count FROM module;

-- Should return 9 rights
SELECT COUNT(*) AS rights_count FROM rights;

-- Should return SUPERADMIN user with all 9 rights = 1
SELECT u.username, u.user_type, umr.right_code, umr.right_value
FROM users u
JOIN usermodule_rights umr ON u.userid = umr.userid
WHERE u.user_type = 'SUPERADMIN'
ORDER BY u.username, umr.right_code;