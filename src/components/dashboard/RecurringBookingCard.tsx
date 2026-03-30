// components/booking/RecurringBookingCard.tsx
import type { BookingWithDetails } from '../../types/database.types';
import { RECURRENCE_LABELS } from '../../types/database.types';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/dashboard.css';

interface RecurringBookingGroup {
  groupId: string;
  pattern: string;
  nextBooking: BookingWithDetails;
  allBookings: BookingWithDetails[];
  remainingCount: number;
}

interface RecurringBookingCardProps {
  group: RecurringBookingGroup;
  isExpanded: boolean;
  isUpcoming: boolean;
  formatTime: (time: string) => string;
  formatDateShort: (dateStr: string) => string;
  onToggleExpand: () => void;
  onCancel: () => void;
}

export function RecurringBookingCard({
  group,
  isExpanded,
  isUpcoming,
  formatTime,
  formatDateShort,
  onToggleExpand,
  onCancel,
}: RecurringBookingCardProps) {
  return (
    <View className={styles.bookingCard}>
      <View className={styles.bookingMain}>
        <View className={styles.bookingInfo}>
          <Text className={styles.bookingDate}>
            {formatDateShort(group.nextBooking.booking_date)}
          </Text>
          <View className={styles.bookingMeta}>
            <Text>
              <span className={styles.bookingTime}>{formatTime(group.nextBooking.start_time)}</span>
            </Text>
            <Text>{group.nextBooking.service?.name}</Text>
            {group.nextBooking.barber && <Text>with {group.nextBooking.barber.name}</Text>}
          </View>
          <Text className={styles.recurringBadge}>
            Recurring {RECURRENCE_LABELS[group.pattern as keyof typeof RECURRENCE_LABELS] || group.pattern} ·{' '}
            <span className={styles.remainingText}>{group.remainingCount} remaining</span>
          </Text>
        </View>
        <View className={styles.bookingRight}>
          <Text className={styles.bookingPrice}>
            ${group.nextBooking.total_price.toFixed(2)}
          </Text>
          <View className={`${styles.statusBadge} ${styles[group.nextBooking.status]}`}>
            <Text>{group.nextBooking.status}</Text>
          </View>
        </View>
      </View>

      {isExpanded && (
        <View className={styles.recurringList}>
          {group.allBookings.map((booking) => (
            <View key={booking.id} className={styles.recurringItem}>
              <Text className={styles.recurringItemDate}>
                {formatDateShort(booking.booking_date)} at {formatTime(booking.start_time)}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.bookingActions}>
        <button className={styles.actionLink} onClick={onToggleExpand}>
          {isExpanded ? 'Hide dates' : 'View all dates'}
        </button>
        {isUpcoming && (
          <button className={styles.actionLinkDanger} onClick={onCancel}>
            Cancel
          </button>
        )}
      </View>
    </View>
  );
}
