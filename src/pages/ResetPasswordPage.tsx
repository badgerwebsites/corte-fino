// pages/ResetPasswordPage.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/auth.css';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenHash, setTokenHash] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [logoIndex, setLogoIndex] = useState(0);
  const [carouselLogos, setCarouselLogos] = useState<string[]>([]);
  const [logosLoading, setLogosLoading] = useState(true);
  const confirmRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));

    const hash = searchParams.get('token_hash') || hashParams.get('token_hash');
    const type = searchParams.get('type') || hashParams.get('type');
    if (hash && type === 'recovery') {
      setTokenHash(hash);
    }

    supabase.auth.getUser().then(({ data, error }) => {
      setIsAuthenticated(!error && !!data?.user);
    });

    supabase
      .from('site_settings')
      .select('nav_logo_1_url, nav_logo_2_url, nav_logo_3_url')
      .single()
      .then(({ data }) => {
        if (data) {
          const logos = [data.nav_logo_1_url, data.nav_logo_2_url, data.nav_logo_3_url]
            .filter((url): url is string => !!url && url !== 'HIDDEN');
          setCarouselLogos(logos);
        }
        setLogosLoading(false);
      });
  }, []);

  useEffect(() => {
    if (carouselLogos.length <= 1) return;
    const INTERVAL_MS = 3000;
    const updateIndex = () => {
      setLogoIndex(Math.floor(Date.now() / INTERVAL_MS) % carouselLogos.length);
    };
    updateIndex();
    const interval = setInterval(updateIndex, 100);
    return () => clearInterval(interval);
  }, [carouselLogos.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isAuthenticated && !tokenHash) {
      setError('Invalid or expired reset link');
      return;
    }

    setLoading(true);
    try {
      if (!isAuthenticated && tokenHash) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        });
        if (verifyError) throw new Error('Session expired or invalid reset link');
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      navigate('/login', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('New password should be different')) {
        setError('Your new password must be different from the old one');
      } else {
        setError(message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View className={styles.container}>
        <View className={styles.formCard}>
          <View className={styles.logoWrapper}>
            {carouselLogos.length > 0 ? (
              <View className={styles.carouselContainer}>
                <View
                  className={styles.carouselTrack}
                  style={{ transform: `translateX(-${logoIndex * 100}%)` }}
                >
                  {carouselLogos.map((src, i) => (
                    <View key={i} className={styles.carouselSlide}>
                      <img src={src} alt={`Logo ${i + 1}`} className={styles.carouselLogoImage} />
                    </View>
                  ))}
                </View>
              </View>
            ) : !logosLoading ? (
              <Text className={styles.pageTitle}>Reset Password</Text>
            ) : null}
          </View>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <View className={styles.error}>
                <Text>{error}</Text>
              </View>
            )}

            <View className={styles.inputGroup}>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                placeholder="New Password"
                required
                onKeyDown={(e) => e.key === 'Enter' && confirmRef.current?.focus()}
              />
            </View>

            <View className={styles.inputGroup}>
              <input
                ref={confirmRef}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                placeholder="Confirm New Password"
                required
              />
            </View>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>

          <View className={styles.footer}>
            <Link to="/login" className={styles.link}>
              Back to Login
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}
