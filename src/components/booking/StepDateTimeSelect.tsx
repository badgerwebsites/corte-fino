import { DayPicker } from 'react-day-picker';
import { isBefore } from 'date-fns';
import type { Barber } from '../../types/database.types';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/booking.css';
import * as calendarStyles from '../../styles/calendar.css';

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
  return (
    <View className={styles.stepContainer}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back to Barber
      </button>

      <View className={calendarStyles.dateTimeLayout}>

        {/* DATE COLUMN */}
        <View className={calendarStyles.dateColumn}>
          <View className={calendarStyles.calendarContainer}>
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={(date) => isBefore(date, today) || !isDateAvailable(date)}
              startMonth={today}
              endMonth={endMonth}
              modifiers={{
                unavailable: (date) => !isDateAvailable(date),
              }}
              classNames={{
                root: calendarStyles.rdpRoot,
                caption_label: calendarStyles.captionLabel,
                nav: calendarStyles.nav,
                day: calendarStyles.day,
                day_button: calendarStyles.dayButton,
              }}
            />
          </View>
        </View>

        {/* TIME COLUMN */}
        {selectedDate && (
          <View className={styles.timeColumn}>
            <View className={calendarStyles.calendarContainer}>
              <Text className={styles.timeLabel}>
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>

              <View className={styles.timeGrid}>
                {timeSlots.length > 0 ? (
                  timeSlots.map((time) => {
                    const timePeriodLabel = selectedBarber
                      ? getTimePeriod(time, selectedBarber) === 'evening'
                        ? ' (Evening)'
                        : ''
                      : '';

                    return (
                      <button
                        key={time}
                        className={`${styles.timeButton} ${selectedTime === time ? styles.timeButtonActive : ''}`}
                        onClick={() => onTimeSelect(time)}
                      >
                        {formatTimeTo12Hour(time)}
                        {timePeriodLabel}
                      </button>
                    );
                  })
                ) : (
                  <Text className={styles.noTimesMessage}>
                    No available times. Please select another date.
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
