// pages/ForgotPasswordPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/auth.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [logoIndex, setLogoIndex] = useState(0);
  const [carouselLogos, setCarouselLogos] = useState<string[]>([]);

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
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { data: emailExists, error: rpcError } = await supabase
        .rpc('check_email_exists', { email_to_check: email.trim() });

      if (rpcError) throw rpcError;

      if (!emailExists) {
        setError('No account found with that email address.');
        return;
      }

      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `https://jstudiosbarbers.com/reset-password`,
      });

      if (supabaseError) throw supabaseError;

      setMessage('Check your email for a password reset link');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email');
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
            ) : (
              <Text className={styles.pageTitle}>Forgot Password</Text>
            )}
          </View>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <View className={styles.error}>
                <Text>{error}</Text>
              </View>
            )}
            {message && (
              <View className={styles.success}>
                <Text>{message}</Text>
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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
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
