// pages/AuthCallbackPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { View } from '../ui/View';
import * as styles from '../styles/auth.css';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const next = searchParams.get('next');
    const pendingBooking = localStorage.getItem('pendingBooking');
    const destination = next ?? (pendingBooking ? '/book' : '/dashboard');

    // Listen for the SIGNED_IN event — fires once the PKCE code is exchanged
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate(destination, { replace: true });
      }
    });

    // Also check if a session already exists (returning user who lands here again)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate(destination, { replace: true });
      }
    });

    // Timeout fallback — if nothing resolves in 8 seconds, show expired state
    const timeout = setTimeout(() => setExpired(true), 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate, searchParams]);

  if (expired) {
    return (
      <View className={styles.container}>
        <View className={styles.formCard}>
          <p className={styles.pageTitle}>Link Expired</p>
          <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: 24 }}>
            This confirmation link has expired or already been used. Please sign up again to get a new link.
          </p>
          <Link to="/signup" className={styles.submitButton} style={{ textAlign: 'center', textDecoration: 'none' }}>
            Back to Sign Up
          </Link>
        </View>
      </View>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#101214', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#9ca3af', fontSize: 16 }}>Confirming your email…</p>
    </div>
  );
}
