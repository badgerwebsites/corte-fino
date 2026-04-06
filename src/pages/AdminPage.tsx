// pages/AdminPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { supabase } from '../lib/supabase';
import type {
  Barber,
  BarberService,
  Service,
  BarberServicePricing,
  BarberAvailability,
  BarberTimeOff,
  RewardRedemptionWithDetails,
  Reward,
  SiteSettings,
} from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { AdminCalendar } from '../components/admin/AdminCalendar';
import { PricingTab } from '../components/admin/PricingTab';
import { ServicesTab } from '../components/admin/ServicesTab';
import { BarbersTab } from '../components/admin/BarbersTab';
import { SettingsTab } from '../components/admin/SettingsTab';
import { RewardsTab } from '../components/admin/RewardsTab';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/admin.css';

type AdminTab = 'calendar' | 'pricing' | 'services' | 'barbers' | 'rewards' | 'settings';

const isAdminTab = (value: string): value is AdminTab =>
  ['calendar', 'pricing', 'services', 'barbers', 'rewards', 'settings'].includes(value);

export default function AdminPage() {
  const { user, customer, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barberServices, setBarberServices] = useState<BarberService[]>([]);
  const [pricing, setPricing] = useState<BarberServicePricing[]>([]);
  const [availability, setAvailability] = useState<BarberAvailability[]>([]);
  const [timeOff, setTimeOff] = useState<BarberTimeOff[]>([]);
  const [pendingRedemptions, setPendingRedemptions] = useState<RewardRedemptionWithDetails[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    const saved = localStorage.getItem('adminActiveTab');
    return saved && isAdminTab(saved) ? saved : 'calendar';
  });

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login', { replace: true }); return; }
    if (customer && !customer.is_admin) { navigate('/dashboard', { replace: true }); return; }
    loadData();
  }, [user, customer, authLoading, navigate]);

  const loadData = async () => {
    try {
      const [
        barbersRes, servicesRes, barberServicesRes, pricingRes, availabilityRes, timeOffRes,
        redemptionsRes, rewardsRes, settingsRes,
      ] = await Promise.all([
        supabase.from('barbers').select('*').order('name'),
        supabase.from('services').select('*').order('name'),
        supabase.from('barber_services').select('*'),
        supabase.from('barber_service_pricing').select('*'),
        supabase.from('barber_availability').select('*'),
        supabase.from('barber_time_off').select('*'),
        supabase.from('reward_redemptions').select(`*, customer:customers(*), reward:rewards(*)`)
          .eq('fulfilled', false).order('redeemed_at', { ascending: false }),
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
      setBarberServices(barberServicesRes.data || []);
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

        {/* Tab bar */}
        <View className={styles.tabs}>
          {(['calendar', 'pricing', 'services', 'barbers', 'rewards', 'settings'] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'rewards' && pendingRedemptions.length > 0 && (
                <span className={styles.tabBadge}>{pendingRedemptions.length}</span>
              )}
            </button>
          ))}
        </View>

        {/* Tab content */}
        {activeTab === 'calendar' && (
          <AdminCalendar
            barbers={barbers}
            services={services}
            pricing={pricing}
            availability={availability}
            timeOff={timeOff}
            onBookingUpdate={loadData}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingTab
            services={services}
            barbers={barbers}
            barberServices={barberServices}
            pricing={pricing}
            onUpdate={loadData}
          />
        )}

        {activeTab === 'services' && (
          <ServicesTab
            services={services}
            onUpdate={loadData}
          />
        )}

        {activeTab === 'barbers' && (
          <BarbersTab
            barbers={barbers}
            onUpdate={loadData}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            siteSettings={siteSettings}
            onUpdate={loadData}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsTab
            pendingRedemptions={pendingRedemptions}
            rewards={rewards}
            siteSettings={siteSettings}
            onUpdate={loadData}
          />
        )}

      </View>
    </>
  );
}
