import { Link } from 'react-router-dom';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/dashboard.css';

interface EmptyBookingsStateProps {
  rewardsEnabled: boolean;
}

export function EmptyBookingsState({ rewardsEnabled }: EmptyBookingsStateProps) {
  return (
    <View className={styles.emptyState}>
      <svg
        className={styles.emptyStateIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <polyline points="9 16 11 18 15 14" />
      </svg>
      <Text className={styles.emptyStateTitle}>No upcoming appointments</Text>
      <Text className={styles.emptyStateText}>
        {rewardsEnabled
          ? 'Book an appointment and start earning reward points.'
          : 'Book an appointment today.'}
      </Text>
      <Link to="/book" className={styles.emptyStateButton}>
        Book Appointment
      </Link>
    </View>
  );
}
