import { useState, useEffect } from 'react';
import { reportsService } from '../services/reportsService';

function CustomerSalesSummaryPage() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setLoading(true);
    setError(null);

    const { data, error } =
      await reportsService.getCustomerSalesSummary();

    if (error)
      setError('Failed to load customer sales summary.');

    setSummary(data || []);
    setLoading(false);
  };

  const filtered = summary.filter(
    (c) =>
      c.custname
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      c.custno
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalRevenue = summary.reduce(
    (sum, c) => sum + Number(c.total_spend),
    0
  );

  const totalTransactions = summary.reduce(
    (sum, c) =>
      sum + Number(c.total_transactions),
    0
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *{
          box-sizing:border-box;
        }

        .sales-page{
          min-height:100vh;
          background:#0a0f1e;
          padding:32px;
          font-family:'Inter',sans-serif;
          color:white;
          position:relative;
          overflow:hidden;
        }

        .sales-page::before{
          content:'';
          position:fixed;
          inset:0;
          background:
            radial-gradient(circle at top right, rgba(59,130,246,.10), transparent 35%),
            radial-gradient(circle at bottom left, rgba(168,85,247,.08), transparent 35%);
          pointer-events:none;
        }

        .sales-header{
          position:relative;
          z-index:2;
          margin-bottom:26px;
        }

        .sales-title{
          font-size:34px;
          font-weight:800;
          letter-spacing:-0.03em;
          margin-bottom:6px;
        }

        .sales-sub{
          color:#64748b;
          font-size:13px;
        }

        .stats-grid{
          position:relative;
          z-index:2;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:18px;
          margin-bottom:24px;
        }

        .stat-card{
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.06);
          border-radius:22px;
          padding:22px;
          backdrop-filter:blur(12px);
          transition:.2s;
        }

        .stat-card:hover{
          transform:translateY(-2px);
          border-color:rgba(59,130,246,.18);
        }

        .stat-label{
          color:#64748b;
          font-size:11px;
          text-transform:uppercase;
          letter-spacing:.08em;
          font-weight:700;
          margin-bottom:10px;
        }

        .stat-value{
          font-size:32px;
          font-weight:800;
          color:white;
          letter-spacing:-0.03em;
        }

        .stat-blue{
          color:#60a5fa;
        }

        .stat-green{
          color:#4ade80;
        }

        .search-box{
          position:relative;
          z-index:2;
          margin-bottom:24px;
        }

        .search-box input{
          width:100%;
          padding:15px 18px;
          border-radius:16px;
          border:1px solid rgba(255,255,255,.08);
          background:rgba(255,255,255,.04);
          color:white;
          outline:none;
          font-size:14px;
          transition:.2s;
        }

        .search-box input:focus{
          border-color:rgba(59,130,246,.5);
          background:rgba(59,130,246,.05);
        }

        .search-box input::placeholder{
          color:#475569;
        }

        .error-box{
          position:relative;
          z-index:2;
          padding:12px 14px;
          border-radius:14px;
          background:rgba(239,68,68,.08);
          border:1px solid rgba(239,68,68,.18);
          color:#f87171;
          margin-bottom:18px;
          font-size:13px;
        }

        .table-card{
          position:relative;
          z-index:2;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.06);
          border-radius:22px;
          overflow:hidden;
          backdrop-filter:blur(12px);
        }

        table{
          width:100%;
          border-collapse:collapse;
        }

        thead{
          background:rgba(255,255,255,.03);
        }

        th{
          text-align:left;
          padding:18px;
          font-size:12px;
          text-transform:uppercase;
          letter-spacing:.08em;
          color:#64748b;
          font-weight:700;
        }

        td{
          padding:18px;
          border-top:1px solid rgba(255,255,255,.05);
          color:#e2e8f0;
          font-size:14px;
        }

        tbody tr{
          transition:.2s;
        }

        tbody tr:hover{
          background:rgba(255,255,255,.03);
        }

        .mono{
          font-family:monospace;
          color:#cbd5e1;
        }

        .rank{
          color:#64748b;
        }

        .customer-name{
          font-weight:600;
          color:white;
        }

        .money{
          color:#4ade80;
          font-weight:700;
        }

        .date{
          color:#94a3b8;
        }

        .loading,
        .empty{
          padding:70px 20px;
          text-align:center;
          color:#64748b;
        }

        .table-footer{
          padding:16px 20px;
          border-top:1px solid rgba(255,255,255,.05);
          background:rgba(255,255,255,.02);
          text-align:right;
          color:#64748b;
          font-size:13px;
        }

        @media(max-width:900px){
          .sales-page{
            padding:20px;
          }

          .stats-grid{
            grid-template-columns:1fr;
          }

          .table-card{
            overflow:auto;
          }

          table{
            min-width:900px;
          }

          .sales-title{
            font-size:28px;
          }
        }
      `}</style>

      <div className="sales-page">
        {/* HEADER */}
        <div className="sales-header">
          <h1 className="sales-title">
            Customer Sales Summary
          </h1>

          <p className="sales-sub">
            Read-only analytics dashboard ranked by
            total customer spend.
          </p>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">
              Total Customers
            </p>

            <h2 className="stat-value stat-blue">
              {summary.length}
            </h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">
              Total Transactions
            </p>

            <h2 className="stat-value stat-blue">
              {totalTransactions}
            </h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">
              Total Revenue
            </p>

            <h2 className="stat-value stat-green">
              $
              {totalRevenue.toLocaleString(
                'en-US',
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }
              )}
            </h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search customer name or customer number..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* TABLE */}
        {loading ? (
          <div className="table-card">
            <div className="loading">
              Loading customer sales summary...
            </div>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Cust No</th>
                  <th>Customer Name</th>
                  <th style={{ textAlign: 'right' }}>
                    Transactions
                  </th>
                  <th style={{ textAlign: 'right' }}>
                    Total Spend
                  </th>
                  <th>Last Sale</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty">
                        No customer sales data found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((row, idx) => (
                    <tr key={row.custno}>
                      <td className="mono rank">
                        #{idx + 1}
                      </td>

                      <td className="mono">
                        {row.custno}
                      </td>

                      <td className="customer-name">
                        {row.custname}
                      </td>

                      <td
                        style={{
                          textAlign: 'right'
                        }}
                      >
                        {row.total_transactions}
                      </td>

                      <td
                        className="money"
                        style={{
                          textAlign: 'right'
                        }}
                      >
                        $
                        {Number(
                          row.total_spend
                        ).toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </td>

                      <td className="date">
                        {row.last_sale_date ?? '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {filtered.length > 0 && (
              <div className="table-footer">
                {filtered.length} customer
                {filtered.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default CustomerSalesSummaryPage;