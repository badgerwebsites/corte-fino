// pages/DashboardRouter.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function DashboardRouter() {
  const { user, customer, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true });
      }
      return;
    }

    if (!customer) return;

    const targetRoute = customer.is_admin
      ? '/admin'
      : '/dashboard/customer';

    if (location.pathname !== targetRoute) {
      navigate(targetRoute, { replace: true });
    }
  }, [user, customer, loading, navigate, location.pathname]);

  return null;
}
