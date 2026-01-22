import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Barber, Service, BarberServicePricing } from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/admin.css';

export default function AdminPage() {
  const { user, customer } = useAuth();
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pricing, setPricing] = useState<BarberServicePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pricing' | 'services' | 'barbers'>('pricing');

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
      const [barbersRes, servicesRes, pricingRes] = await Promise.all([
        supabase.from('barbers').select('*').order('name'),
        supabase.from('services').select('*').order('name'),
        supabase.from('barber_service_pricing').select('*'),
      ]);

      if (barbersRes.error) throw barbersRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (pricingRes.error) throw pricingRes.error;

      setBarbers(barbersRes.data || []);
      setServices(servicesRes.data || []);
      setPricing(pricingRes.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
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
        <Link to="/dashboard" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </View>

      <View className={styles.tabs}>
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
      </View>

      {activeTab === 'pricing' && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>Set Prices by Barber & Time</Text>
          <Text className={styles.sectionDescription}>
            Set individual prices for each barber based on their personal time periods.
          </Text>

          {services.map((service) => (
            <View key={service.id} className={styles.serviceSection}>
              <Text className={styles.serviceSectionTitle}>
                {service.name} ({service.duration_minutes} min)
              </Text>

              <View className={styles.pricingGrid}>
                <View className={styles.pricingHeader}>
                  <Text className={styles.pricingHeaderCell}>Barber</Text>
                  <Text className={styles.pricingHeaderCell}>Regular Hours</Text>
                  <Text className={styles.pricingHeaderCell}>Evening Hours</Text>
                </View>

                {barbers.map((barber) => (
                  <View key={barber.id} className={styles.pricingRow}>
                    <View>
                      <Text className={styles.barberNameCell}>{barber.name}</Text>
                      <Text className={styles.barberTimeInfo}>
                        Regular: {barber.regular_hours_start}-{barber.regular_hours_end}
                      </Text>
                    </View>

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
                        placeholder="0.00"
                      />
                    </View>

                    <View>
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
                          placeholder="0.00"
                        />
                      </View>
                      <Text className={styles.barberTimeInfo}>
                        Evening: {barber.evening_hours_start}-{barber.evening_hours_end}
                      </Text>
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
          <View className={styles.sectionHeader}>
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

            <View className={styles.formGroup}>
              <label className={styles.label}>Hours & Pricing Periods</label>
              <Text className={styles.sectionDescription}>
                Define when this barber charges regular vs evening rates
              </Text>
            </View>

            <View className={styles.timeInputRow}>
              <View className={styles.formGroup}>
                <label className={styles.label}>Regular Hours Start</label>
                <input
                  type="time"
                  className={styles.input}
                  value={barberForm.regular_hours_start}
                  onChange={(e) => setBarberForm({ ...barberForm, regular_hours_start: e.target.value })}
                />
              </View>
              <View className={styles.formGroup}>
                <label className={styles.label}>Regular Hours End</label>
                <input
                  type="time"
                  className={styles.input}
                  value={barberForm.regular_hours_end}
                  onChange={(e) => setBarberForm({ ...barberForm, regular_hours_end: e.target.value })}
                />
              </View>
            </View>

            <View className={styles.timeInputRow}>
              <View className={styles.formGroup}>
                <label className={styles.label}>Evening Hours Start</label>
                <input
                  type="time"
                  className={styles.input}
                  value={barberForm.evening_hours_start}
                  onChange={(e) => setBarberForm({ ...barberForm, evening_hours_start: e.target.value })}
                />
              </View>
              <View className={styles.formGroup}>
                <label className={styles.label}>Evening Hours End</label>
                <input
                  type="time"
                  className={styles.input}
                  value={barberForm.evening_hours_end}
                  onChange={(e) => setBarberForm({ ...barberForm, evening_hours_end: e.target.value })}
                />
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

          <View className={styles.barbersList}>
            <Text className={styles.sectionTitle}>Current Barbers</Text>
            {barbers.map((barber) => (
              <View key={barber.id} className={styles.barberCard}>
                <View className={styles.barberInfo}>
                  <Text className={styles.barberName}>{barber.name}</Text>
                  {barber.instagram_handle && (
                    <Text className={styles.barberDetail}>
                      Instagram: @{barber.instagram_handle}
                    </Text>
                  )}
                  <View className={styles.statusBadge}>
                    <Text>{barber.is_active ? '✓ Active' : '✗ Inactive'}</Text>
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
        </View>
      )}
    </View>
    </>
  );
}
