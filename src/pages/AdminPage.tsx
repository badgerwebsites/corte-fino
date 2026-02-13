// pages/AdminPage.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { supabase } from '../lib/supabase';
import type { Barber, Service, BarberServicePricing, BarberAvailability, BarberTimeOff, RewardRedemptionWithDetails, Reward, RewardType, SiteSettings } from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { BarberScheduleManager } from '../components/BarberScheduleManager';
import { AdminCalendar } from '../components/AdminCalendar';
import { ImageUpload } from '../components/ImageUpload';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/admin.css';
import { ChevronDown } from "lucide-react";

export default function AdminPage() {
  const { user, customer } = useAuth();
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pricing, setPricing] = useState<BarberServicePricing[]>([]);
  const [availability, setAvailability] = useState<BarberAvailability[]>([]);
  const [timeOff, setTimeOff] = useState<BarberTimeOff[]>([]);
  const [pendingRedemptions, setPendingRedemptions] = useState<RewardRedemptionWithDetails[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'calendar' | 'pricing' | 'services' | 'barbers' | 'rewards' | 'settings'>('calendar');
  const [verifyCode, setVerifyCode] = useState('');

  // Barber form state
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [barberForm, setBarberForm] = useState({
    name: '',
    bio: '',
    phone: '',
    instagram_handle: '',
    facebook_url: '',
    tiktok_handle: '',
    image_url: '',
    is_active: true,
    regular_hours_start: '09:00',
    regular_hours_end: '17:00',
    evening_hours_start: '17:00',
    evening_hours_end: '21:00',
  });
  const barberFormRef = useRef<HTMLDivElement>(null);

  // Service form state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    duration_minutes: 45,
    reward_points: 10,
    image_url: '',
  });
  const serviceFormRef = useRef<HTMLDivElement>(null);

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
  const rewardFormRef = useRef<HTMLDivElement>(null);

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
      const [barbersRes, servicesRes, pricingRes, availabilityRes, timeOffRes, redemptionsRes, rewardsRes, settingsRes] = await Promise.all([
        supabase.from('barbers').select('*').order('name'),
        supabase.from('services').select('*').order('name'),
        supabase.from('barber_service_pricing').select('*'),
        supabase.from('barber_availability').select('*'),
        supabase.from('barber_time_off').select('*'),
        supabase.from('reward_redemptions').select(`
          *,
          customer:customers(*),
          reward:rewards(*)
        `).eq('fulfilled', false).order('redeemed_at', { ascending: false }),
        supabase.from('rewards').select('*').order('sort_order'),
        supabase.from('site_settings').select('*').single(),
      ]);

      if (barbersRes.error) throw barbersRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (pricingRes.error) throw pricingRes.error;
      if (redemptionsRes.error) throw redemptionsRes.error;
      if (rewardsRes.error) throw rewardsRes.error;

      setBarbers(barbersRes.data || []);
      setServices(servicesRes.data || []);
      setPricing(pricingRes.data || []);
      setAvailability(availabilityRes.data || []);
      setTimeOff(timeOffRes.data || []);
      setPendingRedemptions(redemptionsRes.data || []);
      setRewards(rewardsRes.data || []);
      setSiteSettings(settingsRes.data || null);
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
        image_url: '',
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
      image_url: service.image_url || '',
    });
    serviceFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        phone: '',
        instagram_handle: '',
        facebook_url: '',
        tiktok_handle: '',
        image_url: '',
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
      phone: barber.phone || '',
      instagram_handle: barber.instagram_handle || '',
      facebook_url: barber.facebook_url || '',
      tiktok_handle: barber.tiktok_handle || '',
      image_url: barber.image_url || '',
      is_active: barber.is_active,
      regular_hours_start: barber.regular_hours_start,
      regular_hours_end: barber.regular_hours_end,
      evening_hours_start: barber.evening_hours_start,
      evening_hours_end: barber.evening_hours_end,
    });
    barberFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    rewardFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Site Settings Management
  const handleSiteSettingChange = async (field: 'hero_background_url' | 'hero_logo_url' | 'hero_logo_2_url' | 'hero_logo_3_url' | 'nav_logo_1_url' | 'nav_logo_2_url' | 'nav_logo_3_url' | 'rewards_enabled', value: string | boolean | null) => {
    try {
      if (siteSettings) {
        // Update existing settings
        const { error } = await supabase
          .from('site_settings')
          .update({ [field]: value })
          .eq('id', siteSettings.id);

        if (error) throw error;
      } else {
        // Create new settings row
        const { error } = await supabase
          .from('site_settings')
          .insert([{ [field]: value }]);

        if (error) throw error;
      }

      loadData();
      if (field !== 'rewards_enabled') {
        const fieldName = field === 'hero_background_url' ? 'Hero background' : 'Hero logo';
        alert(`${fieldName} updated successfully!`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Failed to update setting`);
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
      {/* <View className={styles.header}>
        <Text className={styles.title}>Admin Dashboard</Text>
      </View> */}

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
        <button
          className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </View>

      {activeTab === 'calendar' && (
        // <View className={styles.section}>
          <AdminCalendar
            barbers={barbers}
            services={services}
            pricing={pricing}
            availability={availability}
            timeOff={timeOff}
            onBookingUpdate={loadData}
          />
        // </View>
      )}

      {activeTab === 'pricing' && (
        <View>
          {/* <Text className={styles.sectionTitle}>Set Prices by Barber & Time</Text> */}

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
                          step="0.25"
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
                          step="0.25"
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
            <div className={styles.adminSplitLayout}>
              <div className={styles.adminLeftColumn}>
              {/* CURRENT SERVICES LIST */}
                {services.map((service) => (
                  <View key={service.id} className={styles.barberCard}>
                    <View className={styles.barberInfo}>
                      <Text className={styles.barberName}>{service.name}</Text>
                      <Text className={styles.barberDetail}>
                        {service.duration_minutes} minutes • {service.reward_points} points
                      </Text>
                      {service.description && (
                        <Text className={styles.barberDetail}>
                          {service.description}
                        </Text>
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
              </div>

            {/* ADD / EDIT SERVICE FORM */}
            <div ref={serviceFormRef} className={styles.adminRightColumn}>
              <View className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>
                  {editingService ? 'Edit Service' : '+ Add Service'}
                </Text>
              </View>

              <form onSubmit={handleServiceSubmit} className={styles.form}>
                <View className={styles.formGroup}>
                  <label className={styles.label}>Service Name *</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={serviceForm.name}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, name: e.target.value })
                    }
                    placeholder="Type here..."
                    required
                  />
                </View>

                <View className={styles.formGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    value={serviceForm.description}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Type here..."
                    rows={2}
                  />
                </View>

                <ImageUpload
                  currentImageUrl={serviceForm.image_url || undefined}
                  onImageChange={(url) =>
                    setServiceForm({ ...serviceForm, image_url: url || '' })
                  }
                  bucket="service-images"
                  label="Service Image"
                />

                <View className={styles.formRow}>
                  <View className={styles.formGroup}>
                    <label className={styles.label}>Duration (minutes) *</label>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      className={styles.input}
                      value={serviceForm.duration_minutes}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          duration_minutes: parseInt(e.target.value),
                        })
                      }
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
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          reward_points: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </View>
                </View>

                <View className={styles.formActions}>
                  <button type="submit" className={styles.submitButton}>
                    {editingService ? 'Update' : 'Add Service'}
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
                          image_url: '',
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </View>
              </form>
            </div>
            </div>
          </View>
        )}


      {activeTab === 'barbers' && (
        <View className={styles.section}>
          <div className={styles.adminSplitLayout}>
            <div className={styles.adminLeftColumn}>
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
                        <Text>Inactive</Text>
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
          </div>

          {/* Add/Edit Barber Form */}
          <div ref={barberFormRef} className={styles.adminRightColumn}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>
                {editingBarber ? `Edit ${editingBarber.name}` : '+ Add Barber'}
              </Text>
            </View>

          <form onSubmit={handleBarberSubmit} className={styles.form}>
            <ImageUpload
              currentImageUrl={barberForm.image_url || undefined}
              onImageChange={(url) => setBarberForm({ ...barberForm, image_url: url || '' })}
              bucket="barber-images"
              label="Profile Picture"
            />

            <View className={styles.formGroup}>
              <label className={styles.label}>Name *</label>
              <input
                type="text"
                className={styles.input}
                value={barberForm.name}
                onChange={(e) => setBarberForm({ ...barberForm, name: e.target.value })}
                placeholder="Type here..."
                required
              />
            </View>

            <View className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                className={styles.input}
                placeholder="(555) 123-4567"
                value={barberForm.phone}
                onChange={(e) => setBarberForm({ ...barberForm, phone: e.target.value })}
              />
            </View>

            <View className={styles.formGroup}>
              <label className={styles.label}>Bio</label>
              <textarea
                className={styles.textarea}
                value={barberForm.bio}
                onChange={(e) => setBarberForm({ ...barberForm, bio: e.target.value })}
                placeholder="Type here..."
                rows={3}
              />
            </View>

            <View className={styles.formRow}>
              <View className={styles.formGroup}>
                <label className={styles.label}>Instagram</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="username"
                  value={barberForm.instagram_handle}
                  onChange={(e) => setBarberForm({ ...barberForm, instagram_handle: e.target.value })}
                />
              </View>

              <View className={styles.formGroup}>
                <label className={styles.label}>TikTok</label>
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

            <View>
              <Text className={styles.pricingPeriodsTitle}>
                Set Regular and Evening Pricing
              </Text>

              <View className={styles.pricingTimeline}>
                <View className={styles.pricingTimeBlock}>
                  <label className={styles.pricingTimeLabel}>Regular Starts</label>
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={barberForm.regular_hours_start}
                    onChange={(e) => setBarberForm({ ...barberForm, regular_hours_start: e.target.value })}
                  />
                </View>

                <View className={styles.pricingTimeArrow}>→</View>

                <View className={styles.pricingTimeBlock}>
                  <label className={styles.pricingTimeLabel}>Evening Starts</label>
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={barberForm.regular_hours_end}
                    onChange={(e) => setBarberForm({
                      ...barberForm,
                      regular_hours_end: e.target.value,
                      evening_hours_start: e.target.value
                    })}
                  />
                </View>

                <View className={styles.pricingTimeArrow}>→</View>

                <View className={styles.pricingTimeBlock}>
                  <label className={styles.pricingTimeLabel}>Evening Ends</label>
                  <input
                    type="time"
                    className={styles.timeInput}
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
                  className={styles.checkbox}
                  checked={barberForm.is_active}
                  onChange={(e) => setBarberForm({ ...barberForm, is_active: e.target.checked })}
                />
                <Text>Active (accepting bookings)</Text>
              </label>
            </View>

            <View className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {editingBarber ? 'Update' : 'Add Barber'}
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
                      phone: '',
                      instagram_handle: '',
                      facebook_url: '',
                      tiktok_handle: '',
                      image_url: '',
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
          
          {editingBarber && (
            <View className={styles.adminDivider}>
              <BarberScheduleManager
                barbers={[editingBarber]}
                onUpdate={loadData}
              />
            </View>
          )}
          </div>
          </div>
        </View>
      )}

      {activeTab === 'settings' && (
        <View className={styles.section}>
            {/* Navigation Carousel Logos */}
            <View className={styles.formGroup}>
              <View className={styles.sectionHeader}>
                <Text className={styles.subsectionTitle}>Navigation Logos (Carousel)</Text>
              </View>
                <Text className={styles.sectionDescription}>
                  These logos rotate in the navigation bar. Use "Hide" to remove a logo from the carousel. Note: Refresh the page after making changes to see updates in the navigation.
                </Text>

              <View className={styles.logoGrid}>
                <View className={styles.logoGridItem}>
                  <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                </View>
                  {siteSettings?.nav_logo_1_url !== 'HIDDEN' && (
                    <ImageUpload
                      currentImageUrl={siteSettings?.nav_logo_1_url && siteSettings.nav_logo_1_url !== 'HIDDEN' ? siteSettings.nav_logo_1_url : undefined}
                      onImageChange={(url) => handleSiteSettingChange('nav_logo_1_url', url)}
                      bucket="site-images"
                      label="Nav Logo 1"
                    />
                  )}
                </View>

                <View className={styles.logoGridItem}>
                  <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                </View>
                  {siteSettings?.nav_logo_2_url !== 'HIDDEN' && (
                    <ImageUpload
                      currentImageUrl={siteSettings?.nav_logo_2_url && siteSettings.nav_logo_2_url !== 'HIDDEN' ? siteSettings.nav_logo_2_url : undefined}
                      onImageChange={(url) => handleSiteSettingChange('nav_logo_2_url', url)}
                      bucket="site-images"
                      label="Nav Logo 2"
                    />
                  )}
                </View>

                <View className={styles.logoGridItem}>
                  <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                </View>
                  {siteSettings?.nav_logo_3_url !== 'HIDDEN' && (
                    <ImageUpload
                      currentImageUrl={siteSettings?.nav_logo_3_url && siteSettings.nav_logo_3_url !== 'HIDDEN' ? siteSettings.nav_logo_3_url : undefined}
                      onImageChange={(url) => handleSiteSettingChange('nav_logo_3_url', url)}
                      bucket="site-images"
                      label="Nav Logo 3"
                    />
                  )}
                </View>
              </View>
            </View>

            {/* Hero Section */}
            <View className={styles.formGroup}>
              <View className={styles.sectionHeader}>
                <Text className={styles.subsectionTitle}>Hero Logos (Carousel)</Text>
              </View>
              <Text className={styles.sectionDescription}>
                Add multiple logos to create a rotating carousel on the home page hero section. Upload at least 2 logos to enable the carousel.
              </Text>
              <View className={styles.logoGrid}>
                <View className={styles.logoGridItem}>
                  <ImageUpload
                    currentImageUrl={siteSettings?.hero_logo_url || undefined}
                    onImageChange={(url) => handleSiteSettingChange('hero_logo_url', url)}
                    bucket="site-images"
                    label="Hero Logo 1"
                  />
                </View>
                <View className={styles.logoGridItem}>
                  <ImageUpload
                    currentImageUrl={siteSettings?.hero_logo_2_url || undefined}
                    onImageChange={(url) => handleSiteSettingChange('hero_logo_2_url', url)}
                    bucket="site-images"
                    label="Hero Logo 2"
                  />
                </View>
                <View className={styles.logoGridItem}>
                  <ImageUpload
                    currentImageUrl={siteSettings?.hero_logo_3_url || undefined}
                    onImageChange={(url) => handleSiteSettingChange('hero_logo_3_url', url)}
                    bucket="site-images"
                    label="Hero Logo 3"
                  />
                </View>
              </View>
            </View>

            <View className={styles.formGroup}>
              <View className={styles.sectionHeader}>
                <Text className={styles.subsectionTitle}>Hero Background</Text>
              </View>
              <Text className={styles.sectionDescription}>
                The background image that appears behind the logo on the home page.
              </Text>
              <View style={{ marginTop: '1rem' }}>
                <ImageUpload
                  currentImageUrl={siteSettings?.hero_background_url || undefined}
                  onImageChange={(url) => handleSiteSettingChange('hero_background_url', url)}
                  bucket="site-images"
                  label="Hero Background"
                />
              </View>
            </View>
          </View>
      )}

      {activeTab === 'rewards' && (
        <View className={styles.section}>
          <View className={styles.adminSplitLayout}>

          {/* LEFT COLUMN */}
          <View className={styles.adminLeftColumn}>

          {/* Code Entry */}
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

          {/* Pending Redemptions */}
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

          <View className={styles.rewardsBorder} />
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={siteSettings?.rewards_enabled !== false}
                onChange={(e) => handleSiteSettingChange('rewards_enabled', e.target.checked)}
              />
            <Text>Enable rewards program</Text>
            </label>

            {rewards.length > 0 && (
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

          {/* Manage Rewards */}
          <View className={styles.adminRightColumn}>
            <div ref={rewardFormRef} className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>
                {editingReward ? 'Edit Reward' : 'Add New Reward'}
              </Text>
            </div>

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

                  <div className={styles.selectWrapper}>
                    <select
                      className={styles.select}
                      value={rewardForm.reward_type}
                      onChange={(e) =>
                        setRewardForm({
                          ...rewardForm,
                          reward_type: e.target.value as RewardType,
                        })
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
                    onChange={(e) => setRewardForm({ ...rewardForm, sort_order: parseInt(e.target.value) || 0 })}
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

            </View>
          </View>
        </View>
      )}
    </View>
    </>
  );
}
