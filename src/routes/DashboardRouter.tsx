import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function DashboardRouter() {
  const { user, customer, loading } = useAuth();

  if (loading) {
    return null; // or a spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Admins go to admin dashboard
  if (customer?.is_admin) {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Everyone else gets normal dashboard
  return <Navigate to="/dashboard/home" replace />;
}
