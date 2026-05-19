import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';

function PriceHistoryPage() {
  const [priceHist, setPriceHist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPriceHistory();
  }, []);

  const loadPriceHistory = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('pricehist')
      .select(`
        effdate,
        prodcode,
        unitprice,
        product (description, unit)
      `)
      .order('prodcode', { ascending: true })
      .order('effdate', { ascending: false });

    if (error) setError('Failed to load price history.');
    setPriceHist(data || []);
    setLoading(false);
  };

  const filtered = priceHist.filter(
    (p) =>
      p.prodcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.product?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueProducts = new Set(priceHist.map((p) => p.prodcode)).size;
  const totalEntries = priceHist.length;
  const avgPrice =
    totalEntries > 0
      ? priceHist.reduce((sum, p) => sum + Number(p.unitprice || 0), 0) / totalEntries
      : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .ph-page {
          min-height: 100vh;
          background: #0a0f1e;
          padding: 32px;
          font-family: 'Inter', sans-serif;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .ph-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(6,182,212,.10), transparent 35%),
            radial-gradient(circle at bottom left, rgba(168,85,247,.08), transparent 35%);
          pointer-events: none;
        }

        .ph-header {
          position: relative;
          z-index: 2;
          margin-bottom: 26px;
        }

        .ph-title {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }

        .ph-sub {
          color: #64748b;
          font-size: 13px;
        }

        .stats-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 22px;
          padding: 22px;
          backdrop-filter: blur(12px);
          transition: .2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(6,182,212,.18);
        }

        .stat-label {
          color: #64748b;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .stat-cyan  { color: #22d3ee; }
        .stat-green { color: #4ade80; }

        .search-box {
          position: relative;
          z-index: 2;
          margin-bottom: 24px;
        }

        .search-box input {
          width: 100%;
          padding: 15px 18px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.04);
          color: white;
          outline: none;
          font-size: 14px;
          transition: .2s;
        }

        .search-box input:focus {
          border-color: rgba(6,182,212,.5);
          background: rgba(6,182,212,.05);
        }

        .search-box input::placeholder { color: #475569; }

        .error-box {
          position: relative;
          z-index: 2;
          padding: 12px 14px;
          border-radius: 14px;
          background: rgba(239,68,68,.08);
          border: 1px solid rgba(239,68,68,.18);
          color: #f87171;
          margin-bottom: 18px;
          font-size: 13px;
        }

        .table-card {
          position: relative;
          z-index: 2;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 22px;
          overflow: hidden;
          backdrop-filter: blur(12px);
        }

        table { width: 100%; border-collapse: collapse; }
        thead { background: rgba(255,255,255,.03); }

        th {
          text-align: left;
          padding: 18px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: #64748b;
          font-weight: 700;
        }

        td {
          padding: 18px;
          border-top: 1px solid rgba(255,255,255,.05);
          color: #e2e8f0;
          font-size: 14px;
        }

        tbody tr { transition: .2s; }
        tbody tr:hover { background: rgba(255,255,255,.03); }

        .mono { font-family: monospace; color: #22d3ee; }
        .product-name { font-weight: 600; color: white; }
        .unit  { color: #94a3b8; }
        .price { color: #4ade80; font-weight: 700; }
        .date  { color: #94a3b8; font-size: 13px; }

        .loading, .empty {
          padding: 70px 20px;
          text-align: center;
          color: #64748b;
        }

        .table-footer {
          padding: 16px 20px;
          border-top: 1px solid rgba(255,255,255,.05);
          background: rgba(255,255,255,.02);
          text-align: right;
          color: #64748b;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .ph-page    { padding: 20px; }
          .stats-grid { grid-template-columns: 1fr; }
          .table-card { overflow: auto; }
          table       { min-width: 600px; }
          .ph-title   { font-size: 28px; }
        }
      `}</style>

      <div className="ph-page">

        {/* HEADER */}
        <div className="ph-header">
          <h1 className="ph-title">Price History</h1>
          <p className="ph-sub">
            Read-only price history records from the pricehist table.
          </p>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Records</p>
            <h2 className="stat-value stat-cyan">{totalEntries}</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">Products with Price</p>
            <h2 className="stat-value stat-cyan">{uniqueProducts}</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">Average Price</p>
            <h2 className="stat-value stat-green">
              ₱{avgPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by product code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ERROR */}
        {error && <div className="error-box">{error}</div>}

        {/* TABLE */}
        {loading ? (
          <div className="table-card">
            <div className="loading">Loading price history...</div>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Effective Date</th>
                  <th>Prod Code</th>
                  <th>Description</th>
                  <th>Unit</th>
                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty">No records found.</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, idx) => (
                    <tr key={`${row.prodcode}-${row.effdate}-${idx}`}>
                      <td className="date">
                        {new Date(row.effdate).toLocaleDateString('en-PH', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td className="mono">{row.prodcode}</td>
                      <td className="product-name">
                        {row.product?.description || '—'}
                      </td>
                      <td className="unit">
                        {row.product?.unit || '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="price">
                          ₱{Number(row.unitprice).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {filtered.length > 0 && (
              <div className="table-footer">
                {filtered.length} record{filtered.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default PriceHistoryPage;