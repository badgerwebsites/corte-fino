import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navigation } from '../components/Navigation';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/auth.css';

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, firstName, lastName, phone);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <View className={styles.container}>
        <View className={styles.formCard}>
        <Text className={styles.title}>Create Account</Text>
        <Text className={styles.subtitle}>Join Corte Fino today</Text>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <View className={styles.error}>
              <Text>{error}</Text>
            </View>
          )}

          <View className={styles.inputRow}>
            <View className={styles.inputGroup}>
              <label htmlFor="firstName" className={styles.label}>First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={styles.input}
                required
              />
            </View>

            <View className={styles.inputGroup}>
              <label htmlFor="lastName" className={styles.label}>Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={styles.input}
                required
              />
            </View>
          </View>

          <View className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </View>

          <View className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
              placeholder="(555) 123-4567"
              required
            />
          </View>

          <View className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </View>

          <View className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
            />
          </View>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <View className={styles.footer}>
          <Text className={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>Sign in</Link>
          </Text>
        </View>

        <View className={styles.backLink}>
          <Link to="/" className={styles.link}>← Back to Home</Link>
        </View>
      </View>
    </View>
    </>
  );
}
