// components/Navigation.tsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { View } from '../ui/View';
import * as styles from '../styles/navigation.css';
import logo from '../assets/BlackLogo.svg';

export function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hideNav =
    location.pathname === '/login' ||
    location.pathname === '/signup';

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  if (hideNav) {
    return null;
  }

  return (
    <nav className={styles.nav}>
      <View className={styles.navContainer}>
        <View className={styles.logoLink}>
          <img
            src={logo}
            alt="Corte Fino"
            className={styles.logoImage}
          />
        </View>

        <View className={styles.navButtons}>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className={styles.loginButton}
            >
              Login
            </Link>
          )}
        </View>
      </View>
    </nav>
  );
}
