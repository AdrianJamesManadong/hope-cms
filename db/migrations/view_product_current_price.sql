-- SQL View: product_current_price
-- Sprint 2 - M3 PR-03
-- Returns the latest price per product from pricehist

CREATE OR REPLACE VIEW product_current_price AS
SELECT DISTINCT ON (prodcode)
  prodcode,
  unitprice,
  effdate
FROM pricehist
ORDER BY prodcode, effdate DESC;