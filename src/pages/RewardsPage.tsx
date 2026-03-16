// pages/RewardsPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { supabase } from '../lib/supabase';
import type { Reward, RewardRedemptionWithDetails } from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { HowItWorksSteps } from '../components/rewards/HowItWorksSteps';
import { RedemptionCodeModal } from '../components/rewards/RedemptionCodeModal';
import { PendingRedemptions } from '../components/rewards/PendingRedemptions';
import { RewardCard } from '../components/rewards/RewardCard';
import { View } from '../ui/View';
import * as styles from '../styles/rewards.css';

const generateRedemptionCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function RewardsPage() {
  const { user, customer, refreshCustomer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pendingRedemptions, setPendingRedemptions] = useState<RewardRedemptionWithDetails[]>([]);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [rewardsEnabled, setRewardsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRewardsEnabled = async () => {
      const { data } = await supabase.from('site_settings').select('rewards_enabled').single();
      const enabled = data?.rewards_enabled !== false;
      setRewardsEnabled(enabled);
      if (!enabled) {
        navigate(user ? '/dashboard' : '/', { replace: true });
      }
    };
    checkRewardsEnabled();
  }, [navigate, user]);

  useEffect(() => {
    if (rewardsEnabled === false) return;
    loadRewards();
    refreshCustomer();
  }, [location.key, refreshCustomer, rewardsEnabled]);

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
    }
  };

  const loadPendingRedemptions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reward_redemptions')
        .select(`*, reward:rewards(*)`)
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
      const newPoints = customer.reward_points - pointsRequired;
      const { error: pointsError } = await supabase
        .from('customers')
        .update({ reward_points: newPoints })
        .eq('id', user.id);

      if (pointsError) throw pointsError;

      const { error } = await supabase.from('reward_redemptions').insert({
        customer_id: user.id,
        reward_id: rewardId,
        points_spent: pointsRequired,
        redemption_code: redemptionCode,
        fulfilled: false,
      });

      if (error) {
        await supabase
          .from('customers')
          .update({ reward_points: customer.reward_points })
          .eq('id', user.id);
        throw error;
      }

      setActiveCode(redemptionCode);
      await refreshCustomer();
      loadPendingRedemptions();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Failed to redeem reward: ' + (error instanceof Error ? error.message : 'Check database permissions'));
    }
  };

  const handleCancelRedemption = async (redemptionId: string) => {
    if (!confirm('Cancel this redemption request? Your points will be refunded.')) return;

    try {
      const redemption = pendingRedemptions.find(r => r.id === redemptionId);
      if (!redemption) {
        alert('Redemption not found');
        return;
      }

      const { error } = await supabase
        .from('reward_redemptions')
        .delete()
        .eq('id', redemptionId)
        .eq('fulfilled', false);

      if (error) throw error;

      if (user && customer) {
        const newPoints = customer.reward_points + redemption.points_spent;
        await supabase
          .from('customers')
          .update({ reward_points: newPoints })
          .eq('id', user.id);
        await refreshCustomer();
      }

      loadPendingRedemptions();
    } catch (error) {
      console.error('Error cancelling redemption:', error);
      alert('Failed to cancel redemption');
    }
  };

  if (rewardsEnabled === null || rewardsEnabled === false) {
    return null;
  }

  return (
    <>
      <Navigation />
      <View className={styles.container}>
        <View className={styles.backLink}>
          <Link to={user ? '/dashboard' : '/'} className={styles.link}>
            ← Back
          </Link>
        </View>

        <HowItWorksSteps />

        {activeCode && (
          <RedemptionCodeModal code={activeCode} onClose={() => setActiveCode(null)} />
        )}

        <PendingRedemptions
          redemptions={pendingRedemptions}
          onCancel={handleCancelRedemption}
        />

        <View className={styles.rewardsGrid}>
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              customerPoints={customer?.reward_points}
              onRedeem={handleRedeem}
            />
          ))}
        </View>
      </View>
    </>
  );
}
