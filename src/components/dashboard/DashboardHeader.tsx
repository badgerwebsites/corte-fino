import { Link } from 'react-router-dom';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/dashboard.css';

interface DashboardHeaderProps {
  firstName: string | undefined;
  hasBookings: boolean;
  rewardsEnabled: boolean;
  rewardPoints: number;
}

export function DashboardHeader({ firstName, hasBookings, rewardsEnabled, rewardPoints }: DashboardHeaderProps) {
  return (
    <View className={styles.header}>
      <Text className={styles.greeting}>Welcome back, {firstName}</Text>
      {hasBookings && (
        <Link to="/book" className={styles.primaryCta}>
          Book Appointment
        </Link>
      )}
      {rewardsEnabled && (
        <View className={styles.rewardsCard}>
          <View className={styles.rewardsInfo}>
            <svg
              className={styles.rewardsIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="8" width="18" height="13" rx="2" />
              <line x1="12" y1="8" x2="12" y2="21" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <path d="M12 8c0-2-1.5-4-3-4-1.5 0-2.5 1-2.5 2.5C6.5 8 9 8 12 8z" />
              <path d="M12 8c0-2 1.5-4 3-4 1.5 0 2.5 1 2.5 2.5C17.5 8 15 8 12 8z" />
            </svg>
            <Text className={styles.rewardsText}>
              <span className={styles.rewardsPoints}>{rewardPoints}</span> points
            </Text>
          </View>
          <Link to="/rewards" className={styles.rewardsLink}>
            Rewards
          </Link>
        </View>
      )}
    </View>
  );
}
