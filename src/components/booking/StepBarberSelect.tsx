// components/booking/StepBarberSelect.tsx
import type { Barber } from '../../types/database.types';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/booking.css';

interface StepBarberSelectProps {
  barbers: Barber[];
  onSelect: (barber: Barber | null, anyAvailable?: boolean) => void;
  onBack: () => void;
}

export function StepBarberSelect({ barbers, onSelect, onBack }: StepBarberSelectProps) {
  return (
    <View className={styles.stepContainer}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back to Service
      </button>
      <View className={styles.barberGrid}>
        {barbers.map((barber) => (
          <View
            key={barber.id}
            className={styles.barberCard}
            onClick={() => onSelect(barber, false)}
          >
            {barber.image_url && (
              <View className={styles.barberImageWrapper}>
                <img
                  src={barber.image_url}
                  alt={barber.name}
                  className={styles.barberImage}
                />
              </View>
            )}
            <Text className={styles.barberName}>{barber.name}</Text>
            {barber.bio && (
              <Text className={styles.barberBio}>{barber.bio}</Text>
            )}
            {barber.instagram_handle && (
              <Text className={styles.barberSocial}>@{barber.instagram_handle}</Text>
            )}
          </View>
        ))}
        <View
          className={styles.barberCard}
          onClick={() => onSelect(null, true)}
        >
          <Text className={styles.barberName}>Any Available Barber</Text>
          <Text className={styles.barberBio}>
            We'll match you with the first available barber
          </Text>
        </View>
      </View>
    </View>
  );
}
