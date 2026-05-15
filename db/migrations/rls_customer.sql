-- RLS Policies for customer table
-- Sprint 2 - M3 PR-01

ALTER TABLE customer ENABLE ROW LEVEL SECURITY;

-- SELECT: Active customers visible to all authenticated users
CREATE POLICY "Active customers visible to all authenticated users"
ON customer FOR SELECT
TO authenticated
USING (
  (record_status)::text = 'ACTIVE'::text
);

-- SELECT: Admins see all customers
CREATE POLICY "Admins see all customers"
ON customer FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.userid = (auth.uid())::text
      AND (users.user_type)::text = ANY (
        ARRAY['ADMIN'::character varying, 'SUPERADMIN'::character varying]::text[]
      )
  )
);

-- INSERT: Admins can add customers
CREATE POLICY "Admins can add customers"
ON customer FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.userid = (auth.uid())::text
      AND (users.user_type)::text = ANY (
        ARRAY['ADMIN'::character varying, 'SUPERADMIN'::character varying]::text[]
      )
  )
);

-- UPDATE: Admins can update customers
CREATE POLICY "Admins can update customers"
ON customer FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.userid = (auth.uid())::text
      AND (users.user_type)::text = ANY (
        ARRAY['ADMIN'::character varying, 'SUPERADMIN'::character varying]::text[]
      )
  )
);