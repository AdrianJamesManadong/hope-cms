import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { salesService } from '../services/salesService';

function CustomerDetailPage() {
  const { custno } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);

  const [selectedTrans, setSelectedTrans] = useState(null);
  const [transDetail, setTransDetail] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadCustomer();
    loadSales();
  }, [custno]);

  const loadCustomer = async () => {
    setLoadingCustomer(true);
    const { data, error } = await import('../lib/supabaseClient.js').then(
      ({ supabase }) =>
        supabase.from('customer').select('*').eq('custno', custno).single()
    );
    if (!error) setCustomer(data);
    setLoadingCustomer(false);
  };

  const loadSales = async () => {
    setLoadingSales(true);
    const { data } = await salesService.getSalesByCustomer(custno);
    setSales(data || []);
    setLoadingSales(false);
  };

  const openTransDetail = async (trans) => {
    setSelectedTrans(trans);
    setLoadingDetail(true);
    setShowDetailModal(true);
    const { data } = await salesService.getSalesDetailWithProducts(
      trans.transno,
      trans.salesdate  // pass salesdate for correct pricehist lookup
    );
    setTransDetail(data || []);
    setLoadingDetail(false);
  };

  const totalTransactions = sales.length;

  // ── Loading state ──
  if (loadingCustomer) {
    return (
      <>
        <style>{pageStyles}</style>
        <div className="cd-page">
          <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
            Loading customer...
          </div>
        </div>
      </>
    );
  }

  // ── Not found ──
  if (!customer) {
    return (
      <>
        <style>{pageStyles}</style>
        <div className="cd-page">
          <div style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ color: '#e2e8f0', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Customer Not Found</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
              The customer record you are looking for does not exist.
            </p>
            <button className="cd-btn-primary" onClick={() => navigate('/customers')}>
              ← Back to Customers
            </button>
          </div>
        </div>
      </>
    );
  }

  const isActive = customer.record_status === 'ACTIVE';

  return (
    <>
      <style>{pageStyles}</style>

      <div className="cd-page">

        {/* ── Back button ── */}
        <button className="cd-back-btn" onClick={() => navigate('/customers')}>
          ← Back to Customers
        </button>

        {/* ── Page title ── */}
        <div className="cd-header">
          <div>
            <h1 className="cd-title">Customer Details</h1>
            <p className="cd-sub">View customer information and transaction history.</p>
          </div>
          <span className={`cd-status-badge ${isActive ? 'active' : 'inactive'}`}>
            {customer.record_status}
          </span>
        </div>

        {/* ── Stat cards ── */}
        <div className="cd-stats">
          <div className="cd-stat-card accent">
            <p className="cd-stat-label">Customer Number</p>
            <h2 className="cd-stat-value mono">{customer.custno}</h2>
          </div>
          <div className="cd-stat-card">
            <p className="cd-stat-label">Payment Term</p>
            <h2 className="cd-stat-value">{customer.payterm}</h2>
          </div>
          <div className="cd-stat-card">
            <p className="cd-stat-label">Total Transactions</p>
            <h2 className="cd-stat-value blue">{totalTransactions}</h2>
          </div>
        </div>

        {/* ── Customer profile ── */}
        <div className="cd-card">
          <div className="cd-card-header">
            <h2 className="cd-card-title">Customer Profile</h2>
            <p className="cd-card-sub">Customer information and account details.</p>
          </div>
          <div className="cd-profile-grid">
            <div>
              <p className="cd-field-label">Customer Name</p>
              <p className="cd-field-value">{customer.custname}</p>
            </div>
            <div>
              <p className="cd-field-label">Address</p>
              <p className="cd-field-value muted">{customer.address}</p>
            </div>
            {customer.stamp && (
              <div>
                <p className="cd-field-label">Stamp</p>
                <p className="cd-field-value muted mono-sm">{customer.stamp}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sales history ── */}
        <div className="cd-card">
          <div className="cd-card-header row">
            <div>
              <h2 className="cd-card-title">Sales History</h2>
              <p className="cd-card-sub">Click any transaction to view detailed line items.</p>
            </div>
            <span className="cd-count-badge">
              {sales.length} transaction{sales.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loadingSales ? (
            <div className="cd-empty">Loading sales history...</div>
          ) : sales.length === 0 ? (
            <div className="cd-empty">
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              No sales recorded for this customer.
            </div>
          ) : (
            <div className="cd-table-wrap">
              <table className="cd-table">
                <thead>
                  <tr>
                    <th>Trans No</th>
                    <th>Sales Date</th>
                    <th>Employee No</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.transno} onClick={() => openTransDetail(sale)} className="clickable">
                      <td className="mono-sm bold-val">{sale.transno}</td>
                      <td>{sale.salesdate}</td>
                      <td>{sale.empno}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="cd-view-btn">View Details →</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {showDetailModal && selectedTrans && (
        <div className="cd-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="cd-modal" onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="cd-modal-header">
              <div>
                <h3 className="cd-modal-title">Transaction {selectedTrans.transno}</h3>
                <p className="cd-modal-sub">
                  Date: {selectedTrans.salesdate} &nbsp;•&nbsp; Employee: {selectedTrans.empno}
                </p>
              </div>
              <button className="cd-modal-close" onClick={() => setShowDetailModal(false)}>×</button>
            </div>

            {/* Modal body */}
            <div className="cd-modal-body">
              {loadingDetail ? (
                <div className="cd-empty">Loading line items...</div>
              ) : transDetail.length === 0 ? (
                <div className="cd-empty">No line items found.</div>
              ) : (
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>Prod Code</th>
                      <th>Description</th>
                      <th>Unit</th>
                      <th style={{ textAlign: 'right' }}>Qty</th>
                      <th style={{ textAlign: 'right' }}>Unit Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transDetail.map((item, idx) => (
                      <tr key={idx}>
                        <td className="mono-sm bold-val">{item.prodcode}</td>
                        <td>{item.product?.description ?? '—'}</td>
                        <td className="muted-val">{item.product?.unit ?? '—'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="cd-qty-badge">{item.quantity}</span>
                        </td>
                        <td style={{ textAlign: 'right' }} className="price-val">
                          {item.product?.unitprice != null
                            ? `₱${Number(item.product.unitprice).toFixed(2)}`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal footer */}
            <div className="cd-modal-footer">
              <button className="cd-btn-primary" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const pageStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; }

  .cd-page {
    min-height: 100vh;
    background: #0a0f1e;
    padding: 32px;
    font-family: 'Inter', sans-serif;
    color: white;
    position: relative;
  }

  .cd-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(circle at top right, rgba(59,130,246,.10), transparent 35%),
      radial-gradient(circle at bottom left, rgba(168,85,247,.08), transparent 35%);
    pointer-events: none;
  }

  /* Back button */
  .cd-back-btn {
    background: none;
    border: none;
    color: #3b82f6;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    margin-bottom: 20px;
    display: inline-block;
    transition: color .15s;
    position: relative;
    z-index: 2;
  }
  .cd-back-btn:hover { color: #60a5fa; }

  /* Header */
  .cd-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 28px;
    position: relative;
    z-index: 2;
  }

  .cd-title {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin: 0 0 6px;
  }

  .cd-sub {
    color: #64748b;
    font-size: 13px;
    margin: 0;
  }

  .cd-status-badge {
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .05em;
    flex-shrink: 0;
    margin-top: 6px;
  }
  .cd-status-badge.active   { background: rgba(74,222,128,.12); border: 1px solid rgba(74,222,128,.3); color: #4ade80; }
  .cd-status-badge.inactive { background: rgba(248,113,113,.12); border: 1px solid rgba(248,113,113,.3); color: #f87171; }

  /* Stat cards */
  .cd-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 24px;
    position: relative;
    z-index: 2;
  }

  .cd-stat-card {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 22px;
    padding: 22px;
    backdrop-filter: blur(12px);
    transition: .2s;
  }
  .cd-stat-card:hover { transform: translateY(-2px); border-color: rgba(59,130,246,.18); }
  .cd-stat-card.accent {
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    border-color: transparent;
  }

  .cd-stat-label {
    color: #64748b;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .08em;
    font-weight: 700;
    margin: 0 0 10px;
  }
  .cd-stat-card.accent .cd-stat-label { color: #bfdbfe; }

  .cd-stat-value {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin: 0;
    color: #e2e8f0;
  }
  .cd-stat-value.mono  { font-family: monospace; }
  .cd-stat-value.blue  { color: #60a5fa; }

  /* Cards */
  .cd-card {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 22px;
    overflow: hidden;
    backdrop-filter: blur(12px);
    margin-bottom: 24px;
    position: relative;
    z-index: 2;
  }

  .cd-card-header {
    padding: 24px 28px;
    border-bottom: 1px solid rgba(255,255,255,.06);
    background: rgba(255,255,255,.02);
  }
  .cd-card-header.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .cd-card-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 4px;
    color: #e2e8f0;
  }

  .cd-card-sub {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  .cd-count-badge {
    background: rgba(59,130,246,.12);
    border: 1px solid rgba(59,130,246,.25);
    color: #60a5fa;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* Profile grid */
  .cd-profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    padding: 28px;
  }

  .cd-field-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: #64748b;
    margin: 0 0 6px;
  }

  .cd-field-value {
    font-size: 17px;
    font-weight: 700;
    color: #e2e8f0;
    margin: 0;
  }
  .cd-field-value.muted    { font-weight: 400; color: #94a3b8; font-size: 15px; }
  .cd-field-value.mono-sm  { font-family: monospace; font-size: 13px; color: #64748b; }

  /* Table */
  .cd-table-wrap { overflow-x: auto; }

  .cd-table { width: 100%; border-collapse: collapse; min-width: 600px; }

  .cd-table thead { background: rgba(255,255,255,.03); }

  .cd-table th {
    padding: 14px 20px;
    text-align: left;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: #64748b;
    font-weight: 700;
    border-bottom: 1px solid rgba(255,255,255,.05);
  }

  .cd-table td {
    padding: 16px 20px;
    border-top: 1px solid rgba(255,255,255,.05);
    color: #e2e8f0;
    font-size: 14px;
  }

  .cd-table tr.clickable { cursor: pointer; transition: background .15s; }
  .cd-table tr.clickable:hover { background: rgba(59,130,246,.06); }

  .mono-sm  { font-family: monospace; }
  .bold-val { font-weight: 600; color: #e2e8f0; }
  .muted-val { color: #94a3b8; }
  .price-val { color: #4ade80; font-weight: 700; }

  .cd-view-btn {
    display: inline-flex;
    align-items: center;
    background: rgba(59,130,246,.12);
    border: 1px solid rgba(59,130,246,.25);
    color: #60a5fa;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 20px;
    white-space: nowrap;
  }

  .cd-qty-badge {
    display: inline-block;
    background: rgba(59,130,246,.12);
    color: #60a5fa;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
  }

  .cd-empty {
    padding: 60px 20px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
  }

  /* Modal */
  .cd-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.7);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 20px;
  }

  .cd-modal {
    background: #13131a;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 24px;
    width: 100%;
    max-width: 860px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 80px rgba(0,0,0,.6);
  }

  .cd-modal-header {
    padding: 24px 28px;
    border-bottom: 1px solid rgba(255,255,255,.07);
    background: rgba(255,255,255,.03);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-shrink: 0;
  }

  .cd-modal-title {
    font-size: 20px;
    font-weight: 800;
    color: #e2e8f0;
    margin: 0 0 4px;
  }

  .cd-modal-sub {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }

  .cd-modal-close {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.08);
    color: #94a3b8;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: .15s;
    line-height: 1;
  }
  .cd-modal-close:hover { background: rgba(239,68,68,.15); color: #f87171; }

  .cd-modal-body {
    flex: 1;
    overflow: auto;
  }

  .cd-modal-footer {
    padding: 16px 28px;
    border-top: 1px solid rgba(255,255,255,.07);
    background: rgba(255,255,255,.02);
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
  }

  /* Buttons */
  .cd-btn-primary {
    background: #2563eb;
    color: white;
    border: none;
    padding: 10px 22px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background .15s;
  }
  .cd-btn-primary:hover { background: #1d4ed8; }

  @media (max-width: 900px) {
    .cd-page   { padding: 20px; }
    .cd-stats  { grid-template-columns: 1fr; }
    .cd-profile-grid { grid-template-columns: 1fr; }
    .cd-title  { font-size: 26px; }
    .cd-header { flex-direction: column; }
  }
`;

export default CustomerDetailPage;