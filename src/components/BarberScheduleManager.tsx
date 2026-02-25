// components/BarberScheduleManager.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Barber, BarberAvailability, BarberTimeOff } from '../types/database.types';
import { View } from '../ui/View';
// import { Text } from '../ui/Text';
import * as styles from '../styles/admin.css';
import * as scheduleStyles from '../styles/barberScheduleManager.css';
import { MinusCircle } from "lucide-react";

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
    <View>
      {/* Schedule */}
      {selectedBarber && !loading && (
        <>
          <h3 className={scheduleStyles.headerTitle}>
            {selectedBarber.name}'s Schedule
          </h3>
          <div className={scheduleStyles.scheduleList}>
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
                  className={`${scheduleStyles.dayCard} ${
                    schedule.isWorking ? scheduleStyles.dayCardActive : ''
                  }`}
                >
                  {/* Day Header */}
                  <div className={scheduleStyles.dayHeader}>
                    <div className={scheduleStyles.dayHeaderLeft}>
                      <input
                        type="checkbox"
                        checked={schedule.isWorking}
                        onChange={(e) =>
                          updateSchedule(day.value, {
                            isWorking: e.target.checked,
                          })
                        }
                        className={scheduleStyles.dayCheckbox}
                      />

                      <span
                        className={`${scheduleStyles.dayLabel} ${
                          !schedule.isWorking
                            ? scheduleStyles.dayLabelInactive
                            : ''
                        }`}
                      >
                        {day.label}
                      </span>

                      {!schedule.isWorking && (
                        <span className={scheduleStyles.notWorkingText}>
                          — Not working
                        </span>
                      )}
                    </div>

                    {schedule.isWorking && (
                      <button
                        onClick={() => saveSchedule(day.value)}
                        disabled={saving}
                        className={`${scheduleStyles.saveButton} ${
                          saving ? scheduleStyles.saveButtonDisabled : ''
                        }`}
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                    )}
                  </div>

                  {/* Working Content */}
                  {schedule.isWorking && (
                    <>
                      {/* Working Hours */}
                      <div className={scheduleStyles.workingHoursCard}>
                        <div>
                          <label className={scheduleStyles.timeLabel}>
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) =>
                              updateSchedule(day.value, {
                                startTime: e.target.value,
                              })
                            }
                            className={scheduleStyles.timeInput}
                          />
                        </div>

                        <div>
                          <label className={scheduleStyles.timeLabel}>
                            End Time
                          </label>
                          <input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) =>
                              updateSchedule(day.value, {
                                endTime: e.target.value,
                              })
                            }
                            className={scheduleStyles.timeInput}
                          />
                        </div>
                      </div>

                      {/* Breaks */}
                      <div className={scheduleStyles.breaksCard}>
                        <div className={scheduleStyles.breaksHeader}>
                          <label className={scheduleStyles.breaksLabel}>
                            Breaks
                            {schedule.breaks.length > 0 &&
                              ` (${schedule.breaks.length})`}
                          </label>

                          <button
                            type="button"
                            onClick={() => addBreak(day.value)}
                            className={scheduleStyles.addBreakButton}
                          >
                            + Add Break
                          </button>
                        </div>

                        {schedule.breaks.length === 0 ? (
                          <p className={scheduleStyles.notWorkingText}>
                            No breaks scheduled. Click “Add Break” to add one.
                          </p>
                        ) : (
                          <div className={scheduleStyles.scheduleList}>
                            {schedule.breaks.map((brk, index) => (
                              <div
                                key={index}
                                className={scheduleStyles.breakRow}
                              >

                                <input
                                  type="time"
                                  value={brk.startTime}
                                  onChange={(e) =>
                                    updateBreak(
                                      day.value,
                                      index,
                                      'startTime',
                                      e.target.value
                                    )
                                  }
                                  className={scheduleStyles.breakInput}
                                />

                                <span className={scheduleStyles.breakSeparator}>-</span>

                                <input
                                  type="time"
                                  value={brk.endTime}
                                  onChange={(e) =>
                                    updateBreak(
                                      day.value,
                                      index,
                                      'endTime',
                                      e.target.value
                                    )
                                  }
                                  className={scheduleStyles.breakInput}
                                />

                                <button
                                  type="button"
                                  onClick={() => removeBreak(day.value, index)}
                                  className={scheduleStyles.removeBreakButton}
                                >
                                  <MinusCircle size={22} strokeWidth={2.5} />
                                </button>

                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Summary */}
                      <div className={scheduleStyles.scheduleSummary}>
                        <strong>Available:</strong>{' '}
                        {formatTime(schedule.startTime)} –{' '}
                        {formatTime(schedule.endTime)}
                        {schedule.breaks.length > 0 && (
                          <span>
                            {' '}
                            (excluding {schedule.breaks.length} break
                            {schedule.breaks.length > 1 ? 's' : ''})
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {!schedule.isWorking && (
                    <button
                      onClick={() => saveSchedule(day.value)}
                      disabled={saving}
                      className={scheduleStyles.saveDayOffButton}
                    >
                      {saving ? 'Saving…' : 'Save as Day Off'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Off Section */}
          <div>
            <h3 className={scheduleStyles.headerTitle}>
              Time Off / Vacation Days
            </h3>

            <form onSubmit={handleAddTimeOff} className={styles.form}>
              <View className={styles.formRow}>
                <View className={styles.formGroup}>
                  <label className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    className={scheduleStyles.timeInput}
                    value={timeOffForm.start_date}
                    onChange={(e) =>
                      setTimeOffForm({
                        ...timeOffForm,
                        start_date: e.target.value,
                      })
                    }
                    required
                  />
                </View>

                <View className={styles.formGroup}>
                  <label className={styles.label}>End Date</label>
                  <input
                    type="date"
                    className={scheduleStyles.timeInput}
                    value={timeOffForm.end_date}
                    onChange={(e) =>
                      setTimeOffForm({
                        ...timeOffForm,
                        end_date: e.target.value,
                      })
                    }
                    required
                  />
                </View>
              </View>

              <View className={styles.formGroup}>
                <label className={styles.label}>Reason (Optional)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Vacation, Personal, Sick Leave"
                  value={timeOffForm.reason}
                  onChange={(e) =>
                    setTimeOffForm({
                      ...timeOffForm,
                      reason: e.target.value,
                    })
                  }
                />
              </View>

            <View className={scheduleStyles.centerButton}>
              <button type="submit" className={styles.submitButton}>
                Add Time Off
              </button>
            </View>

            </form>

            {timeOff.length > 0 && (
              <div className={scheduleStyles.scheduleList}>
                {timeOff.map((period) => (
                  <div
                    key={period.id}
                    className={scheduleStyles.timeOffCard}
                  >
                    <div>
                      <div className={scheduleStyles.timeOffDate}>
                        {new Date(period.start_date).toLocaleDateString()}
                        {period.start_date !== period.end_date && (
                          <> — {new Date(period.end_date).toLocaleDateString()}</>
                        )}
                      </div>

                      {period.reason && (
                        <div className={scheduleStyles.timeOffReason}>
                          {period.reason}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTimeOff(period.id)
                      }
                      className={scheduleStyles.deleteTimeOffButton}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!selectedBarber && (
        <div className={scheduleStyles.scheduleSummary}>
          Select a barber to manage their schedule
        </div>
      )}
    </View>
  );
}