import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Reward } from '../types/database.types';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/rewards.css';

export default function RewardsPage() {
  const { user, customer } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setRewards(data || []);
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId: string, pointsRequired: number) => {
    if (!user || !customer) {
      alert('Please sign in to redeem rewards');
      return;
    }

    if (customer.reward_points < pointsRequired) {
      alert('Not enough points');
      return;
    }

    try {
      const { error } = await supabase.from('reward_redemptions').insert({
        customer_id: user.id,
        reward_id: rewardId,
        points_spent: pointsRequired,
      });

      if (error) throw error;

      await supabase
        .from('customers')
        .update({ reward_points: customer.reward_points - pointsRequired })
        .eq('id', user.id);

      alert('Reward redeemed successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Failed to redeem reward');
    }
  };

  if (loading) {
    return (
      <View className={styles.container}>
        <Text>Loading rewards...</Text>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>Rewards Program</Text>
        <Text className={styles.subtitle}>
          Earn points with every booking and redeem amazing rewards
        </Text>
        {customer && (
          <View className={styles.pointsDisplay}>
            <Text className={styles.pointsValue}>{customer.reward_points}</Text>
            <Text className={styles.pointsLabel}>Your Points</Text>
          </View>
        )}
      </View>

      <View className={styles.howItWorks}>
        <Text className={styles.sectionTitle}>How It Works</Text>
        <View className={styles.stepsList}>
          <View className={styles.step}>
            <Text className={styles.stepNumber}>1</Text>
            <Text className={styles.stepText}>Book through our website</Text>
          </View>
          <View className={styles.step}>
            <Text className={styles.stepNumber}>2</Text>
            <Text className={styles.stepText}>Earn points with each visit</Text>
          </View>
          <View className={styles.step}>
            <Text className={styles.stepNumber}>3</Text>
            <Text className={styles.stepText}>Redeem points for rewards</Text>
          </View>
        </View>
      </View>

      <View className={styles.rewardsGrid}>
        {rewards.map((reward) => {
          const canRedeem = customer && customer.reward_points >= reward.points_required;
          const progress = customer
            ? Math.min((customer.reward_points / reward.points_required) * 100, 100)
            : 0;

          return (
            <View key={reward.id} className={styles.rewardCard}>
              <View className={styles.rewardHeader}>
                <Text className={styles.rewardName}>{reward.name}</Text>
                <View className={styles.pointsBadge}>
                  <Text>{reward.points_required} pts</Text>
                </View>
              </View>

              <Text className={styles.rewardDescription}>
                {reward.description}
              </Text>

              {customer && (
                <>
                  <View className={styles.progressBar}>
                    <View
                      className={styles.progressFill}
                      style={{ width: `${progress}%` }}
                    />
                  </View>
                  <Text className={styles.progressText}>
                    {customer.reward_points} / {reward.points_required} points
                  </Text>
                </>
              )}

              <button
                className={`${styles.redeemButton} ${!canRedeem ? styles.disabled : ''}`}
                onClick={() => handleRedeem(reward.id, reward.points_required)}
                disabled={!canRedeem}
              >
                {canRedeem ? 'Redeem Now' : 'Not Enough Points'}
              </button>
            </View>
          );
        })}
      </View>

      {!user && (
        <View className={styles.signInPrompt}>
          <Text>Sign in to view your points and redeem rewards</Text>
          <Link to="/login" className={styles.signInButton}>
            Sign In
          </Link>
        </View>
      )}

      <View className={styles.backLink}>
        <Link to={user ? '/dashboard' : '/'} className={styles.link}>
          ← Back
        </Link>
      </View>
    </View>
  );
}
