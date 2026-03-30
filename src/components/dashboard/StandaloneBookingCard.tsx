// components/booking/StandaloneBookingCard.tsx
import type { BookingWithDetails } from '../../types/database.types';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/dashboard.css';

interface StandaloneBookingCardProps {
  booking: BookingWithDetails;
  isUpcoming: boolean;
  formatTime: (time: string) => string;
  formatDateShort: (dateStr: string) => string;
  onReschedule: () => void;
  onCancel: () => void;
}

export function StandaloneBookingCard({
  booking,
  isUpcoming,
  formatTime,
  formatDateShort,
  onReschedule,
  onCancel,
}: StandaloneBookingCardProps) {
  return (
    <View className={styles.bookingCard}>
      <View className={styles.bookingMain}>
        <View className={styles.bookingInfo}>
          <Text className={styles.bookingDate}>
            {formatDateShort(booking.booking_date)}
          </Text>
          <View className={styles.bookingMeta}>
            <Text>
              <span className={styles.bookingTime}>{formatTime(booking.start_time)}</span>
            </Text>
            <Text>{booking.service?.name}</Text>
            {booking.barber && <Text>with {booking.barber.name}</Text>}
          </View>
        </View>
        <View className={styles.bookingRight}>
          <Text className={styles.bookingPrice}>
            ${booking.total_price.toFixed(2)}
          </Text>
          <View className={`${styles.statusBadge} ${styles[booking.status]}`}>
            <Text>{booking.status}</Text>
          </View>
        </View>
      </View>
      {isUpcoming && (
        <View className={styles.bookingActions}>
          <button className={styles.actionLink} onClick={onReschedule}>
            Reschedule
          </button>
          <button className={styles.actionLinkDanger} onClick={onCancel}>
            Cancel
          </button>
        </View>
      )}
    </View>
  );
}
