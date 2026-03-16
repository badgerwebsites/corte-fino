import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/booking.css';

type BookingStep = 0 | 1 | 2 | 3 | 4;

interface BookingProgressBarProps {
  step: BookingStep;
  isAdmin: boolean;
}

export function BookingProgressBar({ step, isAdmin }: BookingProgressBarProps) {
  return (
    <View className={styles.progressBar}>
      {isAdmin && (
        <>
          <View className={`${styles.progressStep} ${step >= 0 ? styles.progressStepActive : ''}`}>
            <View className={styles.progressNumber}>0</View>
            <Text className={styles.progressLabel}>Customer</Text>
          </View>
          <View className={styles.progressLine} />
        </>
      )}
      <View className={`${styles.progressStep} ${step >= 1 ? styles.progressStepActive : ''}`}>
        <View className={styles.progressNumber}>1</View>
        <Text className={styles.progressLabel}>Service</Text>
      </View>
      <View className={styles.progressLine} />
      <View className={`${styles.progressStep} ${step >= 2 ? styles.progressStepActive : ''}`}>
        <View className={styles.progressNumber}>2</View>
        <Text className={styles.progressLabel}>Barber</Text>
      </View>
      <View className={styles.progressLine} />
      <View className={`${styles.progressStep} ${step >= 3 ? styles.progressStepActive : ''}`}>
        <View className={styles.progressNumber}>3</View>
        <Text className={styles.progressLabel}>Time</Text>
      </View>
      <View className={styles.progressLine} />
      <View className={`${styles.progressStep} ${step >= 4 ? styles.progressStepActive : ''}`}>
        <View className={styles.progressNumber}>4</View>
        <Text className={styles.progressLabel}>Confirm</Text>
      </View>
    </View>
  );
}
