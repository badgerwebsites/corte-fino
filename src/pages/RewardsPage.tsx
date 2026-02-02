// pages/RewardsPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { supabase } from '../lib/supabase';
import type { Reward, RewardRedemptionWithDetails } from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/rewards.css';

// Generate a random 6-character alphanumeric code
const generateRedemptionCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars: I, O, 0, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function RewardsPage() {
  const { user, customer, refreshCustomer } = useAuth();
  const location = useLocation();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pendingRedemptions, setPendingRedemptions] = useState<RewardRedemptionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCode, setActiveCode] = useState<string | null>(null);

  // Refetch rewards and customer data when navigating to this page
  useEffect(() => {
    loadRewards();
    refreshCustomer();
  }, [location.key, refreshCustomer]);

  // useEffect(() => {
  //   if (user) {
  //     loadPendingRedemptions();
  //   }
  // }, [user]);

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

  // const loadPendingRedemptions = async () => {
  //   if (!user) return;

  //   try {
  //     const { data, error } = await supabase
  //       .from('reward_redemptions')
  //       .select(`
  //         *,
  //         reward:rewards(*)
  //       `)
  //       .eq('customer_id', user.id)
  //       .eq('fulfilled', false)
  //       .order('redeemed_at', { ascending: false });

  //     if (error) throw error;
  //     setPendingRedemptions(data || []);
  //   } catch (error) {
  //     console.error('Error loading pending redemptions:', error);
  //   }
  // };

  const loadPendingRedemptions = useCallback(async () => {
  if (!user) return;

  try {
    const { data, error } = await supabase
      .from('reward_redemptions')
      .select(`
        *,
        reward:rewards(*)
      `)
      .eq('customer_id', user.id)
      .eq('fulfilled', false)
      .order('redeemed_at', { ascending: false });

    if (error) throw error;
    setPendingRedemptions(data || []);
  } catch (error) {
    console.error('Error loading pending redemptions:', error);
  }
}, [user]);


  const handleRedeem = async (rewardId: string, pointsRequired: number) => {
    if (!user || !customer) {
      alert('Please sign in to redeem rewards');
      return;
    }

    if (customer.reward_points < pointsRequired) {
      alert('Not enough points');
      return;
    }

    const redemptionCode = generateRedemptionCode();

    try {
      // Deduct points immediately
      const newPoints = customer.reward_points - pointsRequired;
      const { error: pointsError } = await supabase
        .from('customers')
        .update({ reward_points: newPoints })
        .eq('id', user.id);

      if (pointsError) throw pointsError;

      // Create pending redemption
      const { error } = await supabase.from('reward_redemptions').insert({
        customer_id: user.id,
        reward_id: rewardId,
        points_spent: pointsRequired,
        redemption_code: redemptionCode,
        fulfilled: false,
      });

      if (error) {
        // Refund points if redemption creation fails
        await supabase
          .from('customers')
          .update({ reward_points: customer.reward_points })
          .eq('id', user.id);
        throw error;
      }

      // Show the code to the customer
      setActiveCode(redemptionCode);

      // Refresh customer data to update points in UI
      await refreshCustomer();

      // Reload pending redemptions
      loadPendingRedemptions();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Failed to redeem reward: ' + (error instanceof Error ? error.message : 'Check database permissions'));
    }
  };

  const handleCancelRedemption = async (redemptionId: string) => {
    if (!confirm('Cancel this redemption request? Your points will be refunded.')) return;

    try {
      // Find the redemption to get points_spent
      const redemption = pendingRedemptions.find(r => r.id === redemptionId);
      if (!redemption) {
        alert('Redemption not found');
        return;
      }

      // Delete the redemption
      const { error } = await supabase
        .from('reward_redemptions')
        .delete()
        .eq('id', redemptionId)
        .eq('fulfilled', false);

      if (error) throw error;

      // Refund points to customer
      if (user && customer) {
        const newPoints = customer.reward_points + redemption.points_spent;
        await supabase
          .from('customers')
          .update({ reward_points: newPoints })
          .eq('id', user.id);

        // Refresh customer data to update points in UI
        await refreshCustomer();
      }

      loadPendingRedemptions();
    } catch (error) {
      console.error('Error cancelling redemption:', error);
      alert('Failed to cancel redemption');
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <View className={styles.container}>
          <Text>Loading rewards...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Navigation />
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

      {/* Redemption Code Modal */}
      {activeCode && (
        <View className={styles.codeModal}>
          <View className={styles.codeModalContent}>
            <Text className={styles.codeModalTitle}>Your Redemption Code</Text>
            <Text className={styles.codeModalSubtitle}>
              Show this code to your barber to claim your reward
            </Text>
            <View className={styles.codeDisplay}>
              <Text className={styles.codeText}>{activeCode}</Text>
            </View>
            <Text className={styles.codeModalHint}>
              Points will be deducted when the barber confirms your redemption
            </Text>
            <button
              className={styles.codeModalButton}
              onClick={() => setActiveCode(null)}
            >
              Got It
            </button>
          </View>
        </View>
      )}

      {/* Pending Redemptions */}
      {pendingRedemptions.length > 0 && (
        <View className={styles.pendingSection}>
          <Text className={styles.sectionTitle}>Pending Redemptions</Text>
          <Text className={styles.pendingHint}>
            Show these codes to your barber to claim your rewards
          </Text>
          <View className={styles.pendingList}>
            {pendingRedemptions.map((redemption) => (
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
                  onClick={() => handleCancelRedemption(redemption.id)}
                >
                  Cancel
                </button>
              </View>
            ))}
          </View>
        </View>
      )}

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
    </>
  );
}
