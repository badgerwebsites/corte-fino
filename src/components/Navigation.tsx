import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { View } from '../ui/View';
import * as styles from '../styles/navigation.css';

export function Navigation() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  return (
    <nav className={styles.nav}>
      <View className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          Corte Fino
        </Link>

        <View className={styles.navButtons}>
          {isAuthenticated ? (
            <Link to="/dashboard" className={styles.dashboardButton}>
              Dashboard
            </Link>
          ) : (
            <Link to="/auth" className={styles.signInButton}>
              Sign In
            </Link>
          )}
          <Link to="/book" className={styles.bookNowButton}>
            Book Now
          </Link>
        </View>
      </View>
    </nav>
  );
}
