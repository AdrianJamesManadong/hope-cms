
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/customerService';

function DeletedCustomersPage() {
  const { currentUser } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Recover dialog
  const [showRecoverDialog, setShowRecoverDialog] = useState(false);
  const [recoverTarget, setRecoverTarget] = useState(null);
  const [recoverError, setRecoverError] = useState(null);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    loadDeletedCustomers();
  }, []);

  const loadDeletedCustomers = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await customerService.getCustomers('ADMIN');

    if (error) {
      setError('Failed to load customers.');
      setLoading(false);
      return;
    }

    setCustomers((data || []).filter(c => c.record_status === 'INACTIVE'));
    setLoading(false);
  };

  const openRecoverDialog = (customer) => {
    setRecoverTarget(customer);
    setRecoverError(null);
    setShowRecoverDialog(true);
  };

  const handleRecover = async () => {
    setRecovering(true);
    setRecoverError(null);

    const { error } = await customerService.recoverCustomer(
      recoverTarget.custno,
      currentUser.id
    );

    if (error) {
      setRecoverError(error.message);
      setRecovering(false);
      return;
    }

    setShowRecoverDialog(false);
    setRecoverTarget(null);
    setRecovering(false);

    loadDeletedCustomers();
  };

  const filteredCustomers = customers.filter(c =>
    c.custname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.custno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        .deleted-page {
          min-height: 100vh;
          background: #0a0f1e;
          padding: 28px;
          color: white;
          position: relative;
        }

        .deleted-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 30%),
            radial-gradient(circle at bottom left, rgba(168,85,247,0.08), transparent 30%);
          pointer-events: none;
        }

        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(14px);
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        .glass-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: white;
          padding: 15px 18px;
          border-radius: 14px;
          outline: none;
          transition: 0.2s;
          font-size: 14px;
        }

        .glass-input:focus {
          border-color: rgba(59,130,246,0.5);
          background: rgba(59,130,246,0.05);
        }

        .glass-input::placeholder {
          color: #6b7280;
        }

        .table-row {
          transition: 0.2s;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .table-row:hover {
          background: rgba(255,255,255,0.03);
        }

        .dialog-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 20px;
        }

        .dialog-card {
          width: 100%;
          max-width: 420px;
          background: #0f172a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 32px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.45);
        }

        .btn {
          border: none;
          border-radius: 14px;
          padding: 13px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.04);
          color: #cbd5e1;
          border: 1px solid rgba(255,255,255,0.08);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.08);
        }

        .btn-success {
          background: linear-gradient(135deg, #22c55e, #15803d);
          color: white;
          box-shadow: 0 10px 30px rgba(34,197,94,0.25);
        }

        .btn-success:hover {
          transform: translateY(-1px);
        }

        .summary-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 22px;
        }

        .summary-number {
          font-size: 34px;
          font-weight: 800;
          color: white;
          margin-top: 8px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>

      <div className="deleted-page">
        {/* Header */}
        <div
          style={{
            marginBottom: 28,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 20,
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 14px',
                borderRadius: 999,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.15)',
                marginBottom: 16
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#ef4444'
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#fca5a5',
                  letterSpacing: '0.08em'
                }}
              >
                INACTIVE CUSTOMERS
              </span>
            </div>

            <h1
              style={{
                fontSize: 36,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: 10
              }}
            >
              Deleted Customers
            </h1>

            <p
              style={{
                color: '#6b7280',
                fontSize: 14,
                maxWidth: 580,
                lineHeight: 1.7
              }}
            >
              Recover inactive customer records and make them active again.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 18,
            marginBottom: 24,
            position: 'relative',
            zIndex: 1
          }}
        >
          <div className="summary-card">
            <p
              style={{
                fontSize: 12,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700
              }}
            >
              Inactive Customers
            </p>

            <div className="summary-number">
              {customers.length}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 24, position: 'relative', zIndex: 1 }}>
          <input
            type="text"
            placeholder="Search deleted customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input"
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginBottom: 20,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171',
              padding: '14px 18px',
              borderRadius: 14,
              position: 'relative',
              zIndex: 1
            }}
          >
            {error}
          </div>
        )}

        {/* Recover Dialog */}
        {showRecoverDialog && recoverTarget && (
          <div className="dialog-backdrop">
            <div className="dialog-card">
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  background: 'rgba(34,197,94,0.08)',
                  border: '1px solid rgba(34,197,94,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: 36
                }}
              >
                ♻️
              </div>

              <h2
                style={{
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 700,
                  marginBottom: 10
                }}
              >
                Recover Customer?
              </h2>

              <p
                style={{
                  color: '#6b7280',
                  fontSize: 14,
                  lineHeight: 1.7,
                  marginBottom: 22
                }}
              >
                This customer will become ACTIVE and visible to users again.
              </p>

              <div
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  marginBottom: 20
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: '#6b7280',
                    marginBottom: 6
                  }}
                >
                  CUSTOMER
                </div>

                <div
                  style={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 16
                  }}
                >
                  {recoverTarget.custno} — {recoverTarget.custname}
                </div>
              </div>

              {recoverError && (
                <div
                  style={{
                    marginBottom: 18,
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171',
                    padding: '12px 14px',
                    borderRadius: 12,
                    fontSize: 13
                  }}
                >
                  {recoverError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setShowRecoverDialog(false)}
                  disabled={recovering}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleRecover}
                  disabled={recovering}
                  className="btn btn-success"
                  style={{ flex: 1 }}
                >
                  {recovering ? 'Recovering...' : 'Recover'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div
            className="glass-card"
            style={{
              padding: 50,
              textAlign: 'center',
              color: '#6b7280'
            }}
          >
            Loading deleted customers...
          </div>
        ) : (
          <div className="glass-card">
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: 900
                }}
              >
                <thead
                  style={{
                    background: 'rgba(255,255,255,0.03)'
                  }}
                >
                  <tr>
                    <th className="p-5 text-left text-xs tracking-wider text-gray-400 uppercase">
                      Cust No
                    </th>

                    <th className="p-5 text-left text-xs tracking-wider text-gray-400 uppercase">
                      Customer Name
                    </th>

                    <th className="p-5 text-left text-xs tracking-wider text-gray-400 uppercase">
                      Address
                    </th>

                    <th className="p-5 text-left text-xs tracking-wider text-gray-400 uppercase">
                      Pay Term
                    </th>

                    <th className="p-5 text-left text-xs tracking-wider text-gray-400 uppercase">
                      Status
                    </th>

                    <th className="p-5 text-left text-xs tracking-wider text-gray-400 uppercase">
                      Stamp
                    </th>

                    <th className="p-5 text-center text-xs tracking-wider text-gray-400 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          padding: 60,
                          textAlign: 'center',
                          color: '#6b7280'
                        }}
                      >
                        No deleted customers found.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr
                        key={customer.custno}
                        className="table-row"
                      >
                        <td
                          style={{
                            padding: 20,
                            fontFamily: 'monospace',
                            color: '#cbd5e1',
                            fontSize: 13
                          }}
                        >
                          {customer.custno}
                        </td>

                        <td
                          style={{
                            padding: 20,
                            fontWeight: 600,
                            color: 'white',
                            fontSize: 14
                          }}
                        >
                          {customer.custname}
                        </td>

                        <td
                          style={{
                            padding: 20,
                            color: '#94a3b8',
                            fontSize: 14
                          }}
                        >
                          {customer.address}
                        </td>

                        <td
                          style={{
                            padding: 20,
                            color: '#cbd5e1',
                            fontSize: 14
                          }}
                        >
                          {customer.payterm}
                        </td>

                        <td style={{ padding: 20 }}>
                          <span className="status-badge">
                            INACTIVE
                          </span>
                        </td>

                        <td
                          style={{
                            padding: 20,
                            color: '#6b7280',
                            fontSize: 12,
                            maxWidth: 240
                          }}
                        >
                          {customer.stamp}
                        </td>

                        <td
                          style={{
                            padding: 20,
                            textAlign: 'center'
                          }}
                        >
                          <button
                            onClick={() => openRecoverDialog(customer)}
                            className="btn btn-success"
                            style={{
                              padding: '10px 18px',
                              fontSize: 13
                            }}
                          >
                            Recover
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredCustomers.length > 0 && (
              <div
                style={{
                  padding: '18px 22px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.02)',
                  color: '#6b7280',
                  fontSize: 13,
                  textAlign: 'right'
                }}
              >
                {filteredCustomers.length} inactive customer
                {filteredCustomers.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default DeletedCustomersPage;
