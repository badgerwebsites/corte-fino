// pages/LoginPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const [carouselLogos, setCarouselLogos] = useState<string[]>([]);

  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    new URLSearchParams(location.search).get('redirect') || '/dashboard';

  useEffect(() => {
    if (!authLoading && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, authLoading, navigate, redirectTo]);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('nav_logo_1_url, nav_logo_2_url, nav_logo_3_url')
      .single()
      .then(({ data }) => {
        if (!data) return;
        const logos = [data.nav_logo_1_url, data.nav_logo_2_url, data.nav_logo_3_url]
          .filter((url): url is string => !!url && url !== 'HIDDEN');
        setCarouselLogos(logos);
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
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(redirectTo, { replace: true });
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />

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
          ) : (
            <Text className={styles.pageTitle}>Login</Text>
          )}
        </View>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <View className={styles.error}>
                <Text>{error}</Text>
              </View>
            )}

            <View className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Email"
                required
              />
            </View>

            <View className={styles.inputGroup}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Password"
                required
              />
            </View>

            {/* <View> */}
              <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                Forgot password?
              </Link>
            {/* </View> */}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <View className={styles.footer}>

            <View>
              <Text className={styles.footerText}>
                Don&apos;t have an account?
              </Text>
            </View>

            <View>
              <Link
                to={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
                className={styles.link}
              >
                Sign Up
              </Link>
            </View>
          </View>

        </View>
      </View>
    </>
  );
}
