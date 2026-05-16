-- =============================================================
-- HopeCMS - Migration 006: product_revenue SQL view
-- PR-01: db/view-product-revenue
-- =============================================================

CREATE OR REPLACE VIEW product_revenue AS
SELECT
  p.prodcode,
  p.description,
  p.unit,
  SUM(sd.qty)                                    AS total_qty_sold,
  SUM(sd.qty * ph.unitprice)                     AS total_revenue
FROM salesdetail sd
JOIN product p    ON p.prodcode  = sd.prodcode
JOIN (
  -- Latest price per product
  SELECT DISTINCT ON (prodcode)
    prodcode,
    unitprice
  FROM pricehist
  ORDER BY prodcode, effdate DESC
) ph ON ph.prodcode = sd.prodcode
GROUP BY p.prodcode, p.description, p.unit
ORDER BY total_revenue DESC;