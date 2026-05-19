import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function SalesDetailPage() {
  const { custno } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTrans, setExpandedTrans] = useState({});

  useEffect(() => {
    loadData();
  }, [custno]);

  const loadData = async () => {
  setLoading(true);
  setError(null);

  try {
    // 1. Get customer info
    const { data: custData, error: custErr } = await supabase
      .from('customer')
      .select('custno, custname, address, payterm')
      .eq('custno', custno)
      .single();

    if (custErr) throw custErr;
    setCustomer(custData);

    // 2. Get all sales for this customer
    const { data: salesData, error: salesErr } = await supabase
      .from('sales')
      .select('transno, salesdate, empno')
      .eq('custno', custno)
      .order('salesdate', { ascending: false });

    if (salesErr) throw salesErr;

    // 3. For each transaction, fetch items manually
    const enriched = await Promise.all(
      (salesData || []).map(async (sale) => {

        // Get salesdetail rows
        const { data: detailRows } = await supabase
          .from('salesdetail')
          .select('transno, prodcode, quantity')   // <-- quantity not qty
          .eq('transno', sale.transno);

        if (!detailRows || detailRows.length === 0)
          return { ...sale, items: [], total: 0 };

        const prodCodes = detailRows.map((r) => r.prodcode);

        // Get product info
        const { data: products } = await supabase
          .from('product')
          .select('prodcode, description, unit')
          .in('prodcode', prodCodes);

        // Get price history
        const { data: prices } = await supabase
          .from('pricehist')
          .select('prodcode, unitprice, effdate')
          .in('prodcode', prodCodes)
          .lte('effdate', sale.salesdate)   // price effective at or before sale date
          .order('effdate', { ascending: false });

        const productMap = {};
        (products || []).forEach((p) => (productMap[p.prodcode] = p));

        // Pick the most recent valid price per product
        const priceMap = {};
        (prices || []).forEach((p) => {
          if (!priceMap[p.prodcode]) priceMap[p.prodcode] = p.unitprice;
        });

        const items = detailRows.map((row) => {
          const prod = productMap[row.prodcode] || {};
          const unitprice = priceMap[row.prodcode] ?? 0;
          const qty = Number(row.quantity);        // <-- quantity
          const subtotal = qty * Number(unitprice);
          return {
            prodcode: row.prodcode,
            description: prod.description ?? '—',
            unit: prod.unit ?? '—',
            qty,
            unitprice,
            subtotal,
          };
        });

        const total = items.reduce((sum, i) => sum + i.subtotal, 0);
        return { ...sale, items, total };
      })
    );

    setTransactions(enriched);
  } catch (err) {
    console.error(err);
    setError('Failed to load sales details.');
  } finally {
    setLoading(false);
  }
};

  const toggleTrans = (transno) => {
    setExpandedTrans((prev) => ({
      ...prev,
      [transno]: !prev[transno],
    }));
  };

  const grandTotal = transactions.reduce(
    (sum, t) => sum + (t.total ?? 0),
    0
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .sd-page {
          min-height: 100vh;
          background: #0a0f1e;
          padding: 32px;
          font-family: 'Inter', sans-serif;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .sd-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(59,130,246,.10), transparent 35%),
            radial-gradient(circle at bottom left, rgba(168,85,247,.08), transparent 35%);
          pointer-events: none;
        }

        .sd-back {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 24px;
          background: none;
          border: none;
          padding: 0;
          transition: color .2s;
        }

        .sd-back:hover { color: #60a5fa; }

        .sd-header {
          position: relative;
          z-index: 2;
          margin-bottom: 28px;
        }

        .sd-title {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }

        .sd-sub {
          color: #64748b;
          font-size: 13px;
        }

        .sd-cust-card {
          position: relative;
          z-index: 2;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 20px;
          padding: 20px 24px;
          margin-bottom: 28px;
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
        }

        .sd-cust-field label {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .sd-cust-field span {
          font-size: 15px;
          font-weight: 600;
          color: white;
        }

        .sd-stats {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .sd-stat {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 18px;
          padding: 18px 22px;
        }

        .sd-stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .sd-stat-value {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .blue { color: #60a5fa; }
        .green { color: #4ade80; }

        .sd-section-label {
          position: relative;
          z-index: 2;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .trans-list {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .trans-card {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 18px;
          overflow: hidden;
          transition: border-color .2s;
        }

        .trans-card.expanded {
          border-color: rgba(59,130,246,.25);
        }

        .trans-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          cursor: pointer;
          transition: background .2s;
        }

        .trans-header:hover {
          background: rgba(255,255,255,.03);
        }

        .trans-header-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .trans-badge {
          background: rgba(59,130,246,.12);
          border: 1px solid rgba(59,130,246,.2);
          color: #60a5fa;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 8px;
          font-family: monospace;
        }

        .trans-date {
          color: #94a3b8;
          font-size: 13px;
        }

        .trans-emp {
          color: #64748b;
          font-size: 12px;
        }

        .trans-header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .trans-total {
          color: #4ade80;
          font-weight: 700;
          font-size: 15px;
        }

        .trans-item-count {
          color: #64748b;
          font-size: 12px;
        }

        .trans-chevron {
          color: #475569;
          font-size: 18px;
          transition: transform .25s;
        }

        .trans-card.expanded .trans-chevron {
          transform: rotate(180deg);
          color: #60a5fa;
        }

        .trans-body {
          border-top: 1px solid rgba(255,255,255,.05);
          overflow: hidden;
          max-height: 0;
          transition: max-height .35s ease;
        }

        .trans-card.expanded .trans-body {
          max-height: 2000px;
        }

        .detail-table {
          width: 100%;
          border-collapse: collapse;
        }

        .detail-table thead {
          background: rgba(255,255,255,.03);
        }

        .detail-table th {
          text-align: left;
          padding: 12px 22px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #64748b;
          font-weight: 700;
        }

        .detail-table td {
          padding: 14px 22px;
          border-top: 1px solid rgba(255,255,255,.04);
          font-size: 13px;
          color: #e2e8f0;
        }

        .detail-table .mono {
          font-family: monospace;
          color: #94a3b8;
        }

        .detail-table .money {
          color: #4ade80;
          font-weight: 600;
        }

        .trans-footer {
          padding: 14px 22px;
          border-top: 1px solid rgba(255,255,255,.05);
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,.02);
        }

        .trans-footer-label {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
        }

        .trans-footer-total {
          color: #4ade80;
          font-size: 17px;
          font-weight: 800;
        }

        .no-items {
          padding: 28px;
          text-align: center;
          color: #475569;
          font-size: 13px;
        }

        .loading, .empty {
          padding: 70px 20px;
          text-align: center;
          color: #64748b;
        }

        .error-box {
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(239,68,68,.08);
          border: 1px solid rgba(239,68,68,.18);
          color: #f87171;
          margin-bottom: 18px;
          font-size: 13px;
          position: relative;
          z-index: 2;
        }

        @media(max-width:900px){
          .sd-page { padding: 20px; }
          .sd-stats { grid-template-columns: 1fr; }
          .sd-title { font-size: 26px; }
          .sd-cust-card { gap: 20px; }
          .detail-table { min-width: 640px; }
          .trans-body { overflow-x: auto; }
        }
      `}</style>

      <div className="sd-page">
        {/* BACK BUTTON */}
        <button className="sd-back" onClick={() => navigate('/sales')}>
          ← Back to Sales Summary
        </button>

        {loading ? (
          <div className="loading">Loading transaction details...</div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : (
          <>
            {/* HEADER */}
            <div className="sd-header">
              <h1 className="sd-title">Sales Details</h1>
              <p className="sd-sub">
                Transaction history and itemized purchases for this customer.
              </p>
            </div>

            {/* CUSTOMER INFO */}
            {customer && (
              <div className="sd-cust-card">
                <div className="sd-cust-field">
                  <label>Customer No</label>
                  <span style={{ fontFamily: 'monospace' }}>{customer.custno}</span>
                </div>
                <div className="sd-cust-field">
                  <label>Customer Name</label>
                  <span>{customer.custname}</span>
                </div>
                {customer.address && (
                  <div className="sd-cust-field">
                    <label>Address</label>
                    <span>{customer.address}</span>
                  </div>
                )}
                {customer.payterm && (
                  <div className="sd-cust-field">
                    <label>Pay Term</label>
                    <span>{customer.payterm}</span>
                  </div>
                )}
              </div>
            )}

            {/* STATS */}
            <div className="sd-stats">
              <div className="sd-stat">
                <p className="sd-stat-label">Total Transactions</p>
                <h2 className="sd-stat-value blue">{transactions.length}</h2>
              </div>
              <div className="sd-stat">
                <p className="sd-stat-label">Total Items Purchased</p>
                <h2 className="sd-stat-value blue">
                  {transactions.reduce((sum, t) => sum + t.items.length, 0)}
                </h2>
              </div>
              <div className="sd-stat">
                <p className="sd-stat-label">Grand Total</p>
                <h2 className="sd-stat-value green">
                  ₱{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </h2>
              </div>
            </div>

            {/* TRANSACTIONS */}
            <p className="sd-section-label">
              Transactions — click to expand items
            </p>

            {transactions.length === 0 ? (
              <div className="empty">No transactions found for this customer.</div>
            ) : (
              <div className="trans-list">
                {transactions.map((t) => {
                  const isOpen = !!expandedTrans[t.transno];
                  return (
                    <div
                      key={t.transno}
                      className={`trans-card${isOpen ? ' expanded' : ''}`}
                    >
                      {/* Transaction Header */}
                      <div
                        className="trans-header"
                        onClick={() => toggleTrans(t.transno)}
                      >
                        <div className="trans-header-left">
                          <span className="trans-badge">{t.transno}</span>
                          <div>
                            <div className="trans-date">{t.salesdate}</div>
                            {t.empno && (
                              <div className="trans-emp">Emp: {t.empno}</div>
                            )}
                          </div>
                        </div>
                        <div className="trans-header-right">
                          <div style={{ textAlign: 'right' }}>
                            <div className="trans-total">
                              ₱{(t.total ?? 0).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                            <div className="trans-item-count">
                              {t.items.length} item{t.items.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <span className="trans-chevron">▾</span>
                        </div>
                      </div>

                      {/* Transaction Body — salesDetail + product + priceHist */}
                      <div className="trans-body">
                        {t.items.length === 0 ? (
                          <div className="no-items">No items found for this transaction.</div>
                        ) : (
                          <>
                            <table className="detail-table">
                              <thead>
                                <tr>
                                  <th>Prod Code</th>
                                  <th>Description</th>
                                  <th>Unit</th>
                                  <th style={{ textAlign: 'right' }}>Qty</th>
                                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {t.items.map((item) => (
                                  <tr key={item.prodcode}>
                                    <td className="mono">{item.prodcode}</td>
                                    <td>{item.description}</td>
                                    <td>{item.unit}</td>
                                    <td style={{ textAlign: 'right' }}>{item.qty}</td>
                                    <td className="money" style={{ textAlign: 'right' }}>
                                      ₱{Number(item.unitprice).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td className="money" style={{ textAlign: 'right' }}>
                                      ₱{item.subtotal.toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="trans-footer">
                              <span className="trans-footer-label">Transaction Total</span>
                              <span className="trans-footer-total">
                                ₱{(t.total ?? 0).toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default SalesDetailPage;