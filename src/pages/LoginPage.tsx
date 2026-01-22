import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navigation } from '../components/Navigation';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
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
        <Text className={styles.title}>Welcome Back</Text>
        <Text className={styles.subtitle}>Sign in to your account</Text>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <View className={styles.error}>
              <Text>{error}</Text>
            </View>
          )}

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

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <View className={styles.footer}>
          <Text className={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/signup" className={styles.link}>Sign up</Link>
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
