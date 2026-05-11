import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRights } from '../context/UserRightsContext';
import { customerService } from '../services/customerService';

function CustomerListPage() {
  const { currentUser } = useAuth();
  const { rights, userType } = useRights();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    custno: '',
    custname: '',
    address: '',
    payterm: 'COD'
  });
  const [addError, setAddError] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [editError, setEditError] = useState(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, [userType]);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await customerService.getCustomers(userType);

    if (error) setError('Failed to load customers.');

    setCustomers(data || []);
    setLoading(false);
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setAddError(null);

    const { error } = await customerService.addCustomer(
      newCustomer,
      currentUser.id
    );

    if (error) {
      setAddError(error.message);
      return;
    }

    setShowAddModal(false);

    setNewCustomer({
      custno: '',
      custname: '',
      address: '',
      payterm: 'COD'
    });

    loadCustomers();
  };

  const openEditModal = (customer) => {
    setEditCustomer({ ...customer });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditCustomer = async (e) => {
    e.preventDefault();

    setEditError(null);

    const { custno, custname, address, payterm } = editCustomer;

    const { error } = await customerService.updateCustomer(
      custno,
      { custname, address, payterm },
      currentUser.id
    );

    if (error) {
      setEditError(error.message);
      return;
    }

    setShowEditModal(false);
    setEditCustomer(null);

    loadCustomers();
  };


  const openDeleteDialog = (customer) => {
    setDeleteTarget(customer);
    setDeleteError(null);
    setShowDeleteDialog(true);
  };

  const handleSoftDelete = async () => {
    setDeleteError(null);

    const { error } = await customerService.softDeleteCustomer(
      deleteTarget.custno,
      currentUser.id
    );

    if (error) {
      setDeleteError(error.message);
      return;
    }

    setShowDeleteDialog(false);
    setDeleteTarget(null);

    loadCustomers();
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.custname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.custno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const counterClass = (val, max) =>
    `text-xs text-right mt-1 ${
      val.length >= max
        ? 'text-red-400 font-semibold'
        : 'text-slate-500'
    }`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *{
          box-sizing:border-box;
        }

        .cust-page{
          min-height:100vh;
          background:#0a0f1e;
          font-family:'Inter',sans-serif;
          color:white;
          padding:32px;
          position:relative;
          overflow:hidden;
        }

        .cust-page::before{
          content:'';
          position:fixed;
          inset:0;
          background:
            radial-gradient(circle at top right, rgba(59,130,246,0.10), transparent 35%),
            radial-gradient(circle at bottom left, rgba(168,85,247,0.08), transparent 35%);
          pointer-events:none;
        }

        .cust-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:16px;
          margin-bottom:24px;
          position:relative;
          z-index:2;
        }

        .cust-title{
          font-size:32px;
          font-weight:800;
          letter-spacing:-0.03em;
        }

        .cust-sub{
          color:#64748b;
          font-size:13px;
          margin-top:4px;
        }

        .cust-btn{
          border:none;
          cursor:pointer;
          border-radius:14px;
          padding:13px 20px;
          font-weight:600;
          font-size:14px;
          color:white;
          background:linear-gradient(135deg,#3b82f6,#1d4ed8);
          box-shadow:0 4px 24px rgba(59,130,246,.35);
          transition:.2s;
        }

        .cust-btn:hover{
          transform:translateY(-1px);
          box-shadow:0 4px 30px rgba(59,130,246,.55);
        }

        .cust-search{
          position:relative;
          z-index:2;
          margin-bottom:24px;
        }

        .cust-search input{
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

        .cust-search input:focus{
          border-color:rgba(59,130,246,.5);
          background:rgba(59,130,246,.05);
        }

        .cust-search input::placeholder{
          color:#475569;
        }

        .cust-card{
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

        .cust-link{
          color:#60a5fa;
          text-decoration:none;
          font-weight:600;
        }

        .cust-link:hover{
          text-decoration:underline;
        }

        .status-active{
          background:rgba(34,197,94,.12);
          border:1px solid rgba(34,197,94,.2);
          color:#4ade80;
        }

        .status-inactive{
          background:rgba(239,68,68,.12);
          border:1px solid rgba(239,68,68,.2);
          color:#f87171;
        }

        .status-pill{
          display:inline-flex;
          align-items:center;
          padding:6px 12px;
          border-radius:999px;
          font-size:12px;
          font-weight:700;
        }

        .action-btn{
          background:none;
          border:none;
          cursor:pointer;
          font-size:13px;
          font-weight:600;
          transition:.2s;
        }

        .edit-btn{
          color:#60a5fa;
        }

        .delete-btn{
          color:#f87171;
        }

        .action-btn:hover{
          opacity:.8;
        }

        .modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.65);
          display:flex;
          justify-content:center;
          align-items:center;
          z-index:100;
          padding:20px;
          backdrop-filter:blur(5px);
        }

        .modal-card{
          width:100%;
          max-width:460px;
          background:#0f172a;
          border:1px solid rgba(255,255,255,.08);
          border-radius:24px;
          padding:28px;
          color:white;
          animation:fadeIn .2s ease;
        }

        @keyframes fadeIn{
          from{
            opacity:0;
            transform:translateY(10px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        .modal-title{
          font-size:24px;
          font-weight:800;
          margin-bottom:6px;
          letter-spacing:-0.02em;
        }

        .modal-sub{
          color:#64748b;
          font-size:13px;
          margin-bottom:22px;
        }

        .field{
          margin-bottom:16px;
        }

        .field label{
          display:block;
          margin-bottom:7px;
          font-size:11px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:.08em;
          color:#64748b;
        }

        .field input,
        .field select{
          width:100%;
          padding:14px 16px;
          border-radius:14px;
          border:1px solid rgba(255,255,255,.08);
          background:rgba(255,255,255,.04);
          color:white;
          outline:none;
          font-size:14px;
          transition:.2s;
        }

        .field input:focus,
        .field select:focus{
          border-color:rgba(59,130,246,.5);
          background:rgba(59,130,246,.05);
        }

        .modal-actions{
          display:flex;
          gap:12px;
          margin-top:22px;
        }

        .cancel-btn{
          flex:1;
          padding:13px;
          border-radius:14px;
          border:1px solid rgba(255,255,255,.08);
          background:rgba(255,255,255,.03);
          color:#cbd5e1;
          cursor:pointer;
          font-weight:600;
        }

        .save-btn{
          flex:1;
          padding:13px;
          border:none;
          border-radius:14px;
          background:linear-gradient(135deg,#3b82f6,#1d4ed8);
          color:white;
          cursor:pointer;
          font-weight:700;
        }

        .danger-btn{
          flex:1;
          padding:13px;
          border:none;
          border-radius:14px;
          background:linear-gradient(135deg,#ef4444,#dc2626);
          color:white;
          cursor:pointer;
          font-weight:700;
        }

        .error-box{
          padding:12px 14px;
          border-radius:12px;
          background:rgba(239,68,68,.08);
          border:1px solid rgba(239,68,68,.18);
          color:#f87171;
          font-size:13px;
          margin-bottom:16px;
        }

        .empty{
          padding:60px 20px;
          text-align:center;
          color:#64748b;
        }

        @media(max-width:900px){
          .cust-page{
            padding:20px;
          }

          .cust-header{
            flex-direction:column;
            align-items:flex-start;
          }

          .cust-card{
            overflow:auto;
          }

          table{
            min-width:900px;
          }
        }
      `}</style>

      <div className="cust-page">
        <div className="cust-header">
          <div>
            <h1 className="cust-title">Customers</h1>
            <p className="cust-sub">
              Manage customer records, payment terms, and account status.
            </p>
          </div>

          {rights.CUST_ADD === 1 && (
            <button
              onClick={() => {
                setShowAddModal(true);
                setAddError(null);
              }}
              className="cust-btn"
            >
              + Add New Customer
            </button>
          )}
        </div>

        <div className="cust-search">
          <input
            type="text"
            placeholder="Search customer name or customer number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && <div className="error-box">{error}</div>}

        {/* TABLE */}
        {loading ? (
          <div className="cust-card">
            <div className="empty">Loading customers...</div>
          </div>
        ) : (
          <div className="cust-card">
            <table>
              <thead>
                <tr>
                  <th>Cust No</th>
                  <th>Customer Name</th>
                  <th>Address</th>
                  <th>Pay Term</th>
                  <th>Status</th>

                  {userType !== 'USER' && <th>Stamp</th>}

                  {(rights.CUST_EDIT === 1 ||
                    rights.CUST_DEL === 1) && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <div className="empty">
                        No customers found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.custno}>
                      <td
                        style={{
                          fontFamily: 'monospace',
                          color: '#cbd5e1'
                        }}
                      >
                        {customer.custno}
                      </td>

                      <td>
                        <Link
                          to={`/customers/${customer.custno}`}
                          className="cust-link"
                        >
                          {customer.custname}
                        </Link>
                      </td>

                      <td>{customer.address}</td>

                      <td>{customer.payterm}</td>

                      <td>
                        <span
                          className={`status-pill ${
                            customer.record_status === 'ACTIVE'
                              ? 'status-active'
                              : 'status-inactive'
                          }`}
                        >
                          {customer.record_status}
                        </span>
                      </td>

                      {userType !== 'USER' && (
                        <td
                          style={{
                            color: '#64748b',
                            fontSize: '12px'
                          }}
                        >
                          {customer.stamp}
                        </td>
                      )}

                      {(rights.CUST_EDIT === 1 ||
                        rights.CUST_DEL === 1) && (
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              gap: 16
                            }}
                          >
                            {rights.CUST_EDIT === 1 && (
                              <button
                                onClick={() =>
                                  openEditModal(customer)
                                }
                                className="action-btn edit-btn"
                              >
                                Edit
                              </button>
                            )}

                            {rights.CUST_DEL === 1 &&
                              customer.record_status ===
                                'ACTIVE' && (
                                <button
                                  onClick={() =>
                                    openDeleteDialog(customer)
                                  }
                                  className="action-btn delete-btn"
                                >
                                  Delete
                                </button>
                              )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ADD MODAL */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2 className="modal-title">
                Add New Customer
              </h2>

              <p className="modal-sub">
                Fill in the customer details below.
              </p>

              {addError && (
                <div className="error-box">
                  {addError}
                </div>
              )}

              <form onSubmit={handleAddCustomer}>
                <div className="field">
                  <label>Customer No</label>

                  <input
                    type="text"
                    placeholder="C0001"
                    maxLength={5}
                    value={newCustomer.custno}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        custno: e.target.value
                      })
                    }
                    required
                  />

                  <p
                    className={counterClass(
                      newCustomer.custno,
                      5
                    )}
                  >
                    {newCustomer.custno.length}/5
                  </p>
                </div>

                <div className="field">
                  <label>Customer Name</label>

                  <input
                    type="text"
                    placeholder="Customer Name"
                    maxLength={20}
                    value={newCustomer.custname}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        custname: e.target.value
                      })
                    }
                    required
                  />

                  <p
                    className={counterClass(
                      newCustomer.custname,
                      20
                    )}
                  >
                    {newCustomer.custname.length}/20
                  </p>
                </div>

                <div className="field">
                  <label>Address</label>

                  <input
                    type="text"
                    placeholder="Customer Address"
                    maxLength={50}
                    value={newCustomer.address}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: e.target.value
                      })
                    }
                    required
                  />

                  <p
                    className={counterClass(
                      newCustomer.address,
                      50
                    )}
                  >
                    {newCustomer.address.length}/50
                  </p>
                </div>

                <div className="field">
                  <label>Payment Term</label>

                  <select
                    value={newCustomer.payterm}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        payterm: e.target.value
                      })
                    }
                  >
                    <option value="COD">COD</option>
                    <option value="30D">30D</option>
                    <option value="45D">45D</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      setShowAddModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                  >
                    Add Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEditModal && editCustomer && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2 className="modal-title">
                Edit Customer
              </h2>

              <p className="modal-sub">
                Customer No: {editCustomer.custno}
              </p>

              {editError && (
                <div className="error-box">
                  {editError}
                </div>
              )}

              <form onSubmit={handleEditCustomer}>
                <div className="field">
                  <label>Customer Name</label>

                  <input
                    type="text"
                    maxLength={20}
                    value={editCustomer.custname}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        custname: e.target.value
                      })
                    }
                    required
                  />

                  <p
                    className={counterClass(
                      editCustomer.custname,
                      20
                    )}
                  >
                    {editCustomer.custname.length}/20
                  </p>
                </div>

                <div className="field">
                  <label>Address</label>

                  <input
                    type="text"
                    maxLength={50}
                    value={editCustomer.address}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        address: e.target.value
                      })
                    }
                    required
                  />

                  <p
                    className={counterClass(
                      editCustomer.address,
                      50
                    )}
                  >
                    {editCustomer.address.length}/50
                  </p>
                </div>

                <div className="field">
                  <label>Payment Term</label>

                  <select
                    value={editCustomer.payterm}
                    onChange={(e) =>
                      setEditCustomer({
                        ...editCustomer,
                        payterm: e.target.value
                      })
                    }
                  >
                    <option value="COD">COD</option>
                    <option value="30D">30D</option>
                    <option value="45D">45D</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      setShowEditModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {showDeleteDialog && deleteTarget && (
          <div className="modal-overlay">
            <div
              className="modal-card"
              style={{ maxWidth: 420 }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  margin: '0 auto 18px',
                  borderRadius: 20,
                  background:
                    'rgba(239,68,68,.10)',
                  border:
                    '1px solid rgba(239,68,68,.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34
                }}
              >
                ⚠️
              </div>

              <h2
                className="modal-title"
                style={{ textAlign: 'center' }}
              >
                Deactivate Customer?
              </h2>

              <p
                style={{
                  color: '#64748b',
                  textAlign: 'center',
                  fontSize: 14,
                  marginBottom: 24,
                  lineHeight: 1.7
                }}
              >
                This customer will become inactive and
                hidden from regular users.
              </p>

              <div
                style={{
                  background:
                    'rgba(255,255,255,.03)',
                  border:
                    '1px solid rgba(255,255,255,.06)',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20
                }}
              >
                <div
                  style={{
                    color: '#64748b',
                    fontSize: 12,
                    marginBottom: 4
                  }}
                >
                  Customer
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    color: 'white'
                  }}
                >
                  {deleteTarget.custno} —{' '}
                  {deleteTarget.custname}
                </div>
              </div>

              {deleteError && (
                <div className="error-box">
                  {deleteError}
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() =>
                    setShowDeleteDialog(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="danger-btn"
                  onClick={handleSoftDelete}
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CustomerListPage;