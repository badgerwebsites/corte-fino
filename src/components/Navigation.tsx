// components/Navigation.tsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { View } from '../ui/View';
import * as styles from '../styles/navigation.css';
import logo from '../assets/BlackLogo.svg';
import logo2 from '../assets/jstudios.svg';

const logos = [logo, logo2];

export function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    window.matchMedia('(min-width: 768px)').matches
  );

  const [logoIndex, setLogoIndex] = useState(0);

    useEffect(() => {
    const interval = setInterval(() => {
      setLogoIndex((prev) => (prev + 1) % logos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);


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

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const handler = () => setIsDesktop(media.matches);

    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
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
        <Link to="/" className={styles.logoLink}>
          <img
            src={logos[logoIndex]}
            alt="Corte Fino"
            className={styles.logoImage}
          />
        </Link>

        {/* <View className={styles.navButtons}>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Logout
            </button>
          ) : isDesktop ? (
            <a
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.loginButton}
            >
              Login
            </a>
          ) : (
            <Link
              to="/login"
              className={styles.loginButton}
            >
              Login
            </Link>
          )}
        </View> */}
        <View className={styles.navButtons}>
          {isAuthenticated ? (
            location.pathname === '/' ? (
              <Link
                to="/dashboard"
                className={styles.loginButton}
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Logout
              </button>
            )
          ) : isDesktop ? (
            <a
              href="/login"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.loginButton}
            >
              Login
            </a>
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
