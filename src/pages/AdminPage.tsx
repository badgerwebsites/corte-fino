// pages/AdminPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { supabase } from '../lib/supabase';
import type { Barber, Service, BarberServicePricing, RewardRedemptionWithDetails, Reward, RewardType } from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { BarberScheduleManager } from '../components/BarberScheduleManager';
import { AdminCalendar } from '../components/AdminCalendar';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/admin.css';

export default function AdminPage() {
  const { user, customer } = useAuth();
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pricing, setPricing] = useState<BarberServicePricing[]>([]);
  const [pendingRedemptions, setPendingRedemptions] = useState<RewardRedemptionWithDetails[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'pricing' | 'services' | 'barbers' | 'rewards'>('calendar');
  const [verifyCode, setVerifyCode] = useState('');

  // Barber form state
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [barberForm, setBarberForm] = useState({
    name: '',
    bio: '',
    instagram_handle: '',
    facebook_url: '',
    tiktok_handle: '',
    is_active: true,
    regular_hours_start: '09:00',
    regular_hours_end: '17:00',
    evening_hours_start: '17:00',
    evening_hours_end: '21:00',
  });

  // Service form state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    duration_minutes: 45,
    reward_points: 10,
  });

  // Reward form state
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [rewardForm, setRewardForm] = useState({
    name: '',
    description: '',
    points_required: 100,
    reward_type: 'product' as RewardType,
    item_name: '',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (customer && !customer.is_admin) {
      navigate('/dashboard');
      return;
    }

    loadData();
  }, [user, customer, navigate]);

  const loadData = async () => {
    try {
      const [barbersRes, servicesRes, pricingRes, redemptionsRes, rewardsRes] = await Promise.all([
        supabase.from('barbers').select('*').order('name'),
        supabase.from('services').select('*').order('name'),
        supabase.from('barber_service_pricing').select('*'),
        supabase.from('reward_redemptions').select(`
          *,
          customer:customers(*),
          reward:rewards(*)
        `).eq('fulfilled', false).order('redeemed_at', { ascending: false }),
        supabase.from('rewards').select('*').order('sort_order'),
      ]);

      if (barbersRes.error) throw barbersRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (pricingRes.error) throw pricingRes.error;
      if (redemptionsRes.error) throw redemptionsRes.error;
      if (rewardsRes.error) throw rewardsRes.error;

      setBarbers(barbersRes.data || []);
      setServices(servicesRes.data || []);
      setPricing(pricingRes.data || []);
      setPendingRedemptions(redemptionsRes.data || []);
      setRewards(rewardsRes.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeShort = (time: string): string => {
    const [hours] = time.split(':').map(Number);
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}${period}`;
  };

  const getPrice = (barberId: string, serviceId: string, timePeriod: 'regular' | 'evening'): number => {
    const priceEntry = pricing.find(
      p => p.barber_id === barberId && p.service_id === serviceId && p.time_period === timePeriod
    );
    return priceEntry?.price || 0;
  };

  const handlePriceUpdate = async (barberId: string, serviceId: string, timePeriod: 'regular' | 'evening', newPrice: number) => {
    try {
      const existingPrice = pricing.find(
        p => p.barber_id === barberId && p.service_id === serviceId && p.time_period === timePeriod
      );

      if (existingPrice) {
        const { error } = await supabase
          .from('barber_service_pricing')
          .update({ price: newPrice })
          .eq('id', existingPrice.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('barber_service_pricing')
          .insert({
            barber_id: barberId,
            service_id: serviceId,
            time_period: timePeriod,
            price: newPrice,
          });

        if (error) throw error;
      }

      loadData();
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Failed to update price');
    }
  };


  // Service Management
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceForm)
          .eq('id', editingService.id);

        if (error) throw error;
        alert('Service updated successfully!');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([{ ...serviceForm, base_price: 0 }]);

        if (error) throw error;
        alert('Service added successfully!');
      }

      setServiceForm({
        name: '',
        description: '',
        duration_minutes: 45,
        reward_points: 10,
      });
      setEditingService(null);
      loadData();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description || '',
      duration_minutes: service.duration_minutes,
      reward_points: service.reward_points,
    });
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This will also delete all pricing for this service. This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      alert('Service deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  // Barber Management
  const handleBarberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBarber) {
        const { error } = await supabase
          .from('barbers')
          .update(barberForm)
          .eq('id', editingBarber.id);

        if (error) throw error;
        alert('Barber updated successfully!');
      } else {
        const { error } = await supabase
          .from('barbers')
          .insert([{ ...barberForm, base_price_multiplier: 1.0 }]);

        if (error) throw error;
        alert('Barber added successfully!');
      }

      setBarberForm({
        name: '',
        bio: '',
        instagram_handle: '',
        facebook_url: '',
        tiktok_handle: '',
        is_active: true,
        regular_hours_start: '09:00',
        regular_hours_end: '17:00',
        evening_hours_start: '17:00',
        evening_hours_end: '21:00',
      });
      setEditingBarber(null);
      loadData();
    } catch (error) {
      console.error('Error saving barber:', error);
      alert('Failed to save barber');
    }
  };

  const handleEditBarber = (barber: Barber) => {
    setEditingBarber(barber);
    setBarberForm({
      name: barber.name,
      bio: barber.bio || '',
      instagram_handle: barber.instagram_handle || '',
      facebook_url: barber.facebook_url || '',
      tiktok_handle: barber.tiktok_handle || '',
      is_active: barber.is_active,
      regular_hours_start: barber.regular_hours_start,
      regular_hours_end: barber.regular_hours_end,
      evening_hours_start: barber.evening_hours_start,
      evening_hours_end: barber.evening_hours_end,
    });
  };

  const handleDeleteBarber = async (barberId: string) => {
    if (!confirm('Are you sure you want to delete this barber? This will also delete all their pricing. This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('barbers')
        .delete()
        .eq('id', barberId);

      if (error) throw error;
      alert('Barber deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting barber:', error);
      alert('Failed to delete barber');
    }
  };

  const handleToggleBarberActive = async (barber: Barber) => {
    try {
      const { error } = await supabase
        .from('barbers')
        .update({ is_active: !barber.is_active })
        .eq('id', barber.id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error toggling barber status:', error);
      alert('Failed to update barber status');
    }
  };

  // Reward Redemption Management
  const handleConfirmRedemption = async (redemption: RewardRedemptionWithDetails) => {
    if (!confirm(`Confirm redemption for ${redemption.reward?.name}?`)) {
      return;
    }

    try {
      // Mark redemption as fulfilled (points already deducted when customer redeemed)
      const { error: redemptionError } = await supabase
        .from('reward_redemptions')
        .update({ fulfilled: true, fulfilled_at: new Date().toISOString() })
        .eq('id', redemption.id);

      if (redemptionError) throw redemptionError;

      alert('Redemption confirmed!');
      loadData();
    } catch (error) {
      console.error('Error confirming redemption:', error);
      alert('Failed to confirm redemption');
    }
  };

  const handleVerifyCode = async () => {
    const code = verifyCode.trim().toUpperCase();
    if (!code) {
      alert('Please enter a redemption code');
      return;
    }

    const redemption = pendingRedemptions.find(r => r.redemption_code === code);
    if (!redemption) {
      alert('Invalid or already used redemption code');
      return;
    }

    handleConfirmRedemption(redemption);
    setVerifyCode('');
  };

  const handleRejectRedemption = async (redemption: RewardRedemptionWithDetails) => {
    if (!confirm('Reject this redemption? The customer\'s points will be refunded.')) {
      return;
    }

    try {
      // Refund points to customer
      const currentPoints = redemption.customer?.reward_points || 0;
      const { error: refundError } = await supabase
        .from('customers')
        .update({ reward_points: currentPoints + redemption.points_spent })
        .eq('id', redemption.customer_id);

      if (refundError) throw refundError;

      // Delete the redemption
      const { error } = await supabase
        .from('reward_redemptions')
        .delete()
        .eq('id', redemption.id);

      if (error) throw error;
      alert('Redemption rejected. Points have been refunded to the customer.');
      loadData();
    } catch (error) {
      console.error('Error rejecting redemption:', error);
      alert('Failed to reject redemption');
    }
  };

  // Reward Management
  const handleRewardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingReward) {
        const { data, error } = await supabase
          .from('rewards')
          .update(rewardForm)
          .eq('id', editingReward.id)
          .select();

        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error('Update failed - no rows were modified. Check database permissions.');
        }
        alert('Reward updated successfully!');
      } else {
        const { error } = await supabase
          .from('rewards')
          .insert([rewardForm]);

        if (error) throw error;
        alert('Reward added successfully!');
      }

      setRewardForm({
        name: '',
        description: '',
        points_required: 100,
        reward_type: 'product',
        item_name: '',
        is_active: true,
        sort_order: 0,
      });
      setEditingReward(null);
      loadData();
    } catch (error) {
      console.error('Error saving reward:', error);
      alert('Failed to save reward: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEditReward = (reward: Reward) => {
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

  const handleDeleteReward = async (rewardId: string) => {
    if (!confirm('Are you sure you want to delete this reward? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('rewards')
        .delete()
        .eq('id', rewardId);

      if (error) throw error;
      alert('Reward deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting reward:', error);
      alert('Failed to delete reward');
    }
  };

  const handleToggleRewardActive = async (reward: Reward) => {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .update({ is_active: !reward.is_active })
        .eq('id', reward.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Update failed - no rows were modified. Check database permissions.');
      }
      loadData();
    } catch (error) {
      console.error('Error toggling reward status:', error);
      alert('Failed to update reward status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <View className={styles.container}>
          <Text>Loading admin panel...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>Admin Dashboard</Text>
        <button
          className={styles.backLink}
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/login');
          }}
        >
          Log Out →
        </button>
      </View>

      <View className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'calendar' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'pricing' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'services' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Services
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'barbers' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('barbers')}
        >
          Barbers
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'rewards' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          Rewards
          {pendingRedemptions.length > 0 && (
            <span className={styles.tabBadge}>{pendingRedemptions.length}</span>
          )}
        </button>
      </View>

      {activeTab === 'calendar' && (
        <View className={styles.section}>
          <AdminCalendar barbers={barbers} onBookingUpdate={loadData} />
        </View>
      )}

      {activeTab === 'pricing' && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>Set Prices by Barber & Time</Text>

          {services.map((service) => (
            <View key={service.id} className={styles.serviceSection}>
              <Text className={styles.serviceSectionTitle}>
                {service.name} ({service.duration_minutes} min)
              </Text>

              <View className={styles.pricingGrid}>
                {barbers.map((barber) => (
                  <View key={barber.id} className={styles.pricingRow}>
                    <Text className={styles.barberNameCell}>{barber.name}</Text>

                    <View className={styles.priceInputWrapper}>
                      <Text className={styles.priceInputLabel}>Regular <span className={styles.priceTimeHint}>{formatTimeShort(barber.regular_hours_start)}–{formatTimeShort(barber.regular_hours_end)}</span></Text>
                      <View className={styles.priceInputCell}>
                        <Text className={styles.dollarSign}>$</Text>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={styles.priceInput}
                          value={getPrice(barber.id, service.id, 'regular') || ''}
                          onChange={(e) => handlePriceUpdate(
                            barber.id,
                            service.id,
                            'regular',
                            parseFloat(e.target.value) || 0
                          )}
                          placeholder="0"
                        />
                      </View>
                    </View>

                    <View className={styles.priceInputWrapper}>
                      <Text className={styles.priceInputLabel}>Evening <span className={styles.priceTimeHint}>{formatTimeShort(barber.evening_hours_start)}–{formatTimeShort(barber.evening_hours_end)}</span></Text>
                      <View className={styles.priceInputCell}>
                        <Text className={styles.dollarSign}>$</Text>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={styles.priceInput}
                          value={getPrice(barber.id, service.id, 'evening') || ''}
                          onChange={(e) => handlePriceUpdate(
                            barber.id,
                            service.id,
                            'evening',
                            parseFloat(e.target.value) || 0
                          )}
                          placeholder="0"
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'services' && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </Text>
          </View>

          <form onSubmit={handleServiceSubmit} className={styles.form}>
            <View className={styles.formGroup}>
              <label className={styles.label}>Service Name *</label>
              <input
                type="text"
                className={styles.input}
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                required
              />
            </View>

            <View className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                rows={2}
              />
            </View>

            <View className={styles.formRow}>
              <View className={styles.formGroup}>
                <label className={styles.label}>Duration (minutes) *</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  className={styles.input}
                  value={serviceForm.duration_minutes}
                  onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: parseInt(e.target.value) })}
                  required
                />
              </View>

              <View className={styles.formGroup}>
                <label className={styles.label}>Reward Points *</label>
                <input
                  type="number"
                  min="0"
                  className={styles.input}
                  value={serviceForm.reward_points}
                  onChange={(e) => setServiceForm({ ...serviceForm, reward_points: parseInt(e.target.value) })}
                  required
                />
              </View>
            </View>

            <View className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
              {editingService && (
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setEditingService(null);
                    setServiceForm({
                      name: '',
                      description: '',
                      duration_minutes: 45,
                      reward_points: 10,
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </View>
          </form>

          <View className={styles.barbersList}>
            <Text className={styles.sectionTitle}>Current Services</Text>
            {services.map((service) => (
              <View key={service.id} className={styles.barberCard}>
                <View className={styles.barberInfo}>
                  <Text className={styles.barberName}>{service.name}</Text>
                  <Text className={styles.barberDetail}>
                    {service.duration_minutes} minutes • {service.reward_points} points
                  </Text>
                  {service.description && (
                    <Text className={styles.barberDetail}>{service.description}</Text>
                  )}
                </View>
                <View className={styles.barberActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditService(service)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteService(service.id)}
                  >
                    Delete
                  </button>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {activeTab === 'barbers' && (
        <View className={styles.section}>
          {/* Current Barbers List */}
          <View className={styles.barbersList}>
            <Text className={styles.sectionTitle}>Current Barbers</Text>
            {barbers.map((barber) => (
              <View key={barber.id} className={styles.barberCard}>
                <View className={styles.barberInfo}>
                  <View className={styles.barberNameRow}>
                    <Text className={styles.barberName}>{barber.name}</Text>
                    {barber.is_active && (
                      <View className={styles.statusBadge}>
                        <Text>✓ Active</Text>
                      </View>
                    )}
                    {!barber.is_active && (
                      <View className={styles.statusBadgeInactive}>
                        <Text>✗ Inactive</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View className={styles.barberActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEditBarber(barber)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.toggleButton}
                    onClick={() => handleToggleBarberActive(barber)}
                  >
                    {barber.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteBarber(barber.id)}
                  >
                    Delete
                  </button>
                </View>
              </View>
            ))}
          </View>

          {/* Add/Edit Barber Form */}
          <View className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
            <Text className={styles.sectionTitle}>
              {editingBarber ? 'Edit Barber' : 'Add New Barber'}
            </Text>
          </View>

          <form onSubmit={handleBarberSubmit} className={styles.form}>
            <View className={styles.formGroup}>
              <label className={styles.label}>Name *</label>
              <input
                type="text"
                className={styles.input}
                value={barberForm.name}
                onChange={(e) => setBarberForm({ ...barberForm, name: e.target.value })}
                required
              />
            </View>

            <View className={styles.formGroup}>
              <label className={styles.label}>Bio</label>
              <textarea
                className={styles.textarea}
                value={barberForm.bio}
                onChange={(e) => setBarberForm({ ...barberForm, bio: e.target.value })}
                rows={3}
              />
            </View>

            <View className={styles.formRow}>
              <View className={styles.formGroup}>
                <label className={styles.label}>Instagram Handle</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="username"
                  value={barberForm.instagram_handle}
                  onChange={(e) => setBarberForm({ ...barberForm, instagram_handle: e.target.value })}
                />
              </View>

              <View className={styles.formGroup}>
                <label className={styles.label}>TikTok Handle</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="username"
                  value={barberForm.tiktok_handle}
                  onChange={(e) => setBarberForm({ ...barberForm, tiktok_handle: e.target.value })}
                />
              </View>
            </View>

            <View className={styles.formGroup}>
              <label className={styles.label}>Facebook URL</label>
              <input
                type="url"
                className={styles.input}
                placeholder="https://facebook.com/..."
                value={barberForm.facebook_url}
                onChange={(e) => setBarberForm({ ...barberForm, facebook_url: e.target.value })}
              />
            </View>

            <View className={styles.pricingPeriodsCard}>
              <Text className={styles.pricingPeriodsTitle}>Pricing Time Periods</Text>
              <Text className={styles.pricingPeriodsHint}>
                Set when regular and evening pricing applies
              </Text>

              <View className={styles.pricingTimeline}>
                <View className={styles.pricingTimeBlock}>
                  <label className={styles.pricingTimeLabel}>Regular Starts</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={barberForm.regular_hours_start}
                    onChange={(e) => setBarberForm({ ...barberForm, regular_hours_start: e.target.value })}
                  />
                  <span className={`${styles.pricingPeriodBadge} ${styles.regularBadge}`}>Regular pricing</span>
                </View>

                <View className={styles.pricingTimeArrow}>→</View>

                <View className={styles.pricingTimeBlock}>
                  <label className={styles.pricingTimeLabel}>Evening Starts</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={barberForm.regular_hours_end}
                    onChange={(e) => setBarberForm({
                      ...barberForm,
                      regular_hours_end: e.target.value,
                      evening_hours_start: e.target.value
                    })}
                  />
                  <span className={`${styles.pricingPeriodBadge} ${styles.eveningBadge}`}>Evening pricing</span>
                </View>

                <View className={styles.pricingTimeArrow}>→</View>

                <View className={styles.pricingTimeBlock}>
                  <label className={styles.pricingTimeLabel}>Evening Ends</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={barberForm.evening_hours_end}
                    onChange={(e) => setBarberForm({ ...barberForm, evening_hours_end: e.target.value })}
                  />
                </View>
              </View>
            </View>

            <View className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={barberForm.is_active}
                  onChange={(e) => setBarberForm({ ...barberForm, is_active: e.target.checked })}
                />
                <Text>Active (accepting bookings)</Text>
              </label>
            </View>

            <View className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {editingBarber ? 'Update Barber' : 'Add Barber'}
              </button>
              {editingBarber && (
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setEditingBarber(null);
                    setBarberForm({
                      name: '',
                      bio: '',
                      instagram_handle: '',
                      facebook_url: '',
                      tiktok_handle: '',
                      is_active: true,
                      regular_hours_start: '09:00',
                      regular_hours_end: '17:00',
                      evening_hours_start: '17:00',
                      evening_hours_end: '21:00',
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </View>
          </form>

          {/* Schedule Management - only show when editing a barber */}
          {editingBarber && (
            <View style={{ marginTop: '3rem' }}>
              <BarberScheduleManager barbers={[editingBarber]} onUpdate={loadData} />
            </View>
          )}
        </View>
      )}

      {activeTab === 'rewards' && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View>
              <Text className={styles.sectionTitle}>Verify Reward Redemptions</Text>
              <Text className={styles.sectionDescription}>
                Enter a customer's redemption code or select from pending redemptions below
              </Text>
            </View>
          </View>

          {/* Code Entry */}
          <View className={styles.verifyCodeSection}>
            <View className={styles.verifyCodeForm}>
              <input
                type="text"
                className={styles.verifyCodeInput}
                placeholder="Enter 6-digit code"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
                maxLength={6}
              />
              <button
                className={styles.verifyCodeButton}
                onClick={handleVerifyCode}
              >
                Verify & Confirm
              </button>
            </View>
          </View>

          {/* Pending Redemptions */}
          <View className={styles.pendingRedemptionsSection}>
            <Text className={styles.subsectionTitle}>
              Pending Redemptions ({pendingRedemptions.length})
            </Text>

            {pendingRedemptions.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyStateText}>No pending redemptions</Text>
              </View>
            ) : (
              <View className={styles.redemptionsList}>
                {pendingRedemptions.map((redemption) => (
                  <View key={redemption.id} className={styles.redemptionCard}>
                    <View className={styles.redemptionInfo}>
                      <Text className={styles.redemptionCustomer}>
                        {redemption.customer?.first_name} {redemption.customer?.last_name}
                      </Text>
                      <Text className={styles.redemptionReward}>
                        {redemption.reward?.name}
                      </Text>
                      <Text className={styles.redemptionPoints}>
                        {redemption.points_spent} points
                      </Text>
                      <Text className={styles.redemptionDate}>
                        {new Date(redemption.redeemed_at).toLocaleDateString()}
                      </Text>
                    </View>
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
                ))}
              </View>
            )}
          </View>

          {/* Manage Rewards */}
          <View className={styles.rewardsManagementSection}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>
                {editingReward ? 'Edit Reward' : 'Add New Reward'}
              </Text>
            </View>

            <form onSubmit={handleRewardSubmit} className={styles.form}>
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
                    onChange={(e) => setRewardForm({ ...rewardForm, points_required: parseInt(e.target.value) || 0 })}
                    required
                  />
                </View>

                <View className={styles.formGroup}>
                  <label className={styles.label}>Reward Type *</label>
                  <select
                    className={styles.select}
                    value={rewardForm.reward_type}
                    onChange={(e) => setRewardForm({ ...rewardForm, reward_type: e.target.value as RewardType })}
                    required
                  >
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                    <option value="merchandise">Merchandise</option>
                  </select>
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

                <View className={styles.formGroup}>
                  <label className={styles.label}>Sort Order</label>
                  <input
                    type="number"
                    min="0"
                    className={styles.input}
                    value={rewardForm.sort_order}
                    onChange={(e) => setRewardForm({ ...rewardForm, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </View>
              </View>

              <View className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rewardForm.is_active}
                    onChange={(e) => setRewardForm({ ...rewardForm, is_active: e.target.checked })}
                  />
                  <Text>Active (visible to customers)</Text>
                </label>
              </View>

              <View className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingReward ? 'Update Reward' : 'Add Reward'}
                </button>
                {editingReward && (
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setEditingReward(null);
                      setRewardForm({
                        name: '',
                        description: '',
                        points_required: 100,
                        reward_type: 'product',
                        item_name: '',
                        is_active: true,
                        sort_order: 0,
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </View>
            </form>

            <View className={styles.barbersList}>
              <Text className={styles.sectionTitle}>Current Rewards</Text>
              {rewards.length === 0 ? (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyStateText}>No rewards configured yet</Text>
                </View>
              ) : (
                rewards.map((reward) => (
                  <View key={reward.id} className={styles.barberCard}>
                    <View className={styles.barberInfo}>
                      <View className={styles.barberNameRow}>
                        <Text className={styles.barberName}>{reward.name}</Text>
                        {reward.is_active ? (
                          <View className={styles.statusBadge}>
                            <Text>Active</Text>
                          </View>
                        ) : (
                          <View className={styles.statusBadgeInactive}>
                            <Text>Inactive</Text>
                          </View>
                        )}
                      </View>
                      <Text className={styles.barberDetail}>
                        {reward.points_required} points · {reward.reward_type} · {reward.item_name}
                      </Text>
                      {reward.description && (
                        <Text className={styles.barberDetail}>{reward.description}</Text>
                      )}
                    </View>
                    <View className={styles.barberActions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditReward(reward)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.toggleButton}
                        onClick={() => handleToggleRewardActive(reward)}
                      >
                        {reward.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteReward(reward.id)}
                      >
                        Delete
                      </button>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      )}
    </View>
    </>
  );
}
