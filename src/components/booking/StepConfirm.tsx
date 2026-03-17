import { format } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import type { Barber, Barber as BarberType, Customer, RecurrencePattern, Service } from '../../types/database.types';
import { RECURRENCE_LABELS } from '../../types/database.types';
import type { DateAvailabilityResult } from '../../utils/bookingHelpers';
import type { User } from '@supabase/supabase-js';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/booking.css';

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface StepConfirmProps {
  selectedService: Service | null;
  selectedBarber: Barber | null;
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedCustomer: Customer | null;
  anyBarber: boolean;
  isAdmin: boolean;
  isReschedule: boolean;
  price: number;
  timePeriodLabel: string;
  isRecurring: boolean;
  recurrencePattern: RecurrencePattern;
  recurrenceCount: number;
  recurringAvailability: DateAvailabilityResult[];
  authCustomer: Customer | null;
  user: User | null;
  showGuestForm: boolean;
  guestInfo: GuestInfo;
  bookingInProgress: boolean;
  formatDate: (date: Date | string) => string;
  formatTimeTo12Hour: (time: string) => string;
  getTimePeriod: (time: string, barber: BarberType) => 'regular' | 'evening';
  onBack: () => void;
  onConfirm: () => void;
  onGuestConfirm: () => void;
  onLoginToBook: () => void;
  onShowGuestForm: () => void;
  onHideGuestForm: () => void;
  onGuestInfoChange: (updates: Partial<GuestInfo>) => void;
  onRecurringToggle: (enabled: boolean) => void;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onCountChange: (count: number) => void;
}

export function StepConfirm({
  selectedService,
  selectedBarber,
  selectedDate,
  selectedTime,
  selectedCustomer,
  anyBarber,
  isAdmin,
  isReschedule,
  price,
  timePeriodLabel,
  isRecurring,
  recurrencePattern,
  recurrenceCount,
  recurringAvailability,
  authCustomer,
  user,
  showGuestForm,
  guestInfo,
  bookingInProgress,
  formatDate,
  formatTimeTo12Hour,
  onBack,
  onConfirm,
  onGuestConfirm,
  onLoginToBook,
  onShowGuestForm,
  onHideGuestForm,
  onGuestInfoChange,
  onRecurringToggle,
  onPatternChange,
  onCountChange,
}: StepConfirmProps) {
  return (
    <View className={styles.stepContainer}>
      <View className={styles.confirmContainer}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Date & Time
        </button>
        <Text className={styles.stepTitle}>Confirm Your Booking</Text>

        <View className={styles.confirmCard}>
          {(isAdmin ? selectedCustomer : authCustomer) && (
            <View className={styles.confirmSection}>
              <Text className={styles.confirmLabel}>Customer</Text>
              <Text className={styles.confirmValue}>
                {isAdmin
                  ? `${selectedCustomer!.first_name} ${selectedCustomer!.last_name}`
                  : `${authCustomer!.first_name} ${authCustomer!.last_name}`}
              </Text>
            </View>
          )}

          <View className={styles.confirmSection}>
            <Text className={styles.confirmLabel}>Service</Text>
            <Text className={styles.confirmValue}>{selectedService?.name}</Text>
            <Text className={styles.confirmDetail}>
              {selectedService?.duration_minutes} minutes
            </Text>
          </View>

          <View className={styles.confirmSection}>
            <Text className={styles.confirmLabel}>Barber</Text>
            <Text className={styles.confirmValue}>
              {anyBarber ? 'Any Available' : selectedBarber?.name}
            </Text>
          </View>

          <View className={styles.confirmSection}>
            <Text className={styles.confirmLabel}>Date & Time</Text>
            <Text className={styles.confirmValue}>{selectedDate ? formatDate(selectedDate) : ''}</Text>
            <Text className={styles.confirmValue}>{selectedTime ? formatTimeTo12Hour(selectedTime) : ''}</Text>
          </View>

          {selectedBarber && (
            <View className={styles.confirmSection}>
              <Text className={styles.confirmLabel}>Price</Text>
              <Text className={styles.priceAmount}>${price.toFixed(2)}</Text>
              <Text className={styles.confirmDetail}>{timePeriodLabel}</Text>
            </View>
          )}

          <View className={styles.policySection}>
            <Text className={styles.policyText}>
              Cancellations within 12 hours will incur a 50% cancellation fee.
            </Text>
          </View>

          {/* Recurring appointment option (admin only) */}
          {isAdmin && !isReschedule && (
            <View className={styles.recurringSection}>
              <label className={styles.recurringCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => onRecurringToggle(e.target.checked)}
                  className={styles.recurringCheckbox}
                />
                <Text className={styles.recurringCheckboxText}>Recurring Appointment</Text>
              </label>

              {isRecurring && (
                <View className={styles.recurringOptions}>
                  <View className={styles.recurringOptionGroup}>
                    <Text className={styles.recurringOptionLabel}>Frequency</Text>
                    <View className={styles.selectWrapper}>
                      <select
                        value={recurrencePattern}
                        onChange={(e) => onPatternChange(e.target.value as RecurrencePattern)}
                        className={styles.recurringSelect}
                      >
                        <option value="weekly">{RECURRENCE_LABELS['weekly']}</option>
                        <option value="biweekly">{RECURRENCE_LABELS['biweekly']}</option>
                        <option value="monthly">{RECURRENCE_LABELS['monthly']}</option>
                      </select>
                      <ChevronDown size={18} className={styles.selectIcon} />
                    </View>
                  </View>

                  <View className={styles.recurringOptionGroup}>
                    <Text className={styles.recurringOptionLabel}>Number of appointments</Text>
                    <View className={styles.selectWrapper}>
                      <select
                        value={recurrenceCount}
                        onChange={(e) => onCountChange(Number(e.target.value))}
                        className={styles.recurringSelect}
                      >
                        <option value={4}>4 appointments</option>
                        <option value={8}>8 appointments</option>
                        <option value={12}>12 appointments</option>
                      </select>
                      <ChevronDown size={18} className={styles.selectIcon} />
                    </View>
                  </View>

                  {recurringAvailability.length > 0 && (
                    <View className={styles.recurringDateList}>
                      {recurringAvailability.map((result, index) => (
                        <View
                          key={result.dateString}
                          className={`${styles.recurringDateItem} ${result.available ? styles.dateAvailable : styles.dateUnavailable}`}
                        >
                          <Text className={styles.recurringDateText}>
                            {index + 1}. {format(result.date, 'EEE, MMM d, yyyy')}
                          </Text>
                          {!result.available && (
                            <Text className={styles.recurringDateWarning}>
                              {result.reason}
                            </Text>
                          )}
                        </View>
                      ))}
                      {recurringAvailability.some(r => !r.available) && (
                        <Text className={styles.recurringWarning}>
                          Some dates are unavailable. These appointments will be skipped.
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Action buttons */}
          {user ? (
            <View className={styles.buttonGroup}>
              <button
                className={styles.confirmButton}
                onClick={onConfirm}
                disabled={bookingInProgress}
              >
                {bookingInProgress
                  ? (isReschedule ? 'Rescheduling...' : 'Booking...')
                  : (isReschedule ? 'Reschedule Booking' : 'Confirm Booking')}
              </button>
            </View>
          ) : showGuestForm ? (
            <View className={styles.guestFormSection}>
              <Text className={styles.guestFormTitle}>Guest Information</Text>

              <View className={styles.guestInputGroup}>
                <label className={styles.guestInputLabel}>First Name</label>
                <input
                  type="text"
                  className={styles.guestInput}
                  placeholder="Enter your first name"
                  value={guestInfo.firstName}
                  onChange={(e) => onGuestInfoChange({ firstName: e.target.value })}
                />
              </View>

              <View className={styles.guestInputGroup}>
                <label className={styles.guestInputLabel}>Last Name</label>
                <input
                  type="text"
                  className={styles.guestInput}
                  placeholder="Enter your last name"
                  value={guestInfo.lastName}
                  onChange={(e) => onGuestInfoChange({ lastName: e.target.value })}
                />
              </View>

              <View className={styles.guestInputGroup}>
                <label className={styles.guestInputLabel}>Email Address</label>
                <input
                  type="email"
                  className={styles.guestInput}
                  placeholder="Enter your email address"
                  value={guestInfo.email}
                  onChange={(e) => onGuestInfoChange({ email: e.target.value })}
                />
              </View>

              <View className={styles.guestInputGroup}>
                <label className={styles.guestInputLabel}>Phone Number</label>
                <input
                  type="tel"
                  className={styles.guestInput}
                  placeholder="Enter your phone number"
                  value={guestInfo.phone}
                  onChange={(e) => onGuestInfoChange({ phone: e.target.value })}
                />
              </View>

              <View className={styles.guestFormButtons}>
                <button
                  className={styles.confirmButton}
                  onClick={onGuestConfirm}
                  disabled={bookingInProgress}
                >
                  {bookingInProgress ? 'Booking...' : 'Confirm Booking'}
                </button>
                <span className={styles.guestBackLink} onClick={onHideGuestForm}>
                  ← Back to booking
                </span>
              </View>
            </View>
          ) : (
            <View className={styles.guestChoiceSection}>
              <button className={styles.loginButton} onClick={onLoginToBook}>
                Login to Book
              </button>
              <Text className={styles.orDivider}>or</Text>
              <button className={styles.guestButton} onClick={onShowGuestForm}>
                <span>Book as Guest</span>
                <span className={styles.guestButtonSubtext}>(Will not receive rewards points)</span>
              </button>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
