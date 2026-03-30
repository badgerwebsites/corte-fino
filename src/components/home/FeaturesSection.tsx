// components/home/FeaturesSection.tsx
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/home.css';
import scissorsIcon from '../../assets/scissors.svg';
import calendarCheckIcon from '../../assets/calendar-check.svg';
import crownIcon from '../../assets/crown.svg';

export function FeaturesSection() {
  return (
    <View className={styles.sectionDarker}>
      <View className={styles.features}>
        <View className={styles.feature}>
          <View className={styles.featureIcon}>
            <img src={scissorsIcon} alt="Scissors" className={styles.featureIconImg} />
          </View>
          <Text className={styles.featureTitle}>Expert Barbers</Text>
          <Text className={styles.featureText}>Real experience. Real results.</Text>
        </View>

        <View className={styles.feature}>
          <View className={styles.featureIcon}>
            <img src={crownIcon} alt="Crown" className={styles.featureIconImg} />
          </View>
          <Text className={styles.featureTitle}>Premium Service</Text>
          <Text className={styles.featureText}>Where quality isn't rushed.</Text>
        </View>

        <View className={styles.feature}>
          <View className={styles.featureIcon}>
            <img src={calendarCheckIcon} alt="Calendar" className={styles.featureIconImg} />
          </View>
          <Text className={styles.featureTitle}>Flexible Scheduling</Text>
          <Text className={styles.featureText}>Appointments that fit your schedule.</Text>
        </View>
      </View>
    </View>
  );
}
