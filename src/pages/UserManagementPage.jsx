import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';

function UserManagementPage() {
  const { currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Confirm dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await adminService.getUsers();

    if (error) setError('Failed to load users.');

    setUsers(data || []);
    setLoading(false);
  };

  const openDialog = (type, user, newType = null) => {
    setDialogAction({ type, user, newType });
    setActionError(null);
    setShowDialog(true);
  };

  const handleConfirm = async () => {
    setProcessing(true);
    setActionError(null);

    const { type, user, newType } = dialogAction;

    let result;

    if (type === 'activate') {
      result = await adminService.activateUser(user.userid);
    } else if (type === 'deactivate') {
      result = await adminService.deactivateUser(user.userid);
    } else if (type === 'changeType') {
      result = await adminService.changeUserType(
        user.userid,
        newType
      );
    }

    if (result.error) {
      setActionError(result.error.message);
      setProcessing(false);
      return;
    }

    setShowDialog(false);
    setDialogAction(null);
    setProcessing(false);

    loadUsers();
  };

  const isSuperAdmin = (user) =>
    user.user_type === 'SUPERADMIN';

  const isCurrentUser = (user) =>
    user.userid === currentUser?.id;

  const filteredUsers = users.filter(
    (u) =>
      u.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      u.user_type
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const dialogLabels = {
    activate: {
      title: 'Activate User?',
      btn: 'Activate',
      color: 'green'
    },
    deactivate: {
      title: 'Deactivate User?',
      btn: 'Deactivate',
      color: 'red'
    },
    changeType: {
      title: 'Change User Type?',
      btn: 'Confirm',
      color: 'blue'
    }
  };

  const activeUsers = users.filter(
    (u) => u.record_status === 'ACTIVE'
  ).length;

  const adminUsers = users.filter(
    (u) =>
      u.user_type === 'ADMIN' ||
      u.user_type === 'SUPERADMIN'
  ).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *{
          box-sizing:border-box;
        }

        .users-page{
          min-height:100vh;
          background:#0a0f1e;
          padding:32px;
          font-family:'Inter',sans-serif;
          color:white;
          position:relative;
          overflow:hidden;
        }

        .users-page::before{
          content:'';
          position:fixed;
          inset:0;
          background:
            radial-gradient(circle at top right, rgba(59,130,246,.10), transparent 35%),
            radial-gradient(circle at bottom left, rgba(168,85,247,.08), transparent 35%);
          pointer-events:none;
        }

        .page-header{
          position:relative;
          z-index:2;
          margin-bottom:26px;
        }

        .page-title{
          font-size:34px;
          font-weight:800;
          letter-spacing:-0.03em;
          margin-bottom:6px;
        }

        .page-sub{
          color:#64748b;
          font-size:13px;
          max-width:700px;
          line-height:1.7;
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
          letter-spacing:-0.03em;
        }

        .blue{
          color:#60a5fa;
        }

        .green{
          color:#4ade80;
        }

        .purple{
          color:#c084fc;
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

        .locked-row{
          opacity:.65;
          background:rgba(255,255,255,.02);
        }

        .badge{
          padding:6px 12px;
          border-radius:999px;
          font-size:11px;
          font-weight:700;
          letter-spacing:.03em;
          display:inline-flex;
          align-items:center;
          gap:6px;
        }

        .badge-blue{
          background:rgba(59,130,246,.12);
          color:#60a5fa;
          border:1px solid rgba(59,130,246,.18);
        }

        .badge-green{
          background:rgba(34,197,94,.12);
          color:#4ade80;
          border:1px solid rgba(34,197,94,.18);
        }

        .badge-red{
          background:rgba(239,68,68,.12);
          color:#f87171;
          border:1px solid rgba(239,68,68,.18);
        }

        .badge-purple{
          background:rgba(168,85,247,.12);
          color:#c084fc;
          border:1px solid rgba(168,85,247,.18);
        }

        .badge-gray{
          background:rgba(255,255,255,.06);
          color:#cbd5e1;
          border:1px solid rgba(255,255,255,.08);
        }

        .mini-badge{
          padding:4px 8px;
          border-radius:999px;
          font-size:10px;
          font-weight:700;
        }

        .you{
          background:rgba(59,130,246,.15);
          color:#60a5fa;
        }

        .protected{
          background:rgba(168,85,247,.15);
          color:#c084fc;
        }

        .user-wrap{
          display:flex;
          align-items:center;
          gap:8px;
          flex-wrap:wrap;
        }

        .action-btn{
          border:none;
          cursor:pointer;
          font-size:13px;
          font-weight:600;
          background:none;
          transition:.2s;
        }

        .btn-red{
          color:#f87171;
        }

        .btn-green{
          color:#4ade80;
        }

        .action-btn:hover{
          opacity:.8;
        }

        .select-role{
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);
          color:white;
          padding:10px 12px;
          border-radius:12px;
          outline:none;
          font-size:13px;
        }

        .select-role option{
          background:#111827;
        }

        .muted{
          color:#64748b;
          font-size:12px;
          font-style:italic;
        }

        .table-footer{
          padding:16px 20px;
          border-top:1px solid rgba(255,255,255,.05);
          background:rgba(255,255,255,.02);
          text-align:right;
          color:#64748b;
          font-size:13px;
        }

        .loading,
        .empty{
          padding:70px 20px;
          text-align:center;
          color:#64748b;
        }

        .modal-overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.65);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:1000;
          backdrop-filter:blur(4px);
        }

        .modal-card{
          width:100%;
          max-width:420px;
          background:#111827;
          border:1px solid rgba(255,255,255,.08);
          border-radius:24px;
          padding:30px;
          color:white;
          box-shadow:0 20px 60px rgba(0,0,0,.4);
        }

        .modal-title{
          font-size:24px;
          font-weight:800;
          margin-bottom:8px;
        }

        .modal-sub{
          color:#94a3b8;
          font-size:14px;
          margin-bottom:6px;
        }

        .modal-user{
          font-size:20px;
          font-weight:700;
          margin-bottom:18px;
        }

        .modal-error{
          padding:12px;
          border-radius:12px;
          background:rgba(239,68,68,.08);
          border:1px solid rgba(239,68,68,.15);
          color:#f87171;
          font-size:13px;
          margin-bottom:18px;
        }

        .modal-actions{
          display:flex;
          gap:14px;
          margin-top:24px;
        }

        .modal-btn{
          flex:1;
          border:none;
          padding:14px;
          border-radius:14px;
          font-weight:700;
          cursor:pointer;
          transition:.2s;
        }

        .modal-cancel{
          background:rgba(255,255,255,.05);
          color:#e2e8f0;
          border:1px solid rgba(255,255,255,.08);
        }

        .modal-confirm{
          color:white;
        }

        .modal-confirm.blue{
          background:linear-gradient(135deg,#3b82f6,#2563eb);
        }

        .modal-confirm.red{
          background:linear-gradient(135deg,#ef4444,#dc2626);
        }

        .modal-confirm.green{
          background:linear-gradient(135deg,#22c55e,#16a34a);
        }

        .modal-btn:hover{
          transform:translateY(-1px);
        }

        .modal-btn:disabled{
          opacity:.6;
          cursor:not-allowed;
        }

        @media(max-width:1000px){
          .users-page{
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

          .page-title{
            font-size:28px;
          }
        }
      `}</style>

      <div className="users-page">
        {/* HEADER */}
        <div className="page-header">
          <h1 className="page-title">
            User Management
          </h1>

          <p className="page-sub">
            Manage user activation, permissions,
            and role assignments. SUPERADMIN
            accounts are protected from changes.
          </p>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">
              Total Users
            </p>

            <h2 className="stat-value blue">
              {users.length}
            </h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">
              Active Accounts
            </p>

            <h2 className="stat-value green">
              {activeUsers}
            </h2>
          </div>

          <div className="stat-card">
            <p className="stat-label">
              Admin Accounts
            </p>

            <h2 className="stat-value purple">
              {adminUsers}
            </h2>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by username or role..."
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

        {/* DIALOG */}
        {showDialog && dialogAction && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2 className="modal-title">
                {
                  dialogLabels[
                    dialogAction.type
                  ].title
                }
              </h2>

              <p className="modal-sub">
                User:
              </p>

              <p className="modal-user">
                {dialogAction.user.username}
              </p>

              {dialogAction.type ===
                'changeType' && (
                <p className="modal-sub">
                  {
                    dialogAction.user
                      .user_type
                  }{' '}
                  →{' '}
                  <strong>
                    {dialogAction.newType}
                  </strong>
                </p>
              )}

              {actionError && (
                <div className="modal-error">
                  {actionError}
                </div>
              )}

              <div className="modal-actions">
                <button
                  onClick={() =>
                    setShowDialog(false)
                  }
                  disabled={processing}
                  className="modal-btn modal-cancel"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={processing}
                  className={`modal-btn modal-confirm ${dialogLabels[dialogAction.type].color}`}
                >
                  {processing
                    ? 'Processing...'
                    : dialogLabels[
                        dialogAction.type
                      ].btn}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        {loading ? (
          <div className="table-card">
            <div className="loading">
              Loading users...
            </div>
          </div>
        ) : (
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>
                    Change Role
                  </th>
                  <th style={{ textAlign: 'center' }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty">
                        No users found.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const locked =
                      isSuperAdmin(user) ||
                      isCurrentUser(user);

                    return (
                      <tr
                        key={user.userid}
                        className={
                          locked
                            ? 'locked-row'
                            : ''
                        }
                      >
                        <td>
                          <div className="user-wrap">
                            <span>
                              {user.username}
                            </span>

                            {isCurrentUser(
                              user
                            ) && (
                              <span className="mini-badge you">
                                You
                              </span>
                            )}

                            {isSuperAdmin(
                              user
                            ) && (
                              <span className="mini-badge protected">
                                Protected
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              user.user_type ===
                              'SUPERADMIN'
                                ? 'badge-purple'
                                : user.user_type ===
                                  'ADMIN'
                                ? 'badge-blue'
                                : 'badge-gray'
                            }`}
                          >
                            {user.user_type}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              user.record_status ===
                              'ACTIVE'
                                ? 'badge-green'
                                : 'badge-red'
                            }`}
                          >
                            {
                              user.record_status
                            }
                          </span>
                        </td>

                        {/* CHANGE ROLE */}
                        <td
                          style={{
                            textAlign: 'center'
                          }}
                        >
                          {locked ? (
                            <span className="muted">
                              {isSuperAdmin(
                                user
                              )
                                ? 'Protected account'
                                : 'Current user'}
                            </span>
                          ) : (
                            <select
                              value={
                                user.user_type
                              }
                              onChange={(e) =>
                                openDialog(
                                  'changeType',
                                  user,
                                  e.target.value
                                )
                              }
                              className="select-role"
                            >
                              <option value="USER">
                                USER
                              </option>

                              <option value="ADMIN">
                                ADMIN
                              </option>
                            </select>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td
                          style={{
                            textAlign: 'center'
                          }}
                        >
                          {locked ? (
                            <span className="muted">
                              Restricted
                            </span>
                          ) : user.record_status ===
                            'ACTIVE' ? (
                            <button
                              onClick={() =>
                                openDialog(
                                  'deactivate',
                                  user
                                )
                              }
                              className="action-btn btn-red"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                openDialog(
                                  'activate',
                                  user
                                )
                              }
                              className="action-btn btn-green"
                            >
                              Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {filteredUsers.length > 0 && (
              <div className="table-footer">
                {filteredUsers.length} user
                {filteredUsers.length !== 1
                  ? 's'
                  : ''}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default UserManagementPage;