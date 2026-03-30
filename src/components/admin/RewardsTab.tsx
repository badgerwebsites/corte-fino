// components/admin/RewardsTab.tsx
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Reward, RewardRedemptionWithDetails, RewardType, SiteSettings } from '../../types/database.types';
import { supabase } from '../../lib/supabase';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/admin.css';

const DEFAULT_REWARD_FORM = {
  name: '',
  description: '',
  points_required: 100,
  reward_type: 'product' as RewardType,
  item_name: '',
  is_active: true,
  sort_order: 0,
};

interface RewardsTabProps {
  pendingRedemptions: RewardRedemptionWithDetails[];
  rewards: Reward[];
  siteSettings: SiteSettings | null;
  onUpdate: () => void;
}

export function RewardsTab({ pendingRedemptions, rewards, siteSettings, onUpdate }: RewardsTabProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [rewardForm, setRewardForm] = useState(DEFAULT_REWARD_FORM);
  const [verifyCode, setVerifyCode] = useState('');

  useEffect(() => {
    if (editingReward) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [editingReward]);

  const handleCancel = () => {
    setEditingReward(null);
    setRewardForm(DEFAULT_REWARD_FORM);
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setRewardForm({
      name: reward.name,
      description: reward.description || '',
      points_required: reward.points_required,
      reward_type: reward.reward_type,
      item_name: reward.item_name,
      is_active: reward.is_active,
      sort_order: reward.sort_order,
    });
  };

  const handleConfirmRedemption = async (redemption: RewardRedemptionWithDetails) => {
    if (!confirm(`Confirm redemption for ${redemption.reward?.name}?`)) return;
    try {
      const { error } = await supabase
        .from('reward_redemptions')
        .update({ fulfilled: true, fulfilled_at: new Date().toISOString() })
        .eq('id', redemption.id);
      if (error) throw error;
      alert('Redemption confirmed!');
      onUpdate();
    } catch (error) {
      console.error('Error confirming redemption:', error);
      alert('Failed to confirm redemption');
    }
  };

  const handleVerifyCode = async () => {
    const code = verifyCode.trim().toUpperCase();
    if (!code) { alert('Please enter a redemption code'); return; }
    const redemption = pendingRedemptions.find((r) => r.redemption_code === code);
    if (!redemption) { alert('Invalid or already used redemption code'); return; }
    await handleConfirmRedemption(redemption);
    setVerifyCode('');
  };

  const handleRejectRedemption = async (redemption: RewardRedemptionWithDetails) => {
    if (!confirm("Reject this redemption? The customer's points will be refunded.")) return;
    try {
      const currentPoints = redemption.customer?.reward_points || 0;
      const { error: refundError } = await supabase
        .from('customers')
        .update({ reward_points: currentPoints + redemption.points_spent })
        .eq('id', redemption.customer_id);
      if (refundError) throw refundError;

      const { error } = await supabase.from('reward_redemptions').delete().eq('id', redemption.id);
      if (error) throw error;
      alert('Redemption rejected. Points have been refunded to the customer.');
      onUpdate();
    } catch (error) {
      console.error('Error rejecting redemption:', error);
      alert('Failed to reject redemption');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReward) {
        const { data, error } = await supabase.from('rewards').update(rewardForm).eq('id', editingReward.id).select();
        if (error) throw error;
        if (!data || data.length === 0) throw new Error('Update failed - no rows were modified. Check database permissions.');
        alert('Reward updated successfully!');
      } else {
        const { error } = await supabase.from('rewards').insert([rewardForm]);
        if (error) throw error;
        alert('Reward added successfully!');
      }
      setRewardForm(DEFAULT_REWARD_FORM);
      setEditingReward(null);
      onUpdate();
    } catch (error) {
      console.error('Error saving reward:', error);
      alert('Failed to save reward: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDelete = async (rewardId: string) => {
    if (!confirm('Are you sure you want to delete this reward? This action cannot be undone.')) return;
    try {
      const { error } = await supabase.from('rewards').delete().eq('id', rewardId);
      if (error) throw error;
      alert('Reward deleted successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error deleting reward:', error);
      alert('Failed to delete reward');
    }
  };

  const handleToggleActive = async (reward: Reward) => {
    try {
      const { data, error } = await supabase.from('rewards').update({ is_active: !reward.is_active }).eq('id', reward.id).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Update failed - no rows were modified. Check database permissions.');
      onUpdate();
    } catch (error) {
      console.error('Error toggling reward status:', error);
      alert('Failed to update reward status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleToggleRewardsEnabled = async (enabled: boolean) => {
    try {
      if (siteSettings) {
        const { error } = await supabase.from('site_settings').update({ rewards_enabled: enabled }).eq('id', siteSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert([{ rewards_enabled: enabled }]);
        if (error) throw error;
      }
      onUpdate();
    } catch (error) {
      console.error('Error updating rewards_enabled:', error);
      alert('Failed to update setting');
    }
  };

  return (
    <View className={styles.section}>
      <View className={styles.adminSplitLayout}>

        {/* Left column */}
        <View className={styles.adminLeftColumn}>

          {/* Code verification */}
          <View className={styles.verifyCodeForm}>
            <input
              type="text"
              className={styles.verifyCodeInput}
              placeholder="Enter 6-digit code"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button className={styles.confirmCodeButton} onClick={handleVerifyCode}>
              Confirm
            </button>
          </View>

          {/* Pending redemptions */}
          <Text className={styles.subsectionTitle}>
            Pending Redemptions ({pendingRedemptions.length})
          </Text>

          {pendingRedemptions.length > 0 && (
            <View className={styles.redemptionsList}>
              {pendingRedemptions.map((redemption) => (
                <View key={redemption.id} className={styles.redemptionCard}>
                  <View className={styles.redemptionInfo}>
                    <Text className={styles.redemptionCustomer}>
                      {redemption.customer?.first_name} {redemption.customer?.last_name}
                    </Text>
                    <Text className={styles.redemptionReward}>{redemption.reward?.name}</Text>
                    <Text className={styles.redemptionPoints}>{redemption.points_spent} points</Text>
                    <Text className={styles.redemptionDate}>
                      {new Date(redemption.redeemed_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View className={styles.redemptionRightSide}>
                    <View className={styles.redemptionCodeDisplay}>
                      <Text className={styles.redemptionCode}>{redemption.redemption_code}</Text>
                    </View>
                    <View className={styles.redemptionActions}>
                      <button
                        className={styles.confirmButton}
                        onClick={() => handleConfirmRedemption(redemption)}
                      >
                        Confirm
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={() => handleRejectRedemption(redemption)}
                      >
                        Reject
                      </button>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Rewards enabled toggle + rewards list */}
          <View className={styles.rewardsBorder} />
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={siteSettings?.rewards_enabled !== false}
              onChange={(e) => handleToggleRewardsEnabled(e.target.checked)}
            />
            <Text>Enable rewards program</Text>
          </label>

          {rewards.map((reward) => (
            <View key={reward.id} className={styles.barberCard}>
              <View className={styles.barberInfo}>
                <View className={styles.barberNameRow}>
                  <Text className={styles.barberName}>{reward.name}</Text>
                  <button
                    className={reward.is_active ? styles.activeToggleButton : styles.inactiveToggleButton}
                    onClick={() => handleToggleActive(reward)}
                  >
                    {reward.is_active ? '✓ Active' : 'Inactive'}
                  </button>
                </View>
                <Text className={styles.barberDetail}>
                  {reward.points_required} points
                  {reward.description && ` • ${reward.description}`}
                </Text>
              </View>
              <View className={styles.barberActions}>
                <button className={styles.editButton} onClick={() => handleEdit(reward)}>
                  Edit
                </button>
                <button className={styles.deleteButton} onClick={() => handleDelete(reward.id)}>
                  Delete
                </button>
              </View>
            </View>
          ))}
        </View>

        {/* Right column — add/edit reward form */}
        <View className={styles.adminRightColumn}>
          <div ref={formRef} className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              {editingReward ? 'Edit Reward' : '+ Add Reward'}
            </Text>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <View className={styles.formGroup}>
              <label className={styles.label}>Reward Name *</label>
              <input
                type="text"
                className={styles.input}
                value={rewardForm.name}
                onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                placeholder="e.g., Free Haircut"
                required
              />
            </View>

            <View className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={rewardForm.description}
                onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                placeholder="Brief description of the reward"
                rows={2}
              />
            </View>

            <View className={styles.formRow}>
              <View className={styles.formGroup}>
                <label className={styles.label}>Points Required *</label>
                <input
                  type="number"
                  min="1"
                  className={styles.input}
                  value={rewardForm.points_required}
                  onChange={(e) =>
                    setRewardForm({ ...rewardForm, points_required: parseInt(e.target.value) || 0 })
                  }
                  required
                />
              </View>

              <View className={styles.formGroup}>
                <label className={styles.label}>Reward Type *</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={rewardForm.reward_type}
                    onChange={(e) =>
                      setRewardForm({ ...rewardForm, reward_type: e.target.value as RewardType })
                    }
                    required
                  >
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                    <option value="merchandise">Merchandise</option>
                  </select>
                  <ChevronDown size={18} className={styles.selectIcon} />
                </div>
              </View>
            </View>

            <View className={styles.formRow}>
              <View className={styles.formGroup}>
                <label className={styles.label}>Item Name *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={rewardForm.item_name}
                  onChange={(e) => setRewardForm({ ...rewardForm, item_name: e.target.value })}
                  placeholder="e.g., Corte Fino Hoodie"
                  required
                />
              </View>

              <View>
                <label className={styles.label}>Sort Order</label>
                <input
                  type="number"
                  min="0"
                  className={styles.input}
                  value={rewardForm.sort_order}
                  onChange={(e) =>
                    setRewardForm({ ...rewardForm, sort_order: parseInt(e.target.value) || 0 })
                  }
                />
              </View>
            </View>

            <View className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={rewardForm.is_active}
                  onChange={(e) => setRewardForm({ ...rewardForm, is_active: e.target.checked })}
                />
                <Text>Active (visible to customers)</Text>
              </label>
            </View>

            <View className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {editingReward ? 'Update' : 'Add Reward'}
              </button>
              {editingReward && (
                <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </View>
          </form>
        </View>
      </View>
    </View>
  );
}
