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
              <View className={styles.featureIcon}>Icon</View>
              <Text className={styles.featureTitle}>Expert Barbers</Text>
              <Text className={styles.featureText}>
                Our skilled professionals bring years of experience and passion
              </Text>
            </View>

            <View className={styles.feature}>
              <View className={styles.featureIcon}>Icon</View>
              <Text className={styles.featureTitle}>Premium Service</Text>
              <Text className={styles.featureText}>
                Quality cuts with attention to every detail
              </Text>
            </View>

            <View className={styles.feature}>
              <View className={styles.featureIcon}>Icon</View>
              <Text className={styles.featureTitle}>Flexible Scheduling</Text>
              <Text className={styles.featureText}>
                Book by barber or time slot — your choice
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
                      <Text className={styles.barberSocial}>
                        @{barber.instagram_handle}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>Contact Us</Text>

          <View className={styles.contactInfo}>
            <Text className={styles.contactText}>123 Main Street</Text>
            <Text className={styles.contactText}>Your City, CA 90000</Text>
            <Text className={styles.contactText}>(555) 123-4567</Text>
            <Text className={styles.contactText}>info@cortefino.com</Text>
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
