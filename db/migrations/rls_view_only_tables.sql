-- RLS Policies for view-only tables
-- Sprint 2 - M3 PR-02
-- Confirms SELECT-only access for sales, salesdetail, product, pricehist
-- NO INSERT, UPDATE, or DELETE policies exist for any of these tables

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE salesdetail ENABLE ROW LEVEL SECURITY;
ALTER TABLE product ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricehist ENABLE ROW LEVEL SECURITY;

-- SELECT only: sales
CREATE POLICY "Select only"
ON sales FOR SELECT
TO authenticated
USING (true);

-- SELECT only: salesdetail
CREATE POLICY "Select only"
ON salesdetail FOR SELECT
TO authenticated
USING (true);

-- SELECT only: product
CREATE POLICY "Select only"
ON product FOR SELECT
TO authenticated
USING (true);

-- SELECT only: pricehist
CREATE POLICY "Select only"
ON pricehist FOR SELECT
TO authenticated
USING (true);