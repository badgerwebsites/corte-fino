// components/booking/StepServiceSelect.tsx
import type { Service } from '../../types/database.types';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/booking.css';

interface StepServiceSelectProps {
  services: Service[];
  onSelect: (service: Service) => void;
  onBack: () => void;
}

export function StepServiceSelect({ services, onSelect, onBack }: StepServiceSelectProps) {
  return (
    <View className={styles.stepContainer}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back to Barber
      </button>
      {services.length === 0 && (
        <Text className={styles.emptyState}>No services listed</Text>
      )}
      <View className={styles.serviceGrid}>
        {services.map((service) => (
          <View
            key={service.id}
            className={styles.serviceCard}
            onClick={() => onSelect(service)}
          >
            {service.image_url && (
              <View className={styles.serviceImageWrapper}>
                <img
                  src={service.image_url}
                  alt={service.name}
                  className={styles.serviceImage}
                />
              </View>
            )}
            <View className={styles.serviceCardContent}>
              <Text className={styles.serviceName}>{service.name}</Text>
              <Text className={styles.serviceDuration}>{service.duration_minutes} minutes</Text>
              {service.description && (
                <Text className={styles.serviceDescription}>{service.description}</Text>
              )}
              <Text className={styles.servicePoints}>+{service.reward_points} reward points</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
