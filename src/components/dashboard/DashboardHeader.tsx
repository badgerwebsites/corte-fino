// components/booking/DashboardHeader.tsx
import { Link } from 'react-router-dom';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/dashboard.css';

interface DashboardHeaderProps {
  firstName: string | undefined;
  hasBookings: boolean;
  rewardsEnabled: boolean;
  rewardPoints: number;
  onEditProfile: () => void;
}

export function DashboardHeader({ firstName, hasBookings, rewardsEnabled, rewardPoints, onEditProfile }: DashboardHeaderProps) {
  return (
    <View className={styles.header}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className={styles.greeting}>Welcome, {firstName}</span>
        <button
          onClick={onEditProfile}
          aria-label="Edit profile"
          className={styles.editProfileButton}
        >
          <svg className={styles.editProfileIcon} viewBox="0 0 24 24" fill="none" stroke="#f5f5f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>
      {hasBookings && (
        <Link to="/book" className={styles.primaryCta}>
          Book Appointment
        </Link>
      )}
      {rewardsEnabled && (
        <Link to="/rewards" className={styles.rewardsCard}>
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
            <span className={styles.rewardsPoints}>{rewardPoints}</span> reward points
          </Text>
        </Link>
      )}
    </View>
  );
}
