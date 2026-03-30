// components/rewards/HowItWorksSteps.tsx
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/rewards.css';

export function HowItWorksSteps() {
  return (
    <View className={styles.howItWorks}>
      <View className={styles.stepsList}>
        <View className={styles.step}>
          <Text className={styles.stepNumber}>1</Text>
          <Text className={styles.stepText}>Book through our website</Text>
        </View>
        <View className={styles.step}>
          <Text className={styles.stepNumber}>2</Text>
          <Text className={styles.stepText}>Earn points with each visit</Text>
        </View>
        <View className={styles.step}>
          <Text className={styles.stepNumber}>3</Text>
          <Text className={styles.stepText}>Redeem points for rewards</Text>
        </View>
      </View>
    </View>
  );
}
