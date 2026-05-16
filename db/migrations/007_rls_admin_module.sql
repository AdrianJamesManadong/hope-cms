-- =============================================================
-- HopeCMS - Migration 007: RLS on users + usermodule_rights
--           with SUPERADMIN guard
-- PR-02: db/rls-admin-module
-- =============================================================

-- ---------------------------------------------------------------
-- USERS table — ADMIN can UPDATE record_status only
-- but CANNOT touch SUPERADMIN rows
-- ---------------------------------------------------------------
DROP POLICY IF EXISTS "ADMIN: update user record_status" ON users;
CREATE POLICY "ADMIN: update user record_status"
ON users
FOR UPDATE
TO authenticated
USING (
  (SELECT user_type FROM users WHERE userid = auth.uid()) = 'ADMIN'
  AND user_type != 'SUPERADMIN'
)
WITH CHECK (
  (SELECT user_type FROM users WHERE userid = auth.uid()) = 'ADMIN'
  AND user_type != 'SUPERADMIN'
);

-- ---------------------------------------------------------------
-- USERMODULE_RIGHTS — ADMIN cannot INSERT, UPDATE, DELETE
-- rows where userid belongs to a SUPERADMIN
-- ---------------------------------------------------------------
DROP POLICY IF EXISTS "ADMIN: cannot modify SUPERADMIN rights" ON usermodule_rights;
CREATE POLICY "ADMIN: cannot modify SUPERADMIN rights"
ON usermodule_rights
FOR ALL
TO authenticated
USING (
  (SELECT user_type FROM users WHERE userid = auth.uid()) = 'ADMIN'
  AND (SELECT user_type FROM users WHERE userid = usermodule_rights.userid) != 'SUPERADMIN'
)
WITH CHECK (
  (SELECT user_type FROM users WHERE userid = auth.uid()) = 'ADMIN'
  AND (SELECT user_type FROM users WHERE userid = usermodule_rights.userid) != 'SUPERADMIN'
);