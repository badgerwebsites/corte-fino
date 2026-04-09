// components/admin/BarberScheduleManager.tsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { Barber, BarberAvailability, BarberTimeOff } from '../../types/database.types';
import { View } from '../../ui/View';
import * as styles from '../../styles/admin.css';
import * as scheduleStyles from '../../styles/barberScheduleManager.css';
import { MinusCircle } from "lucide-react";

interface Props {
  barbers: Barber[];
  onUpdate: () => void;
  showSchedule: boolean;
  onReady?: () => void;
  children?: React.ReactNode;
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

const localDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString();
};

const DEFAULT_START = '09:00';
const DEFAULT_END = '21:00';

export function BarberScheduleManager({ barbers, onUpdate, showSchedule, onReady, children }: Props) {
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [, setAvailability] = useState<BarberAvailability[]>([]);
  const [timeOff, setTimeOff] = useState<BarberTimeOff[]>([]);
  const [loading, setLoading] = useState(false);

  // Schedule state for each day
  const [schedules, setSchedules] = useState<Record<number, DaySchedule>>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSaveSchedule = (dayOfWeek: number, schedule: DaySchedule) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveSchedule(dayOfWeek, schedule), 800);
  };

  const today = new Date().toISOString().split('T')[0];

  // Time off form state
  const [timeOffForm, setTimeOffForm] = useState({
    start_date: today,
    end_date: today,
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

  const loadBarberSchedule = async (barberId: string, silent = false) => {
    if (!silent) setLoading(true);
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
          // Normalize to HH:MM — Supabase returns "HH:MM:SS" from Postgres TIME columns
          const t = (s: string) => s.slice(0, 5);

          // Find overall start (earliest) and end (latest) times
          const overallStart = t(dayRecords[0].start_time);
          const overallEnd = t(dayRecords[dayRecords.length - 1].end_time);

          // Find breaks (gaps between consecutive blocks)
          const breaks: { startTime: string; endTime: string }[] = [];
          for (let i = 0; i < dayRecords.length - 1; i++) {
            const currentEnd = t(dayRecords[i].end_time);
            const nextStart = t(dayRecords[i + 1].start_time);
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
      if (!silent) onReady?.();
    }
  };

  // Convert schedule to availability blocks and save
  const saveSchedule = async (dayOfWeek: number, schedule: DaySchedule) => {
    if (!selectedBarber) return;
    if (schedule.isWorking && schedule.startTime >= schedule.endTime) return;
    if (schedule.isWorking && schedule.breaks.some(b => b.startTime >= b.endTime)) return;

    try {
      const { error: deleteError } = await supabase
        .from('barber_availability')
        .delete()
        .eq('barber_id', selectedBarber.id)
        .eq('day_of_week', dayOfWeek);

      if (deleteError) throw deleteError;

      if (!schedule.isWorking) {
        onUpdate();
        return;
      }

      const sortedBreaks = [...schedule.breaks].sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
      );

      const blocks: { start_time: string; end_time: string }[] = [];
      let currentStart = schedule.startTime;

      for (const brk of sortedBreaks) {
        if (brk.startTime < schedule.startTime || brk.endTime > schedule.endTime) continue;
        if (brk.startTime > currentStart) {
          blocks.push({ start_time: currentStart, end_time: brk.startTime });
        }
        currentStart = brk.endTime;
      }

      if (currentStart < schedule.endTime) {
        blocks.push({ start_time: currentStart, end_time: schedule.endTime });
      }

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

      onUpdate();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule');
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

    const startMinutes = timeToMinutes(schedule.startTime);
    const endMinutes = timeToMinutes(schedule.endTime);
    const midpoint = Math.floor((startMinutes + endMinutes) / 2);

    const newBreakStart = minutesToTime(midpoint);
    const newBreakEnd = minutesToTime(midpoint + 60);
    const newSchedule = { ...schedule, breaks: [...schedule.breaks, { startTime: newBreakStart, endTime: newBreakEnd }] };

    updateSchedule(dayOfWeek, { breaks: newSchedule.breaks });
    saveSchedule(dayOfWeek, newSchedule);
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
    const newSchedule = { ...schedule, breaks: newBreaks };
    updateSchedule(dayOfWeek, { breaks: newBreaks });
    saveSchedule(dayOfWeek, newSchedule);
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

      loadBarberSchedule(selectedBarber.id, true);
      onUpdate();
      // alert('Time off added successfully!');
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
        loadBarberSchedule(selectedBarber.id, true);
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
          {showSchedule && <div className={scheduleStyles.scheduleList}>
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
                        onChange={(e) => {
                          const newSchedule = { ...schedule, isWorking: e.target.checked };
                          updateSchedule(day.value, { isWorking: e.target.checked });
                          saveSchedule(day.value, newSchedule);
                        }}
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
                          — Not Scheduled
                        </span>
                      )}
                    </div>
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
                            step={300}
                            value={schedule.startTime}
                            onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                            onChange={(e) => {
                              if (!e.target.value) return;
                              const updated = { ...schedule, startTime: e.target.value };
                              updateSchedule(day.value, { startTime: e.target.value });
                              debouncedSaveSchedule(day.value, updated);
                            }}
                            className={`${scheduleStyles.timeInput}${schedule.startTime >= schedule.endTime ? ` ${scheduleStyles.timeInputInvalid}` : ''}`}
                          />
                        </div>

                        <div>
                          <label className={scheduleStyles.timeLabel}>
                            End Time
                          </label>
                          <input
                            type="time"
                            step={300}
                            value={schedule.endTime}
                            onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                            onChange={(e) => {
                              if (!e.target.value) return;
                              const updated = { ...schedule, endTime: e.target.value };
                              updateSchedule(day.value, { endTime: e.target.value });
                              debouncedSaveSchedule(day.value, updated);
                            }}
                            className={`${scheduleStyles.timeInput}${schedule.startTime >= schedule.endTime ? ` ${scheduleStyles.timeInputInvalid}` : ''}`}
                          />
                        </div>
                      </div>
                      {schedule.startTime >= schedule.endTime && (
                        <p className={scheduleStyles.timeWarning}>Start time must be before end time</p>
                      )}

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
                                <div className={scheduleStyles.breakRowInner}>
                                  <div className={scheduleStyles.breakInputGroup}>
                                    <input
                                      type="time"
                                      step={300}
                                      value={brk.startTime}
                                      onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                                      onChange={(e) => {
                                        if (!e.target.value) return;
                                        const newBreaks = schedule.breaks.map((b, i) => i === index ? { ...b, startTime: e.target.value } : b);
                                        updateBreak(day.value, index, 'startTime', e.target.value);
                                        debouncedSaveSchedule(day.value, { ...schedule, breaks: newBreaks });
                                      }}
                                      className={`${scheduleStyles.breakInput}${brk.startTime >= brk.endTime ? ` ${scheduleStyles.timeInputInvalid}` : ''}`}
                                    />
                                    <span className={scheduleStyles.breakSeparator}>-</span>
                                    <input
                                      type="time"
                                      step={300}
                                      value={brk.endTime}
                                      onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                                      onChange={(e) => {
                                        if (!e.target.value) return;
                                        const newBreaks = schedule.breaks.map((b, i) => i === index ? { ...b, endTime: e.target.value } : b);
                                        updateBreak(day.value, index, 'endTime', e.target.value);
                                        debouncedSaveSchedule(day.value, { ...schedule, breaks: newBreaks });
                                      }}
                                      className={`${scheduleStyles.breakInput}${brk.startTime >= brk.endTime ? ` ${scheduleStyles.timeInputInvalid}` : ''}`}
                                    />
                                  </div>
                                  {brk.startTime >= brk.endTime && (
                                    <p className={scheduleStyles.timeWarning}>Start time must be before end time</p>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeBreak(day.value, index)}
                                  className={scheduleStyles.removeBreakButton}
                                >
                                  <MinusCircle size={26} strokeWidth={2.5} />
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

                </div>
              );
            })}
          </div>}

          {children}

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
                    min={today}
                    onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                    onChange={(e) =>
                      setTimeOffForm({
                        ...timeOffForm,
                        start_date: e.target.value,
                        // if end is now before the new start, bump it forward
                        end_date: timeOffForm.end_date < e.target.value ? e.target.value : timeOffForm.end_date,
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
                    min={timeOffForm.start_date || today}
                    onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
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
                        {localDate(period.start_date)}
                        {period.start_date !== period.end_date && (
                          <> — {localDate(period.end_date)}</>
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