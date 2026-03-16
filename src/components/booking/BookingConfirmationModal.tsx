import { Link } from 'react-router-dom';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/booking.css';

export interface ConfirmedBookingDetails {
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  price: number;
  rewardPoints: number;
}

interface BookingConfirmationModalProps {
  details: ConfirmedBookingDetails;
  isReschedule: boolean;
}

export function BookingConfirmationModal({ details, isReschedule }: BookingConfirmationModalProps) {
  return (
    <div className={styles.confirmationOverlay}>
      <div className={styles.confirmationModal}>
        <View className={styles.confirmationIcon}>
          <svg
            className={styles.confirmationCheckmark}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </View>

        <Text className={styles.confirmationTitle}>
          {isReschedule ? 'Booking Rescheduled!' : 'Booking Confirmed!'}
        </Text>

        <View className={styles.confirmationDetails}>
          <View className={styles.confirmationDetailRow}>
            <Text className={styles.confirmationDetailLabel}>Service</Text>
            <Text className={styles.confirmationDetailValue}>{details.serviceName}</Text>
          </View>
          <View className={styles.confirmationDetailRow}>
            <Text className={styles.confirmationDetailLabel}>Barber</Text>
            <Text className={styles.confirmationDetailValue}>{details.barberName}</Text>
          </View>
          <View className={styles.confirmationDetailRow}>
            <Text className={styles.confirmationDetailLabel}>Date</Text>
            <Text className={styles.confirmationDetailValue}>{details.date}</Text>
          </View>
          <View className={styles.confirmationDetailRow}>
            <Text className={styles.confirmationDetailLabel}>Time</Text>
            <Text className={styles.confirmationDetailValue}>{details.time}</Text>
          </View>
          <View className={styles.confirmationDetailRow}>
            <Text className={styles.confirmationDetailLabel}>Total</Text>
            <Text className={styles.confirmationDetailValue}>${details.price.toFixed(2)}</Text>
          </View>
        </View>

        <View className={styles.confirmationButtons}>
          <Link to="/dashboard" className={styles.confirmationPrimaryButton}>
            Back to Dashboard
          </Link>
        </View>
      </div>
    </div>
  );
}
