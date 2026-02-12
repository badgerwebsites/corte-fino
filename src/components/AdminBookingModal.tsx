// components/AdminBookingModal.tsx
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addMonths, isBefore, startOfDay } from 'date-fns';
import { supabase } from '../lib/supabase';
import { CustomerSearchInput } from './CustomerSearchInput';
import {
  calculateEndTime,
  calculatePrice,
  generateRecurringDates,
  checkRecurringAvailability,
  getAvailableTimeSlotsForBarber,
  formatTimeTo12Hour,
  formatDate,
  isBarberAvailableOnDate,
  type DateAvailabilityResult,
} from '../utils/bookingHelpers';
import type {
  Customer,
  Barber,
  Service,
  BarberServicePricing,
  BarberAvailability,
  BarberTimeOff,
  Booking,
  RecurrencePattern,
} from '../types/database.types';
import { RECURRENCE_LABELS } from '../types/database.types';
import * as styles from '../styles/adminBooking.css';
import * as calendarStyles from '../styles/calendar.css';

interface AdminBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  barbers: Barber[];
  services: Service[];
  pricing: BarberServicePricing[];
  availability: BarberAvailability[];
  timeOff: BarberTimeOff[];
  initialDate?: Date;
  initialTime?: string;
}

export function AdminBookingModal({
  isOpen,
  onClose,
  onSuccess,
  barbers,
  services,
  pricing,
  availability,
  timeOff,
  initialDate,
  initialTime,
}: AdminBookingModalProps) {
  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState(initialTime || '');

  // Recurring state
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>('weekly');
  const [recurrenceCount, setRecurrenceCount] = useState(12);

  // Preview state
  const [recurringPreview, setRecurringPreview] = useState<DateAvailabilityResult[]>([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedCustomer(null);
      setSelectedService(null);
      setSelectedBarber(null);
      setSelectedDate(initialDate);
      setSelectedTime(initialTime || '');
      setIsRecurring(false);
      setRecurrencePattern('weekly');
      setRecurrenceCount(12);
      setRecurringPreview([]);
    }
  }, [isOpen, initialDate, initialTime]);

  // Fetch existing bookings when barber or date changes (for single booking)
  useEffect(() => {
    if (!selectedDate || !selectedBarber) {
      setExistingBookings([]);
      return;
    }

    const fetchBookings = async () => {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', dateString)
        .neq('status', 'cancelled');

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      setExistingBookings(data || []);
    };

    fetchBookings();
  }, [selectedDate, selectedBarber]);

  // Generate recurring preview when relevant options change
  useEffect(() => {
    if (!isRecurring || !selectedDate || !selectedTime || !selectedBarber || !selectedService) {
      setRecurringPreview([]);
      return;
    }

    const generatePreview = async () => {
      // Generate all dates
      const dates = generateRecurringDates(selectedDate, recurrencePattern, recurrenceCount);

      // Fetch all bookings for the date range
      const startDateStr = format(dates[0], 'yyyy-MM-dd');
      const endDateStr = format(dates[dates.length - 1], 'yyyy-MM-dd');

      const { data: allBookings, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('booking_date', startDateStr)
        .lte('booking_date', endDateStr)
        .neq('status', 'cancelled');

      if (error) {
        console.error('Error fetching bookings for preview:', error);
        return;
      }

      // Check availability for each date
      const results = checkRecurringAvailability(
        dates,
        selectedTime,
        selectedBarber.id,
        selectedService.duration_minutes,
        availability,
        timeOff,
        allBookings || []
      );

      setRecurringPreview(results);
    };

    generatePreview();
  }, [isRecurring, selectedDate, selectedTime, selectedBarber, selectedService, recurrencePattern, recurrenceCount, availability, timeOff]);

  // Get available time slots for selected date
  const availableTimeSlots = selectedDate && selectedBarber && selectedService
    ? getAvailableTimeSlotsForBarber(
        selectedBarber.id,
        selectedDate,
        selectedService.duration_minutes,
        availability,
        existingBookings
      )
    : [];

  // Filter out past time slots if today
  const filteredTimeSlots = (() => {
    if (!selectedDate) return [];
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    const selectedStr = format(selectedDate, 'yyyy-MM-dd');
    if (todayStr !== selectedStr) return availableTimeSlots;

    const currentMinutes = now.getHours() * 60 + now.getMinutes() + 15; // 15 min buffer
    return availableTimeSlots.filter(slot => {
      const [h, m] = slot.split(':').map(Number);
      return h * 60 + m >= currentMinutes;
    });
  })();

  // Check if date is available for the barber
  const isDateAvailable = (date: Date): boolean => {
    if (!selectedBarber) return true;
    return isBarberAvailableOnDate(selectedBarber.id, date, availability, timeOff);
  };

  // Calculate price for the booking
  const bookingPrice = selectedService && selectedBarber && selectedTime
    ? calculatePrice(
        selectedBarber.id,
        selectedService.id,
        selectedTime,
        selectedBarber,
        pricing,
        selectedService.base_price
      )
    : 0;

  // Calculate summary for recurring
  const availableCount = recurringPreview.filter(r => r.available).length;
  const conflictCount = recurringPreview.filter(r => !r.available).length;
  const totalPrice = bookingPrice * availableCount;

  // Handle booking creation
  const handleCreateBooking = async () => {
    if (!selectedCustomer || !selectedService || !selectedBarber || !selectedDate || !selectedTime) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const endTime = calculateEndTime(selectedTime, selectedService.duration_minutes);
      const groupId = isRecurring ? crypto.randomUUID() : null;

      if (isRecurring && recurringPreview.length > 0) {
        // Create multiple bookings for recurring
        const availableDates = recurringPreview.filter(r => r.available);

        const bookingsToInsert = availableDates.map((result, index) => ({
          customer_id: selectedCustomer.id,
          barber_id: selectedBarber.id,
          service_id: selectedService.id,
          booking_date: result.dateString,
          start_time: selectedTime,
          end_time: endTime,
          total_price: bookingPrice,
          status: 'confirmed' as const,
          cancellation_fee_charged: false,
          reminder_sent: false,
          review_request_sent: false,
          is_guest: false,
          recurrence_group_id: groupId,
          recurrence_pattern: recurrencePattern,
          recurrence_index: index,
          created_by_admin: true,
        }));

        const { error } = await supabase.from('bookings').insert(bookingsToInsert);

        if (error) throw error;

        alert(`Successfully created ${availableDates.length} recurring appointments!${conflictCount > 0 ? ` (${conflictCount} dates skipped due to conflicts)` : ''}`);
      } else {
        // Create single booking
        const { error } = await supabase.from('bookings').insert({
          customer_id: selectedCustomer.id,
          barber_id: selectedBarber.id,
          service_id: selectedService.id,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: selectedTime,
          end_time: endTime,
          total_price: bookingPrice,
          status: 'confirmed',
          cancellation_fee_charged: false,
          reminder_sent: false,
          review_request_sent: false,
          is_guest: false,
          created_by_admin: true,
        });

        if (error) throw error;

        alert('Appointment created successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const today = startOfDay(new Date());
  const endMonth = addMonths(today, 12);

  const canSubmit = selectedCustomer && selectedService && selectedBarber && selectedDate && selectedTime &&
    (!isRecurring || availableCount > 0);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Book Appointment for Customer</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Customer Search */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Customer</div>
            <CustomerSearchInput
              selectedCustomer={selectedCustomer}
              onSelect={setSelectedCustomer}
              onClear={() => setSelectedCustomer(null)}
            />
          </div>

          {/* Service & Barber */}
          <div className={styles.twoColumnGrid}>
            <div className={styles.formSection}>
              <div className={styles.formSectionTitle}>Service</div>
              <select
                className={styles.selectInput}
                value={selectedService?.id || ''}
                onChange={(e) => {
                  const service = services.find(s => s.id === e.target.value) || null;
                  setSelectedService(service);
                  setSelectedTime(''); // Reset time when service changes
                }}
              >
                <option value="">Select a service...</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({service.duration_minutes} min)
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formSection}>
              <div className={styles.formSectionTitle}>Barber</div>
              <select
                className={styles.selectInput}
                value={selectedBarber?.id || ''}
                onChange={(e) => {
                  const barber = barbers.find(b => b.id === e.target.value) || null;
                  setSelectedBarber(barber);
                  setSelectedTime(''); // Reset time when barber changes
                }}
              >
                <option value="">Select a barber...</option>
                {barbers.filter(b => b.is_active).map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          {selectedService && selectedBarber && (
            <div className={styles.formSection}>
              <div className={styles.formSectionTitle}>Date & Time</div>
              <div className={styles.dateTimeSection}>
                <div className={styles.datePickerWrapper}>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedTime('');
                    }}
                    disabled={(date) => isBefore(date, today) || !isDateAvailable(date)}
                    startMonth={today}
                    endMonth={endMonth}
                    classNames={{
                      root: calendarStyles.rdpRoot,
                      caption_label: calendarStyles.captionLabel,
                      nav: calendarStyles.nav,
                      day: calendarStyles.day,
                      day_button: calendarStyles.dayButton,
                    }}
                  />
                </div>

                {selectedDate && (
                  <div className={styles.timeSlotWrapper}>
                    <div className={styles.timeSlotLabel}>
                      {formatDate(selectedDate)}
                    </div>
                    {filteredTimeSlots.length > 0 ? (
                      <div className={styles.timeSlotGrid}>
                        {filteredTimeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            className={`${styles.timeSlotButton} ${selectedTime === time ? styles.timeSlotButtonActive : ''}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {formatTimeTo12Hour(time)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noTimeSlotsMessage}>
                        No available times for this date
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recurring Options */}
          {selectedDate && selectedTime && (
            <div className={styles.formSection}>
              <div className={styles.recurrenceSection}>
                <label className={styles.recurrenceToggle}>
                  <input
                    type="checkbox"
                    className={styles.recurrenceCheckbox}
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                  />
                  <span className={styles.recurrenceLabel}>Make this a recurring appointment</span>
                </label>

                {isRecurring && (
                  <div className={styles.recurrenceOptions}>
                    <div className={styles.recurrenceRow}>
                      <span className={styles.recurrenceInputLabel}>Pattern:</span>
                      <select
                        className={styles.recurrenceSelect}
                        value={recurrencePattern}
                        onChange={(e) => setRecurrencePattern(e.target.value as RecurrencePattern)}
                      >
                        {(Object.keys(RECURRENCE_LABELS) as RecurrencePattern[]).map((pattern) => (
                          <option key={pattern} value={pattern}>
                            {RECURRENCE_LABELS[pattern]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.recurrenceRow}>
                      <span className={styles.recurrenceInputLabel}>Appointments:</span>
                      <input
                        type="number"
                        className={styles.recurrenceCountInput}
                        value={recurrenceCount}
                        onChange={(e) => setRecurrenceCount(Math.min(52, Math.max(2, parseInt(e.target.value) || 2)))}
                        min={2}
                        max={52}
                      />
                    </div>

                    {/* Preview */}
                    {recurringPreview.length > 0 && (
                      <div className={styles.previewSection}>
                        <div className={styles.previewTitle}>
                          Preview ({availableCount} available, {conflictCount} skipped)
                        </div>
                        <div className={styles.previewList}>
                          {recurringPreview.map((result, index) => (
                            <div
                              key={index}
                              className={`${styles.previewItem} ${result.available ? styles.previewItemAvailable : styles.previewItemConflict}`}
                            >
                              <span className={styles.previewIcon}>
                                {result.available ? '✓' : '⚠'}
                              </span>
                              <span className={styles.previewDate}>
                                {format(result.date, 'MMM d, yyyy')} @ {formatTimeTo12Hour(selectedTime)}
                              </span>
                              {result.reason && (
                                <span className={styles.previewReason}>
                                  {result.reason}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedService && selectedBarber && selectedTime && (
            <div className={styles.summarySection}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Service</span>
                <span className={styles.summaryValue}>{selectedService.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Barber</span>
                <span className={styles.summaryValue}>{selectedBarber.name}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Price per appointment</span>
                <span className={styles.summaryValue}>${bookingPrice.toFixed(2)}</span>
              </div>
              {isRecurring && (
                <>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Appointments</span>
                    <span className={styles.summaryValue}>{availableCount}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Total</span>
                    <span className={styles.summaryTotal}>${totalPrice.toFixed(2)}</span>
                  </div>
                  {conflictCount > 0 && (
                    <div className={styles.summaryWarning}>
                      {conflictCount} date(s) will be skipped due to conflicts
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.primaryButton}
            onClick={handleCreateBooking}
            disabled={!canSubmit || isLoading}
          >
            {isLoading && <span className={styles.spinner} />}
            {isRecurring ? `Book ${availableCount} Appointments` : 'Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
}
