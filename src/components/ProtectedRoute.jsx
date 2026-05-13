import { Navigate } from 'react-router-dom';
// This will eventually use your AuthContext from M4
export const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};