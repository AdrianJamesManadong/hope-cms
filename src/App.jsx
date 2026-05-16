import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useRights } from './context/UserRightsContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import AppShell from './components/AppShell';
import CustomerListPage from './pages/CustomerListPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import ProductCataloguePage from './pages/ProductCataloguePage';
import DeletedCustomersPage from './pages/DeletedCustomersPage';
import UserManagementPage from './pages/UserManagementPage';
import CustomerSalesSummaryPage from './pages/CustomerSalesSummaryPage';
import ProductRevenuePage from './pages/ProductRevenuePage';

const AdminRoute = ({ children }) => {
  const { userType } = useRights();
  if (!['ADMIN', 'SUPERADMIN'].includes(userType)) {
    return <Navigate to="/customers" replace />;
  }
  return children;
};

const SuperAdminRoute = ({ children }) => {
  const { userType } = useRights();
  if (userType !== 'SUPERADMIN') {
    return <Navigate to="/customers" replace />;
  }
  return children;
};

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading Hope CMS...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/customers" replace />} />
      <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/customers" replace />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes */}
      <Route element={currentUser ? <AppShell /> : <Navigate to="/login" replace />}>

        {/* All authenticated users */}
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/:custno" element={<CustomerDetailPage />} />
        <Route path="/sales" element={<CustomerSalesSummaryPage />} />
        <Route path="/products" element={<ProductCataloguePage />} />

        {/* ADMIN + SUPERADMIN only */}
        <Route path="/deleted-customers" element={
          <AdminRoute><DeletedCustomersPage /></AdminRoute>
        } />
        <Route path="/reports/products" element={
          <AdminRoute><ProductRevenuePage /></AdminRoute>
        } />

        {/* SUPERADMIN only */}
        <Route path="/admin" element={
          <SuperAdminRoute><UserManagementPage /></SuperAdminRoute>
        } />

      </Route>

      <Route path="/" element={<Navigate to={currentUser ? "/customers" : "/login"} replace />} />
    </Routes>
  );
}

export default App;