// components/Navigation.tsx
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/useAuth';
import { View } from '../ui/View';
import * as styles from '../styles/navigation.css';

export function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { signOut } = useAuth();
  const [logoIndex, setLogoIndex] = useState(0);
  const [carouselLogos, setCarouselLogos] = useState<(string | null)[]>([null, null, null]);

  // Helper to determine logo value: empty string means hidden, null means use default, URL means use that
  const getLogoValue = (dbValue: string | null | undefined, defaultValue: string | null): string | null => {
    if (dbValue === 'HIDDEN') return null;
    if (dbValue && dbValue.length > 0) return dbValue; 
    return defaultValue;
  };

  // Fetch site settings for carousel logos
  useEffect(() => {
    const loadSiteSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('nav_logo_1_url, nav_logo_2_url, nav_logo_3_url')
        .single();

      if (data) {
        setCarouselLogos([
          getLogoValue(data.nav_logo_1_url, null),
          getLogoValue(data.nav_logo_2_url, null),
          getLogoValue(data.nav_logo_3_url, null)
        ]);
      }
    };

    loadSiteSettings();
  }, []);

  // Filter out null logos and rotate through them
  const activeLogos = carouselLogos.filter((logo): logo is string => logo !== null);

  // Use time-based index calculation so all carousels stay in sync
  useEffect(() => {
    if (activeLogos.length <= 1) return;

    const INTERVAL_MS = 3000;

    const updateIndex = () => {
      const tick = Math.floor(Date.now() / INTERVAL_MS);
      setLogoIndex(tick % activeLogos.length);
    };

    updateIndex();

    // Update on interval
    const interval = setInterval(updateIndex, 100);

    return () => clearInterval(interval);
  }, [activeLogos.length]);


  const location = useLocation();

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

  const handleLogout = () => {
    // Clear all local storage — Supabase session lives under sb-* keys.
    // Doing this synchronously before navigating guarantees the next page
    // load sees no session even if the signOut API call fails or is slow.
    localStorage.clear();
    // Invalidate the server-side session in the background (best effort).
    signOut().catch(() => {});
    // Full reload so the login page starts with a clean auth state.
    window.location.replace('/login');
  };

  if (hideNav) {
    return null;
  }

  return (
    <nav className={styles.nav}>
      <View className={styles.navContainer}>
        <Link to="/" className={styles.logoLink}>
          <View className={styles.carouselContainer}>
            <View
              className={styles.carouselTrack}
              style={{ transform: `translateX(-${logoIndex * 100}%)` }}
            >
              {activeLogos.map((logoSrc, index) => (
                <View key={index} className={styles.carouselSlide}>
                  <img
                    src={logoSrc}
                    alt={`Logo ${index + 1}`}
                    className={styles.logoImage}
                  />
                </View>
              ))}
            </View>
          </View>
        </Link>

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
