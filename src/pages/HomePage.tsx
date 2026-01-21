import { useNavigate } from 'react-router-dom';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/home.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <View className={styles.container}>
      <View className={styles.hero}>
        <Text className={styles.title}>Corte Fino</Text>
        <Text className={styles.subtitle}>Precision cuts. Refined style.</Text>

        <View className={styles.buttonGroup}>
          <button
            className={styles.primaryButton}
            onClick={() => navigate('/book')}
          >
            Book Now
          </button>
          <button
            className={styles.secondaryButton}
            onClick={() => navigate('/rewards')}
          >
            Rewards Program
          </button>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>Why Choose Us</Text>
        <View className={styles.features}>
          <View className={styles.feature}>
            <Text className={styles.featureTitle}>Expert Barbers</Text>
            <Text className={styles.featureText}>
              Our skilled professionals bring years of experience and passion
            </Text>
          </View>
          <View className={styles.feature}>
            <Text className={styles.featureTitle}>Premium Service</Text>
            <Text className={styles.featureText}>
              Quality cuts with attention to every detail
            </Text>
          </View>
          <View className={styles.feature}>
            <Text className={styles.featureTitle}>Flexible Scheduling</Text>
            <Text className={styles.featureText}>
              Book by barber or time slot - your choice
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>Contact Us</Text>
        <View className={styles.contactInfo}>
          <Text className={styles.contactText}>123 Main Street</Text>
          <Text className={styles.contactText}>Your City, CA 90000</Text>
          <Text className={styles.contactText}>(555) 123-4567</Text>
          <Text className={styles.contactText}>info@cortefino.com</Text>
        </View>
      </View>

      <View className={styles.footer}>
        <Text className={styles.footerText}>
          © 2026 Corte Fino Barbershop. All rights reserved.
        </Text>
      </View>
    </View>
  );
}
