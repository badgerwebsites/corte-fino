// pages/SignUpPage.tsx
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { Navigation } from '../components/Navigation';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/auth.css';
import logo from '../assets/BlackLogo.svg';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    new URLSearchParams(location.search).get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, firstName, lastName, phone);
      navigate(redirectTo);
    } catch {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />

      <View className={styles.container}>
        <View className={styles.formCard}>
          <Link to="/" className={styles.logoWrapper}>
          <img
            src={logo}
            alt="Corte Fino"
            className={styles.logo}
          />
        </Link>
          {/* <View className={styles.logoWrapper}>
            <img
              src={logo}
              alt="Corte Fino"
              className={styles.logo}
            />
          </View> */}

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
    </>
  );
}
