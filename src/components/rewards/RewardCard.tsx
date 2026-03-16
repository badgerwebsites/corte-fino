import type { Reward } from '../../types/database.types';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/rewards.css';

interface RewardCardProps {
  reward: Reward;
  customerPoints?: number;
  onRedeem: (id: string, pointsRequired: number) => void;
}

export function RewardCard({ reward, customerPoints, onRedeem }: RewardCardProps) {
  const canRedeem = customerPoints !== undefined && customerPoints >= reward.points_required;
  const progress = customerPoints !== undefined
    ? Math.min((customerPoints / reward.points_required) * 100, 100)
    : 0;

  return (
    <View className={styles.rewardCard}>
      <View className={styles.rewardHeader}>
        <Text className={styles.rewardName}>{reward.name}</Text>
        <View className={styles.pointsBadge}>
          <Text>{reward.points_required} pts</Text>
        </View>
      </View>

      <Text className={styles.rewardDescription}>{reward.description}</Text>

      {customerPoints !== undefined && (
        <>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className={styles.progressText}>
            {customerPoints} / {reward.points_required} points
          </Text>
        </>
      )}

      <button
        className={`${styles.redeemButton} ${!canRedeem ? styles.disabled : ''}`}
        onClick={() => onRedeem(reward.id, reward.points_required)}
        disabled={!canRedeem}
      >
        {canRedeem ? 'Redeem Now' : 'Not Enough Points'}
      </button>
    </View>
  );
}
