// components/booking/StepDateTimeSelect.tsx
import { useState } from 'react';
import type { Barber } from '../../types/database.types';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/booking.css';
import * as pickerStyles from '../../styles/timePicker.css';

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toLocalYYYYMMDD = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

interface StepDateTimeSelectProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedBarber: Barber | null;
  today: Date;
  endMonth: Date;
  timeSlots: string[];
  isDateAvailable: (date: Date) => boolean;
  getTimePeriod: (time: string, barber: Barber) => 'regular' | 'evening';
  formatTimeTo12Hour: (time: string) => string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  onBack: () => void;
}

export function StepDateTimeSelect({
  selectedDate,
  selectedTime,
  selectedBarber,
  today,
  endMonth,
  timeSlots,
  isDateAvailable,
  getTimePeriod,
  formatTimeTo12Hour,
  onDateSelect,
  onTimeSelect,
  onBack,
}: StepDateTimeSelectProps) {
  const [dateError, setDateError] = useState('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      onDateSelect(undefined);
      setDateError('');
      return;
    }
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (!isDateAvailable(date)) {
      setDateError('This date is unavailable. Please select another date.');
      onDateSelect(undefined);
    } else {
      setDateError('');
      onDateSelect(date);
    }
  };

  return (
    <View className={styles.stepContainer}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back to Service
      </button>

      <View className={styles.dateTimeStack}>
        {/* DATE */}
        <View className={styles.pickerSection}>
          <Text className={pickerStyles.pickerLabel}>Date</Text>
          <input
            type="date"
            className={pickerStyles.dateInput}
            min={toLocalYYYYMMDD(today)}
            max={toLocalYYYYMMDD(endMonth)}
            value={selectedDate ? toLocalYYYYMMDD(selectedDate) : ''}
            onChange={handleDateChange}
            onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
          />
          {dateError && (
            <Text className={styles.noTimesMessage}>{dateError}</Text>
          )}
        </View>

        {/* TIME */}
        {selectedDate && (
          <View className={styles.pickerSection}>
            <Text className={styles.timeLabel}>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>

            {timeSlots.length > 0 ? (
              <View className={styles.timeGrid}>
                {timeSlots.map((time) => {
                  const period =
                    selectedBarber &&
                    getTimePeriod(time, selectedBarber) === 'evening'
                      ? ' (Evening)'
                      : '';
                  return (
                    <button
                      key={time}
                      className={`${styles.timeButton} ${selectedTime === time ? styles.timeButtonActive : ''}`}
                      onClick={() => onTimeSelect(time)}
                    >
                      {formatTimeTo12Hour(time)}
                      {period}
                    </button>
                  );
                })}
              </View>
            ) : (
              <Text className={styles.noTimesMessage}>
                No available times. Please select another date.
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
