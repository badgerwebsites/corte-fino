// pages/AuthCallbackPage.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    // If the user cancelled Google OAuth, redirect back to login immediately
    if (searchParams.get('error')) {
      navigate('/login', { replace: true });
      return;
    }

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

    // Timeout fallback — if nothing resolves in 8 seconds, redirect to login
    const timeout = setTimeout(() => navigate('/login', { replace: true }), 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate, searchParams]);

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#101214', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#9ca3af', fontSize: 16 }}>Signing you in…</p>
    </div>
  );
}
