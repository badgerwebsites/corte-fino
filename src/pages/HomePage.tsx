// pages/HomePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Barber } from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/home.css';
import logo from '../assets/BigLogo.svg';
import scissorsIcon from '../assets/scissors.svg';
import calendarCheckIcon from '../assets/calendar-check.svg';
import crownIcon from '../assets/crown.svg';
import instagramIcon from '../assets/instagram.svg';

export default function HomePage() {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    const loadBarbers = async () => {
      try {
        const { data, error } = await supabase
          .from('barbers')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setBarbers(data ?? []);
      } catch (error) {
        console.error('Error loading barbers:', error);
      }
    };

    loadBarbers();
  }, []);

  return (
    <>
      <Navigation />

      {/* Full-Screen Hero */}
      <View className={styles.heroFullScreen}>
        <View className={styles.heroOverlay} />
        <View className={styles.heroContent}>
          <img
            src={logo}
            alt="Corte Fino"
            className={styles.heroLogoLarge}
          />
          <Text className={styles.heroTagline}>
            Precision cuts. Refined style.
          </Text>
          <button
            className={styles.heroBookButton}
            onClick={() => navigate('/book')}
          >
            Book Your Appointment
          </button>
        </View>
        <View className={styles.scrollIndicator}>
          <Text className={styles.scrollText}>Scroll to explore</Text>
          <Text className={styles.scrollArrow}>↓</Text>
        </View>
      </View>

      <View className={styles.container}>

        {/* Why Choose Us */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>Why Choose Us</Text>

          <View className={styles.features}>
            <View className={styles.feature}>
              <View className={styles.featureIcon}>
                <img src={scissorsIcon} alt="Scissors" className={styles.featureIconImg} />
              </View>
              <Text className={styles.featureTitle}>Expert Barbers</Text>
              <Text className={styles.featureText}>
                Real experience. Real results.
              </Text>
            </View>

            <View className={styles.feature}>
              <View className={styles.featureIcon}>
                <img src={crownIcon} alt="Crown" className={styles.featureIconImg} />
              </View>
              <Text className={styles.featureTitle}>Premium Service</Text>
              <Text className={styles.featureText}>
                Where quality isn't rushed.
              </Text>
            </View>

            <View className={styles.feature}>
              <View className={styles.featureIcon}>
                <img src={calendarCheckIcon} alt="Calendar" className={styles.featureIconImg} />
              </View>
              <Text className={styles.featureTitle}>Flexible Scheduling</Text>
              <Text className={styles.featureText}>
                Appointments that fit your schedule.
              </Text>
            </View>
          </View>
        </View>

        {/* Barbers */}
        {barbers.length > 0 && (
          <View className={styles.barbersSection}>
            <Text className={styles.sectionTitle}>Meet Our Barbers</Text>

            <View className={styles.barbersGrid}>
              {barbers.map((barber) => (
                <View key={barber.id} className={styles.barberCard}>
                  {barber.image_url ? (
                    <img
                      src={barber.image_url}
                      alt={barber.name}
                      className={styles.barberImage}
                    />
                  ) : (
                    <View className={styles.barberImagePlaceholder}>
                      Barber Photo
                    </View>
                  )}

                  <View className={styles.barberInfo}>
                    <Text className={styles.barberName}>{barber.name}</Text>

                    {barber.bio && (
                      <Text className={styles.barberBio}>
                        {barber.bio}
                      </Text>
                    )}

                    {barber.instagram_handle && (
                      <a
                        href={`https://instagram.com/${barber.instagram_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.barberSocialLink}
                      >
                        <View className={styles.barberSocialRow}>
                          <img src={instagramIcon} alt="Instagram" className={styles.barberSocialIcon} />
                          <Text className={styles.barberSocial}>
                            @{barber.instagram_handle}
                          </Text>
                        </View>
                      </a>
                    )}

                    {barber.phone && (
                      <a
                        href={`tel:${barber.phone}`}
                        className={styles.barberPhoneLink}
                      >
                        <View className={styles.barberPhoneRow}>
                          <svg className={styles.barberPhoneIcon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                          </svg>
                          <Text className={styles.barberPhone}>{barber.phone}</Text>
                        </View>
                      </a>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact */}
        <View className={styles.contactSection}>
          <Text className={styles.sectionTitle}>Contact Us</Text>

          <View className={styles.contactInfo}>
            <a
              href="https://maps.apple.com/?address=966%20W%20400%20N%20ste%20100,%20Logan,%20UT%2084321,%20USA"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              <View className={styles.contactRow}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <View>
                  <Text className={styles.contactText}>966 W 400 N Ste 100</Text>
                  <Text className={styles.contactText}>Logan, UT 84321</Text>
                </View>
              </View>
            </a>
            <a
              href="mailto:cortefino962@gmail.com"
              className={styles.contactLink}
            >
              <View className={styles.contactRow}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <Text className={styles.contactText}>cortefino962@gmail.com</Text>
              </View>
            </a>
          </View>
        </View>

        {/* Footer */}
        <View className={styles.footer}>
          <Text className={styles.footerText}>
            © 2026 Corte Fino Barbershop. All rights reserved.
          </Text>
        </View>
      </View>
    </>
  );
}
