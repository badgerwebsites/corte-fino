// components/admin/BarbersTab.tsx
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Barber } from '../../types/database.types';
import { supabase } from '../../lib/supabase';
import { BarberScheduleManager } from './BarberScheduleManager';
import { ImageUpload } from './ImageUpload';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/admin.css';

const DEFAULT_BARBER_FORM = {
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
};

interface BarbersTabProps {
  barbers: Barber[];
  onUpdate: () => void;
  onScrollToTop: () => void;
  onScrollToSection: (el: HTMLElement | null) => void;
}

export function BarbersTab({ barbers, onUpdate, onScrollToTop, onScrollToSection }: BarbersTabProps) {
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [schedulingBarber, setSchedulingBarber] = useState<Barber | null>(null);
  const [barberForm, setBarberForm] = useState(DEFAULT_BARBER_FORM);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    regular_hours_start: '09:00',
    regular_hours_end: '17:00',
    evening_hours_start: '17:00',
    evening_hours_end: '21:00',
  });


  useEffect(() => {
    if (editingBarber) {
      const timer = setTimeout(() => onScrollToSection(rightColumnRef.current), 150);
      return () => clearTimeout(timer);
    }
  }, [editingBarber]);

  useEffect(() => {
    if (schedulingBarber) {
      const timer = setTimeout(() => onScrollToSection(rightColumnRef.current), 400);
      return () => clearTimeout(timer);
    }
  }, [schedulingBarber]);

  useEffect(() => {
    if (schedulingBarber) {
      setPricingForm({
        regular_hours_start: schedulingBarber.regular_hours_start,
        regular_hours_end: schedulingBarber.regular_hours_end,
        evening_hours_start: schedulingBarber.evening_hours_start,
        evening_hours_end: schedulingBarber.evening_hours_end,
      });
    }
  }, [schedulingBarber]);

  const handleSavePricing = async (values: typeof pricingForm) => {
    if (!schedulingBarber) return;
    try {
      const { error } = await supabase.from('barbers').update(values).eq('id', schedulingBarber.id);
      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error saving pricing:', error);
      alert('Failed to save pricing');
    }
  };

  const handleCancel = () => {
    setEditingBarber(null);
    setSchedulingBarber(null);
    setBarberForm(DEFAULT_BARBER_FORM);
    onScrollToTop();
  };

  const handleEdit = (barber: Barber) => {
    setSchedulingBarber(null);
    setShowAddForm(false);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBarber) {
        const { error } = await supabase.from('barbers').update(barberForm).eq('id', editingBarber.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('barbers').insert([{ ...barberForm, base_price_multiplier: 1.0 }]);
        if (error) throw error;
      }
      setBarberForm(DEFAULT_BARBER_FORM);
      setEditingBarber(null);
      setSchedulingBarber(null);
      setShowAddForm(false);
      onScrollToTop();
      onUpdate();
    } catch (error) {
      console.error('Error saving barber:', error);
      alert('Failed to save barber');
    }
  };

  const handleDelete = async (barberId: string) => {
    if (!confirm('Are you sure you want to delete this barber? This will also delete all their pricing. This action cannot be undone.')) return;
    try {
      const { error } = await supabase.from('barbers').delete().eq('id', barberId);
      if (error) throw error;
      // alert('Barber deleted successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error deleting barber:', error);
      alert('Failed to delete barber');
    }
  };

  const handleToggleActive = async (barber: Barber) => {
    try {
      const { error } = await supabase.from('barbers').update({ is_active: !barber.is_active }).eq('id', barber.id);
      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error toggling barber status:', error);
      alert('Failed to update barber status');
    }
  };

  return (
    <View className={styles.section}>
      <View className={styles.adminSplitLayout}>
        {/* Barber list */}
        <View className={styles.adminLeftColumn}>
          <View className={styles.cardList}>
          {barbers.map((barber) => (
            <View key={barber.id} className={styles.barberCard}>
              <View className={styles.barberInfo}>
                <View className={styles.barberNameRow}>
                  <Text className={styles.barberName}>{barber.name}</Text>
                  <button
                    className={barber.is_active ? styles.activeToggleButton : styles.inactiveToggleButton}
                    onClick={() => handleToggleActive(barber)}
                  >
                    {barber.is_active ? '✓ Active' : 'Inactive'}
                  </button>
                </View>
              </View>
              <View className={styles.barberActions}>
                <button
                  className={editingBarber?.id === barber.id ? styles.editButtonActive : styles.editButton}
                  onClick={() => {
                    if (editingBarber?.id === barber.id) {
                      handleCancel();
                    } else {
                      handleEdit(barber);
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  className={schedulingBarber?.id === barber.id ? styles.scheduleButtonActive : styles.scheduleButton}
                  onClick={() => {
                    if (schedulingBarber?.id === barber.id) {
                      handleCancel();
                    } else {
                      setEditingBarber(null);
                      setShowAddForm(false);
                      setShowSchedule(false);
                      setSchedulingBarber(barber);
                    }
                  }}
                >
                  Schedule
                </button>
                <button className={styles.deleteButton} onClick={() => handleDelete(barber.id)}>
                  Delete
                </button>
              </View>
            </View>
          ))}
          </View>
        </View>

        {/* Add / Edit form */}
        <div ref={rightColumnRef} className={styles.adminRightColumn}>
          <View className={styles.sectionHeader}>
            {editingBarber ? (
              <Text className={styles.sectionTitle}>Edit {editingBarber.name}</Text>
            ) : schedulingBarber ? (
              <button
                type="button"
                className={styles.scheduleToggleButton}
                onClick={() => setShowSchedule(v => !v)}
              >
                {schedulingBarber.name.split(' ')[0]}'s Weekly Schedule
                <ChevronDown
                  size={20}
                  className={styles.addToggleChevron}
                  style={{ transform: showSchedule ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
            ) : (
              <button
                type="button"
                className={styles.addToggleButton}
                onClick={() => setShowAddForm((v) => !v)}
              >
                + Add Barber
                <ChevronDown
                  size={20}
                  className={styles.addToggleChevron}
                  style={{ transform: showAddForm ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
            )}
          </View>

          {schedulingBarber && (
            <BarberScheduleManager barbers={[schedulingBarber]} onUpdate={onUpdate} showSchedule={showSchedule} onReady={() => setShowSchedule(true)}>
              <View>
                <View className={styles.pricingTimeline}>
                  <View className={styles.pricingTimeBlock}>
                    <label className={styles.pricingTimeLabel}>Evening Pricing Starts</label>
                    <input
                      key={pricingForm.evening_hours_start}
                      type="time"
                      step={300}
                      className={styles.timeInput}
                      defaultValue={pricingForm.evening_hours_start}
                      onBlur={(e) => handleSavePricing({ ...pricingForm, regular_hours_end: e.target.value, evening_hours_start: e.target.value })}
                    />
                  </View>
                  <View className={styles.pricingTimeArrow}>→</View>
                  <View className={styles.pricingTimeBlock}>
                    <label className={styles.pricingTimeLabel}>Evening Pricing Ends</label>
                    <input
                      key={pricingForm.evening_hours_end}
                      type="time"
                      step={300}
                      className={styles.timeInput}
                      defaultValue={pricingForm.evening_hours_end}
                      onBlur={(e) => handleSavePricing({ ...pricingForm, evening_hours_end: e.target.value })}
                    />
                  </View>
                </View>
              </View>
            </BarberScheduleManager>
          )}

          {(editingBarber || showAddForm) && <form onSubmit={handleSubmit} className={styles.form}>
            
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

            <ImageUpload
              currentImageUrl={barberForm.image_url || undefined}
              onImageChange={(url) => setBarberForm({ ...barberForm, image_url: url || '' })}
              bucket="barber-images"
              label="Profile Picture"
            />

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

            <View className={styles.formGroupWide}>
              <label className={styles.label}>Facebook URL</label>
              <input
                type="url"
                className={styles.input}
                placeholder="https://facebook.com/..."
                value={barberForm.facebook_url}
                onChange={(e) => setBarberForm({ ...barberForm, facebook_url: e.target.value })}
              />
            </View>

            <View className={styles.formActions}>
              {editingBarber ? (
                <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                  Cancel
                </button>
              ) : (
                <button type="button" className={styles.cancelButton} onClick={() => setBarberForm(DEFAULT_BARBER_FORM)}>
                  Clear
                </button>
              )}
              <button type="submit" className={styles.submitButton}>
                Save
              </button>
            </View>
          </form>}

        </div>
      </View>
    </View>
  );
}