-- SQL View: customer_sales_summary
-- Sprint 2 - M3 PR-04
-- Returns total transactions, total spend, and last sale date per active customer

CREATE OR REPLACE VIEW customer_sales_summary AS
SELECT
  c.custno,
  c.custname,
  COUNT(DISTINCT s.transno) AS total_transactions,
  COALESCE(SUM(sd.quantity * ph.unitprice), 0) AS total_spend,
  MAX(s.salesdate) AS last_sale_date
FROM customer c
  LEFT JOIN sales s ON s.custno::text = c.custno::text
  LEFT JOIN salesdetail sd ON sd.transno::text = s.transno::text
  LEFT JOIN (
    SELECT DISTINCT ON (pricehist.prodcode)
      pricehist.prodcode,
      pricehist.unitprice
    FROM pricehist
    ORDER BY pricehist.prodcode, pricehist.effdate DESC
  ) ph ON ph.prodcode::text = sd.prodcode::text
WHERE c.record_status::text = 'ACTIVE'::text
GROUP BY c.custno, c.custname
ORDER BY COALESCE(SUM(sd.quantity * ph.unitprice), 0) DESC;