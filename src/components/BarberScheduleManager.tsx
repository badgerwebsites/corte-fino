// components/BarberScheduleManager.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Barber, BarberAvailability, BarberTimeOff } from '../types/database.types';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/admin.css';

interface Props {
  barbers: Barber[];
  onUpdate: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function BarberScheduleManager({ barbers, onUpdate }: Props) {
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [availability, setAvailability] = useState<BarberAvailability[]>([]);
  const [timeOff, setTimeOff] = useState<BarberTimeOff[]>([]);
  const [loading, setLoading] = useState(false);

  // Time off form state
  const [timeOffForm, setTimeOffForm] = useState({
    start_date: '',
    end_date: '',
    reason: '',
  });

  useEffect(() => {
    if (selectedBarber) {
      loadBarberSchedule(selectedBarber.id);
    }
  }, [selectedBarber]);

  const loadBarberSchedule = async (barberId: string) => {
    setLoading(true);
    try {
      const [availabilityRes, timeOffRes] = await Promise.all([
        supabase
          .from('barber_availability')
          .select('*')
          .eq('barber_id', barberId)
          .order('day_of_week'),
        supabase
          .from('barber_time_off')
          .select('*')
          .eq('barber_id', barberId)
          .order('start_date'),
      ]);

      if (availabilityRes.error) throw availabilityRes.error;
      if (timeOffRes.error) throw timeOffRes.error;

      setAvailability(availabilityRes.data || []);
      setTimeOff(timeOffRes.data || []);
    } catch (error) {
      console.error('Error loading barber schedule:', error);
      alert('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = async (dayOfWeek: number, currentlyAvailable: boolean) => {
    if (!selectedBarber) return;

    try {
      if (currentlyAvailable) {
        const { error } = await supabase
          .from('barber_availability')
          .delete()
          .eq('barber_id', selectedBarber.id)
          .eq('day_of_week', dayOfWeek);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('barber_availability')
          .insert({
            barber_id: selectedBarber.id,
            day_of_week: dayOfWeek,
            start_time: '09:00',
            end_time: '21:00',
            is_available: true,
          });

        if (error) throw error;
      }

      loadBarberSchedule(selectedBarber.id);
      onUpdate();
    } catch (error) {
      console.error('Error toggling day:', error);
      alert('Failed to update availability');
    }
  };

  const handleUpdateTime = async (availabilityId: string, field: 'start_time' | 'end_time', value: string) => {
    if (!selectedBarber) return;

    try {
      const { error } = await supabase
        .from('barber_availability')
        .update({ [field]: value })
        .eq('id', availabilityId);

      if (error) throw error;

      loadBarberSchedule(selectedBarber.id);
      onUpdate();
    } catch (error) {
      console.error('Error updating time:', error);
      alert('Failed to update time');
    }
  };

  const handleAddTimeOff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarber) return;

    if (!timeOffForm.start_date || !timeOffForm.end_date) {
      alert('Please fill in both start and end dates');
      return;
    }

    try {
      const { error } = await supabase
        .from('barber_time_off')
        .insert({
          barber_id: selectedBarber.id,
          start_date: timeOffForm.start_date,
          end_date: timeOffForm.end_date,
          reason: timeOffForm.reason || null,
        });

      if (error) throw error;

      setTimeOffForm({
        start_date: '',
        end_date: '',
        reason: '',
      });

      loadBarberSchedule(selectedBarber.id);
      onUpdate();
      alert('Time off added successfully!');
    } catch (error) {
      console.error('Error adding time off:', error);
      alert('Failed to add time off');
    }
  };

  const handleDeleteTimeOff = async (timeOffId: string) => {
    if (!confirm('Are you sure you want to delete this time off period?')) return;

    try {
      const { error } = await supabase
        .from('barber_time_off')
        .delete()
        .eq('id', timeOffId);

      if (error) throw error;

      if (selectedBarber) {
        loadBarberSchedule(selectedBarber.id);
        onUpdate();
      }
    } catch (error) {
      console.error('Error deleting time off:', error);
      alert('Failed to delete time off');
    }
  };

  const isDayAvailable = (dayOfWeek: number): boolean => {
    return availability.some(a => a.day_of_week === dayOfWeek && a.is_available);
  };

  const getDayAvailability = (dayOfWeek: number): BarberAvailability | null => {
    return availability.find(a => a.day_of_week === dayOfWeek) || null;
  };

  return (
    <View className={styles.section}>
      <View className={styles.sectionHeader}>
        <View>
          <Text className={styles.sectionTitle}>Manage Barber Schedules</Text>
          <Text className={styles.sectionDescription}>
            Set weekly availability and time off for each barber
          </Text>
        </View>
      </View>

      <View className={styles.formGroup}>
        <label className={styles.label}>Select Barber</label>
        <select
          className={styles.input}
          value={selectedBarber?.id || ''}
          onChange={(e) => {
            const barber = barbers.find(b => b.id === e.target.value);
            setSelectedBarber(barber || null);
          }}
        >
          <option value="">-- Select a barber --</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>
      </View>

      {selectedBarber && !loading && (
        <>
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Weekly Availability
            </h3>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Toggle days and set working hours for {selectedBarber.name}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {DAYS_OF_WEEK.map((day) => {
                const isAvailable = isDayAvailable(day.value);
                const dayAvail = getDayAvailability(day.value);

                return (
                  <div
                    key={day.value}
                    style={{
                      padding: '1rem',
                      backgroundColor: isAvailable ? '#f0f9ff' : '#f7fafc',
                      borderRadius: '0.5rem',
                      border: isAvailable ? '2px solid #1a1a1a' : '2px solid #e5e5e5',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: isAvailable ? '0.75rem' : '0' }}>
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={() => handleToggleDay(day.value, isAvailable)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                        {day.label}
                      </span>
                    </div>

                    {isAvailable && dayAvail && (
                      <div style={{ display: 'flex', gap: '1rem', marginLeft: '2rem' }}>
                        <div style={{ flex: 1 }}>
                          <label className={styles.label}>Start Time</label>
                          <input
                            type="time"
                            className={styles.input}
                            value={dayAvail.start_time}
                            onChange={(e) => handleUpdateTime(dayAvail.id, 'start_time', e.target.value)}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label className={styles.label}>End Time</label>
                          <input
                            type="time"
                            className={styles.input}
                            value={dayAvail.end_time}
                            onChange={(e) => handleUpdateTime(dayAvail.id, 'end_time', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Time Off / Blocked Dates
            </h3>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Add specific dates when {selectedBarber.name} is unavailable
            </p>

            <form onSubmit={handleAddTimeOff} className={styles.form}>
              <View className={styles.formRow}>
                <View className={styles.formGroup}>
                  <label className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={timeOffForm.start_date}
                    onChange={(e) => setTimeOffForm({ ...timeOffForm, start_date: e.target.value })}
                    required
                  />
                </View>

                <View className={styles.formGroup}>
                  <label className={styles.label}>End Date</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={timeOffForm.end_date}
                    onChange={(e) => setTimeOffForm({ ...timeOffForm, end_date: e.target.value })}
                    required
                  />
                </View>
              </View>

              <View className={styles.formGroup}>
                <label className={styles.label}>Reason (Optional)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Vacation, Personal, Sick Leave"
                  value={timeOffForm.reason}
                  onChange={(e) => setTimeOffForm({ ...timeOffForm, reason: e.target.value })}
                />
              </View>

              <button type="submit" className={styles.submitButton}>
                Add Time Off
              </button>
            </form>

            {timeOff.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1rem' }}>
                  Upcoming Time Off
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {timeOff.map((period) => (
                    <div
                      key={period.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffc107',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500 }}>
                          {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                        </div>
                        {period.reason && (
                          <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                            {period.reason}
                          </div>
                        )}
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteTimeOff(period.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {selectedBarber && loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Text>Loading schedule...</Text>
        </div>
      )}

      {!selectedBarber && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <Text>Select a barber to manage their schedule</Text>
        </div>
      )}
    </View>
  );
}
