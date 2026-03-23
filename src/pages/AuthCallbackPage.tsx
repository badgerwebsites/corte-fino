// pages/AuthCallbackPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { View } from '../ui/View';
import * as styles from '../styles/auth.css';

export default function AuthCallbackPage() {
  const { customer, loading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setExpired(true);
      return;
    }
    const next = searchParams.get('next');
    const pendingBooking = localStorage.getItem('pendingBooking');
    navigate(next ?? (pendingBooking ? '/book' : '/dashboard'), { replace: true });
  }, [customer, loading, user, navigate, searchParams]);

  if (expired) {
    return (
      <View className={styles.container}>
        <View className={styles.formCard}>
          <p className={styles.pageTitle}>Link Expired</p>
          <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: 24 }}>
            This confirmation link has expired or already been used. Please sign up again or request a new link.
          </p>
          <Link to="/signup" className={styles.submitButton} style={{ textAlign: 'center', textDecoration: 'none' }}>
            Back to Sign Up
          </Link>
        </View>
      </View>
    );
  }

  return <div style={{ minHeight: '100dvh', backgroundColor: '#101214' }} />;
}
