// components/Navigation.tsx
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { View } from '../ui/View';
import * as styles from '../styles/navigation.css';
import logo from '../assets/WhiteLogo.svg';

export function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const hideLoginButton =
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

  return (
    <nav className={styles.nav}>
      <View className={styles.navContainer}>
        <Link to="/" className={styles.logoLink}>
          <img
            src={logo}
            alt="Corte Fino"
            className={styles.logoImage}
          />
        </Link>

        <View className={styles.navButtons}>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className={styles.dashboardButton}
            >
              Dashboard
            </Link>
          ) : (
            !hideLoginButton && (
              <Link
                to="/login"
                className={styles.loginButton}
              >
                Login
              </Link>
            )
          )}

          <Link to="/book" className={styles.bookNowButton}>
            Book Now
          </Link>
        </View>
      </View>
    </nav>
  );
}
