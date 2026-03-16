import type { RewardRedemptionWithDetails } from '../../types/database.types';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/rewards.css';

interface PendingRedemptionsProps {
  redemptions: RewardRedemptionWithDetails[];
  onCancel: (id: string) => void;
}

export function PendingRedemptions({ redemptions, onCancel }: PendingRedemptionsProps) {
  if (redemptions.length === 0) return null;

  return (
    <View className={styles.pendingSection}>
      <Text className={styles.pendingTitle}>Pending Redemptions</Text>
      <View className={styles.pendingList}>
        {redemptions.map((redemption) => (
          <View key={redemption.id} className={styles.pendingCard}>
            <View className={styles.pendingInfo}>
              <Text className={styles.pendingReward}>
                {redemption.reward?.name || 'Reward'}
              </Text>
              <Text className={styles.pendingPoints}>
                {redemption.points_spent} points
              </Text>
            </View>
            <View className={styles.pendingCodeBox}>
              <Text className={styles.pendingCode}>{redemption.redemption_code}</Text>
            </View>
            <button
              className={styles.cancelButton}
              onClick={() => onCancel(redemption.id)}
            >
              Cancel
            </button>
          </View>
        ))}
      </View>
    </View>
  );
}
