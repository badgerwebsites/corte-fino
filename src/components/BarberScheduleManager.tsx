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

interface DaySchedule {
  isWorking: boolean;
  startTime: string;
  endTime: string;
  breaks: { id?: string; startTime: string; endTime: string }[];
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

const DEFAULT_START = '09:00';
const DEFAULT_END = '21:00';

export function BarberScheduleManager({ barbers, onUpdate }: Props) {
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [, setAvailability] = useState<BarberAvailability[]>([]);
  const [timeOff, setTimeOff] = useState<BarberTimeOff[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Schedule state for each day
  const [schedules, setSchedules] = useState<Record<number, DaySchedule>>({});

  // Time off form state
  const [timeOffForm, setTimeOffForm] = useState({
    start_date: '',
    end_date: '',
    reason: '',
  });

  // Auto-select the barber if only one is provided
  useEffect(() => {
    if (barbers.length === 1 && !selectedBarber) {
      setSelectedBarber(barbers[0]);
    }
  }, [barbers, selectedBarber]);

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

      // Convert availability records to our schedule format
      const newSchedules: Record<number, DaySchedule> = {};

      for (let day = 0; day <= 6; day++) {
        const dayRecords = (availabilityRes.data || [])
          .filter(a => a.day_of_week === day && a.is_available)
          .sort((a, b) => a.start_time.localeCompare(b.start_time));

        if (dayRecords.length === 0) {
          newSchedules[day] = {
            isWorking: false,
            startTime: DEFAULT_START,
            endTime: DEFAULT_END,
            breaks: [],
          };
        } else {
          // Find overall start (earliest) and end (latest) times
          const overallStart = dayRecords[0].start_time;
          const overallEnd = dayRecords[dayRecords.length - 1].end_time;

          // Find breaks (gaps between consecutive blocks)
          const breaks: { startTime: string; endTime: string }[] = [];
          for (let i = 0; i < dayRecords.length - 1; i++) {
            const currentEnd = dayRecords[i].end_time;
            const nextStart = dayRecords[i + 1].start_time;
            if (currentEnd !== nextStart) {
              breaks.push({
                startTime: currentEnd,
                endTime: nextStart,
              });
            }
          }

          newSchedules[day] = {
            isWorking: true,
            startTime: overallStart,
            endTime: overallEnd,
            breaks,
          };
        }
      }

      setSchedules(newSchedules);
    } catch (error) {
      console.error('Error loading barber schedule:', error);
      alert('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  // Convert schedule to availability blocks and save
  const saveSchedule = async (dayOfWeek: number) => {
    if (!selectedBarber) return;

    const schedule = schedules[dayOfWeek];
    if (!schedule) return;

    setSaving(true);
    try {
      // Delete existing availability for this day
      const { error: deleteError } = await supabase
        .from('barber_availability')
        .delete()
        .eq('barber_id', selectedBarber.id)
        .eq('day_of_week', dayOfWeek);

      if (deleteError) throw deleteError;

      if (!schedule.isWorking) {
        // Not working this day, we're done
        loadBarberSchedule(selectedBarber.id);
        onUpdate();
        setSaving(false);
        return;
      }

      // Sort breaks by start time
      const sortedBreaks = [...schedule.breaks].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );

      // Generate availability blocks from schedule
      const blocks: { start_time: string; end_time: string }[] = [];
      let currentStart = schedule.startTime;

      for (const brk of sortedBreaks) {
        // Validate break is within working hours
        if (brk.startTime < schedule.startTime || brk.endTime > schedule.endTime) {
          continue; // Skip invalid breaks
        }

        if (brk.startTime > currentStart) {
          blocks.push({
            start_time: currentStart,
            end_time: brk.startTime,
          });
        }
        currentStart = brk.endTime;
      }

      // Add final block after last break
      if (currentStart < schedule.endTime) {
        blocks.push({
          start_time: currentStart,
          end_time: schedule.endTime,
        });
      }

      // Insert new availability blocks
      if (blocks.length > 0) {
        const { error: insertError } = await supabase
          .from('barber_availability')
          .insert(
            blocks.map(block => ({
              barber_id: selectedBarber.id,
              day_of_week: dayOfWeek,
              start_time: block.start_time,
              end_time: block.end_time,
              is_available: true,
            }))
          );

        if (insertError) throw insertError;
      }

      loadBarberSchedule(selectedBarber.id);
      onUpdate();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const updateSchedule = (dayOfWeek: number, updates: Partial<DaySchedule>) => {
    setSchedules(prev => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        ...updates,
      },
    }));
  };

  const addBreak = (dayOfWeek: number) => {
    const schedule = schedules[dayOfWeek];
    if (!schedule) return;

    // Default new break to middle of the day
    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = timeToMinutes(schedule.endTime);
    const midpoint = Math.floor((startMinutes + endMinutes) / 2);

    const newBreakStart = minutesToTime(midpoint);
    const newBreakEnd = minutesToTime(midpoint + 60);

    updateSchedule(dayOfWeek, {
      breaks: [...schedule.breaks, { startTime: newBreakStart, endTime: newBreakEnd }],
    });
  };

  const updateBreak = (dayOfWeek: number, breakIndex: number, field: 'startTime' | 'endTime', value: string) => {
    const schedule = schedules[dayOfWeek];
    if (!schedule) return;

    const newBreaks = [...schedule.breaks];
    newBreaks[breakIndex] = { ...newBreaks[breakIndex], [field]: value };
    updateSchedule(dayOfWeek, { breaks: newBreaks });
  };

  const removeBreak = (dayOfWeek: number, breakIndex: number) => {
    const schedule = schedules[dayOfWeek];
    if (!schedule) return;

    const newBreaks = schedule.breaks.filter((_, i) => i !== breakIndex);
    updateSchedule(dayOfWeek, { breaks: newBreaks });
  };

  const timeToMinutes = (time: string): number => {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formatTime = (time: string): string => {
    const [hours, mins] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
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

  return (
    <View className={styles.section}>
      <View className={styles.sectionHeader}>
        <View>
          <Text className={styles.sectionTitle}>Manage Schedule</Text>
          <Text className={styles.sectionDescription}>
            Set working hours and breaks for each day of the week
          </Text>
        </View>
      </View>

      {barbers.length > 1 && (
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
      )}

      {selectedBarber && !loading && (
        <>
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#1a1a1a' }}>
              Weekly Schedule for {selectedBarber.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {DAYS_OF_WEEK.map((day) => {
                const schedule = schedules[day.value] || {
                  isWorking: false,
                  startTime: DEFAULT_START,
                  endTime: DEFAULT_END,
                  breaks: [],
                };

                return (
                  <div
                    key={day.value}
                    style={{
                      backgroundColor: schedule.isWorking ? '#ffffff' : '#f9fafb',
                      border: schedule.isWorking ? '2px solid #10b981' : '2px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* Day Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: schedule.isWorking ? '1rem' : 0,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                          type="checkbox"
                          checked={schedule.isWorking}
                          onChange={(e) => {
                            updateSchedule(day.value, { isWorking: e.target.checked });
                          }}
                          style={{
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            accentColor: '#10b981',
                          }}
                        />
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: schedule.isWorking ? '#1a1a1a' : '#6b7280',
                        }}>
                          {day.label}
                        </span>
                        {!schedule.isWorking && (
                          <span style={{
                            fontSize: '0.875rem',
                            color: '#9ca3af',
                            fontStyle: 'italic',
                          }}>
                            — Not working
                          </span>
                        )}
                      </div>

                      {schedule.isWorking && (
                        <button
                          onClick={() => saveSchedule(day.value)}
                          disabled={saving}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.7 : 1,
                          }}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                      )}
                    </div>

                    {schedule.isWorking && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Working Hours */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1rem',
                          padding: '1rem',
                          backgroundColor: '#f0fdf4',
                          borderRadius: '0.5rem',
                          border: '1px solid #bbf7d0',
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#166534',
                              marginBottom: '0.375rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}>
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={schedule.startTime}
                              onChange={(e) => updateSchedule(day.value, { startTime: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem',
                              }}
                            />
                          </div>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#166534',
                              marginBottom: '0.375rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}>
                              End Time
                            </label>
                            <input
                              type="time"
                              value={schedule.endTime}
                              onChange={(e) => updateSchedule(day.value, { endTime: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem',
                              }}
                            />
                          </div>
                        </div>

                        {/* Breaks Section */}
                        <div style={{
                          padding: '1rem',
                          backgroundColor: '#fef3c7',
                          borderRadius: '0.5rem',
                          border: '1px solid #fde68a',
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: schedule.breaks.length > 0 ? '0.75rem' : 0,
                          }}>
                            <label style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#92400e',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}>
                              Breaks {schedule.breaks.length > 0 && `(${schedule.breaks.length})`}
                            </label>
                            <button
                              type="button"
                              onClick={() => addBreak(day.value)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              + Add Break
                            </button>
                          </div>

                          {schedule.breaks.length === 0 ? (
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#92400e',
                              margin: 0,
                              marginTop: '0.5rem',
                            }}>
                              No breaks scheduled. Click "Add Break" to add one.
                            </p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {schedule.breaks.map((brk, index) => (
                                <div
                                  key={index}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem',
                                    backgroundColor: 'white',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #fde68a',
                                  }}
                                >
                                  <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    color: '#78716c',
                                    minWidth: '3rem',
                                  }}>
                                    Break {index + 1}
                                  </span>
                                  <input
                                    type="time"
                                    value={brk.startTime}
                                    onChange={(e) => updateBreak(day.value, index, 'startTime', e.target.value)}
                                    style={{
                                      flex: 1,
                                      padding: '0.375rem',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '0.25rem',
                                      fontSize: '0.875rem',
                                    }}
                                  />
                                  <span style={{ color: '#9ca3af' }}>to</span>
                                  <input
                                    type="time"
                                    value={brk.endTime}
                                    onChange={(e) => updateBreak(day.value, index, 'endTime', e.target.value)}
                                    style={{
                                      flex: 1,
                                      padding: '0.375rem',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '0.25rem',
                                      fontSize: '0.875rem',
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeBreak(day.value, index)}
                                    style={{
                                      padding: '0.375rem',
                                      backgroundColor: '#fecaca',
                                      color: '#dc2626',
                                      border: 'none',
                                      borderRadius: '0.25rem',
                                      cursor: 'pointer',
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Schedule Summary */}
                        <div style={{
                          padding: '0.75rem',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          color: '#4b5563',
                        }}>
                          <strong>Available:</strong>{' '}
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                          {schedule.breaks.length > 0 && (
                            <span>
                              {' '}(excluding {schedule.breaks.length} break{schedule.breaks.length > 1 ? 's' : ''})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {!schedule.isWorking && (
                      <button
                        onClick={() => saveSchedule(day.value)}
                        disabled={saving}
                        style={{
                          marginTop: '0.75rem',
                          padding: '0.375rem 0.75rem',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          cursor: saving ? 'not-allowed' : 'pointer',
                          opacity: saving ? 0.7 : 1,
                        }}
                      >
                        {saving ? 'Saving...' : 'Save as Day Off'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Off Section */}
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1a1a1a' }}>
              Time Off / Vacation Days
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Block specific dates when {selectedBarber.name} is unavailable
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
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>
                  Scheduled Time Off
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {timeOff.map((period) => (
                    <div
                      key={period.id}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#fef3c7',
                        border: '1px solid #fde68a',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 500, color: '#92400e' }}>
                          {new Date(period.start_date + 'T00:00:00').toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                          {period.start_date !== period.end_date && (
                            <> — {new Date(period.end_date + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}</>
                          )}
                        </div>
                        {period.reason && (
                          <div style={{ fontSize: '0.875rem', color: '#a16207', marginTop: '0.25rem' }}>
                            {period.reason}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteTimeOff(period.id)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
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
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          <Text>Select a barber to manage their schedule</Text>
        </div>
      )}
    </View>
  );
}
