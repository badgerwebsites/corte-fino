import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function DashboardRouter() {
  const { user, customer, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (!customer) {
        return;
      }

    if (customer?.is_admin) {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard/customer', { replace: true });
    }
  }, [user, customer, loading, navigate]);

  return null; // no UI, just routing
}
