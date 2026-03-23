// pages/SignUpPage.tsx
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/auth.css';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const [carouselLogos, setCarouselLogos] = useState<string[]>([]);

  const { signUp } = useAuth();
  const location = useLocation();

  const redirectTo =
    new URLSearchParams(location.search).get('redirect') || '/login';

  // Check if user is coming from booking flow
  const isFromBooking = redirectTo.startsWith('/book');

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

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, firstName, lastName, phone, redirectTo);
      setShowEmailConfirmation(true);
    } catch (err) {
      if (err instanceof Error && err.message === 'EMAIL_ALREADY_IN_USE') {
        setError('An account with this email already exists. Please log in.');
      } else {
        setError('Failed to create account');
      }
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
              <Text className={styles.pageTitle}>Sign Up</Text>
            )}
          </View>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <View className={styles.error}>
                <Text>{error}</Text>
              </View>
            )}

            <View className={styles.inputRow}>
              <View className={styles.inputGroup}>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={styles.input}
                  placeholder="First Name"
                  required
                />
              </View>

              <View className={styles.inputGroup}>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={styles.input}
                  placeholder="Last Name"
                  required
                />
              </View>
            </View>

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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                placeholder="Phone Number"
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

            <View className={styles.inputGroup}>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={styles.input}
                placeholder="Confirm Password"
                required
              />
            </View>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>

          <View className={styles.footer}>
            <Text className={styles.footerText}>
              Already have an account?
            </Text>

            <Link
              to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className={styles.link}
            >
              Login
            </Link>
          </View>

        </View>
      </View>

      {showEmailConfirmation && (
        <View className={styles.modalOverlay}>
          <View className={styles.modal}>
            <button
              onClick={() => setShowEmailConfirmation(false)}
              className={styles.modalCloseButton}
              aria-label="Close"
            >
              ✕
            </button>
            <View className={styles.modalIcon}>
              <svg
                className={styles.modalIconSvg}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </View>
            {/* <Text className={styles.modalTitle}>Check your Email for confirmation link</Text> */}
            <Text className={styles.modalMessage}>
              Check <strong>{email}</strong> for a confirmation link.
              {isFromBooking
                ? ' Click the link in the email to verify your account and complete your booking.'
                : ' Click the link in the email to verify your account.'}
            </Text>
            {/* <button
              className={styles.modalButton}
              onClick={() => setShowEmailConfirmation(false)}
            >
              Got it
            </button> */}
          </View>
        </View>
      )}
    </>
  );
}
