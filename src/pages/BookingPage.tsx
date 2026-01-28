// pages/BookingPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { addDays, format, isBefore, startOfDay, getDay } from 'date-fns';
import { useAuth } from '../auth/useAuth.ts';
import { supabase } from '../lib/supabase';
import type { Barber, Service, BarberServicePricing, BarberAvailability, BarberTimeOff, Booking } from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/booking.css';
import * as calendarStyles from '../styles/calendar.css';
import 'react-day-picker/dist/style.css';

type BookingStep = 1 | 2 | 3 | 4;

interface LocationState {
  rescheduleFrom?: string;
  serviceId?: string;
  barberId?: string;
}

export default function BookingPage() {
  const { user, customer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;

  // Check if this is a reschedule
  const rescheduleFromId = locationState?.rescheduleFrom;
  const isReschedule = !!rescheduleFromId;

  const [step, setStep] = useState<BookingStep>(1);
  const [loading, setLoading] = useState(true);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBookingDetails, setConfirmedBookingDetails] = useState<{
    serviceName: string;
    barberName: string;
    date: string;
    time: string;
    price: number;
    rewardPoints: number;
  } | null>(null);

  // Data from database
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [pricing, setPricing] = useState<BarberServicePricing[]>([]);
  const [availability, setAvailability] = useState<BarberAvailability[]>([]);
  const [timeOff, setTimeOff] = useState<BarberTimeOff[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  // Booking selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [anyBarber, setAnyBarber] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  // Fetch existing bookings when date changes
  useEffect(() => {
    if (!selectedDate) {
      setExistingBookings([]);
      return;
    }

    const fetchExistingBookings = async () => {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', dateString)
        .neq('status', 'cancelled');

      if (error) {
        console.error('Error fetching existing bookings:', error);
        return;
      }

      setExistingBookings(data || []);
    };

    fetchExistingBookings();
  }, [selectedDate]);

  // Pre-select service and barber if rescheduling
  useEffect(() => {
    if (!loading && locationState) {
      if (locationState.serviceId) {
        const service = services.find(s => s.id === locationState.serviceId);
        if (service) {
          setSelectedService(service);
          setStep(2);
        }
      }
      if (locationState.barberId) {
        const barber = barbers.find(b => b.id === locationState.barberId);
        if (barber) {
          setSelectedBarber(barber);
          setAnyBarber(false);
          if (locationState.serviceId) {
            setStep(3); // Go straight to date/time selection
          }
        }
      }
    }
  }, [loading, locationState, services, barbers]);

  const loadData = async () => {
    try {
      const [servicesRes, barbersRes, pricingRes, availabilityRes, timeOffRes] = await Promise.all([
        supabase.from('services').select('*').order('name'),
        supabase.from('barbers').select('*').eq('is_active', true).order('name'),
        supabase.from('barber_service_pricing').select('*'),
        supabase.from('barber_availability').select('*'),
        supabase.from('barber_time_off').select('*'),
      ]);

      if (servicesRes.error) throw servicesRes.error;
      if (barbersRes.error) throw barbersRes.error;
      if (pricingRes.error) throw pricingRes.error;

      setServices(servicesRes.data || []);
      setBarbers(barbersRes.data || []);
      setPricing(pricingRes.data || []);
      setAvailability(availabilityRes.data || []);
      setTimeOff(timeOffRes.data || []);
    } catch (error) {
      console.error('Error loading booking data:', error);
      alert('Failed to load booking options');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBarberSelect = (barber: Barber | null, anyAvailable: boolean = false) => {
    setSelectedBarber(barber);
    setAnyBarber(anyAvailable);
    setStep(3);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const getTimePeriod = (time: string, barber: Barber): 'regular' | 'evening' => {
    // Convert time to minutes for easier comparison
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;

    const [eveningHours, eveningMinutes] = barber.evening_hours_start.split(':').map(Number);
    const eveningStartMinutes = eveningHours * 60 + eveningMinutes;

    const [eveningEndHours, eveningEndMins] = barber.evening_hours_end.split(':').map(Number);
    const eveningEndMinutes = eveningEndHours * 60 + eveningEndMins;

    if (timeInMinutes >= eveningStartMinutes && timeInMinutes < eveningEndMinutes) {
      return 'evening';
    }
    return 'regular';
  };

  const calculatePrice = (): number => {
    if (!selectedService || !selectedBarber || !selectedTime) return 0;

    const timePeriod = getTimePeriod(selectedTime, selectedBarber);
    const priceEntry = pricing.find(
      p => p.barber_id === selectedBarber.id &&
           p.service_id === selectedService.id &&
           p.time_period === timePeriod
    );

    return priceEntry?.price || 0;
  };

  const handleBooking = async () => {
    if (!user || !customer) {
      navigate('/login?redirect=/book');
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Please complete all booking selections');
      return;
    }

    setBookingInProgress(true);

    try {
      // If "any barber" was selected, pick the first available barber for this time slot
      let bookingBarber = selectedBarber;
      if (anyBarber && !selectedBarber) {
        const dayOfWeek = getDay(selectedDate);
        const dateString = format(selectedDate, 'yyyy-MM-dd');

        // Find first available barber for this date/time
        bookingBarber = barbers.find(barber => {
          const hasAvailability = availability.some(
            a => a.barber_id === barber.id &&
                 a.day_of_week === dayOfWeek &&
                 a.is_available
          );
          const hasTimeOff = timeOff.some(
            t => t.barber_id === barber.id &&
                 dateString >= t.start_date &&
                 dateString <= t.end_date
          );
          return hasAvailability && !hasTimeOff;
        }) || null;
      }

      if (!bookingBarber) {
        alert('No barber available for this time slot. Please select a different time.');
        setBookingInProgress(false);
        return;
      }

      // Calculate end time based on service duration
      const [startHours, startMins] = selectedTime.split(':').map(Number);
      const totalMinutes = startHours * 60 + startMins + selectedService.duration_minutes;
      const endHours = Math.floor(totalMinutes / 60);
      const endMins = totalMinutes % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

      // Calculate price
      const timePeriod = getTimePeriod(selectedTime, bookingBarber);
      const priceEntry = pricing.find(
        p => p.barber_id === bookingBarber!.id &&
             p.service_id === selectedService.id &&
             p.time_period === timePeriod
      );
      const totalPrice = priceEntry?.price || selectedService.base_price;

      // If rescheduling, delete the original booking first
      if (rescheduleFromId) {
        const { error: deleteError } = await supabase
          .from('bookings')
          .delete()
          .eq('id', rescheduleFromId);

        if (deleteError) {
          console.error('Error deleting original booking:', deleteError);
          // Continue with new booking even if delete fails
        }
      }

      // Create the booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          barber_id: bookingBarber.id,
          service_id: selectedService.id,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          start_time: selectedTime,
          end_time: endTime,
          total_price: totalPrice,
          status: 'confirmed',
          cancellation_fee_charged: false,
          reminder_sent: false,
          review_request_sent: false,
        });

      if (bookingError) throw bookingError;

      // Store booking details for confirmation screen
      setConfirmedBookingDetails({
        serviceName: selectedService.name,
        barberName: anyBarber ? 'Any Available Barber' : bookingBarber.name,
        date: formatDate(selectedDate),
        time: formatTimeTo12Hour(selectedTime),
        price: totalPrice,
        rewardPoints: rescheduleFromId ? 0 : selectedService.reward_points,
      });

      // Show confirmation screen
      setShowConfirmation(true);

    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setBookingInProgress(false);
    }
  };



  // Check if a date is available for the selected barber
  const isDateAvailable = (date: Date): boolean => {
    const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
    const dateString = format(date, 'yyyy-MM-dd');

    if (!selectedBarber && anyBarber) {
      // If "any barber", check if ANY barber is available on this day
      const hasAnyBarberAvailable = barbers.some(barber => {
        const hasAvailability = availability.some(
          a => a.barber_id === barber.id &&
               a.day_of_week === dayOfWeek &&
               a.is_available
        );

        const hasTimeOff = timeOff.some(
          t => t.barber_id === barber.id &&
               dateString >= t.start_date &&
               dateString <= t.end_date
        );

        return hasAvailability && !hasTimeOff;
      });

      return hasAnyBarberAvailable;
    }

    if (!selectedBarber) return true;

    // Check if barber has availability for this day of week
    const hasAvailability = availability.some(
      a => a.barber_id === selectedBarber.id &&
           a.day_of_week === dayOfWeek &&
           a.is_available
    );

    if (!hasAvailability) return false;

    // Check if barber has time off on this date
    const hasTimeOff = timeOff.some(
      t => t.barber_id === selectedBarber.id &&
           dateString >= t.start_date &&
           dateString <= t.end_date
    );

    return !hasTimeOff;
  };

  // Filter out past time slots if the selected date is today
  const filterPastTimeSlots = (slots: string[]): string[] => {
    if (!selectedDate) return slots;

    const now = new Date();
    const isToday = startOfDay(selectedDate).getTime() === startOfDay(now).getTime();

    if (!isToday) return slots;

    // Get current time in minutes
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    // Filter out slots that are in the past (add a small buffer of 30 min)
    return slots.filter(slot => {
      const [hours, mins] = slot.split(':').map(Number);
      const slotTimeInMinutes = hours * 60 + mins;
      return slotTimeInMinutes > currentTimeInMinutes;
    });
  };

  // Check if a time slot overlaps with any existing booking for a specific barber
  const isSlotBooked = (time: string, barberId: string): boolean => {
    const [slotHours, slotMins] = time.split(':').map(Number);
    const slotMinutes = slotHours * 60 + slotMins;

    return existingBookings.some(booking => {
      if (booking.barber_id !== barberId) return false;

      const [startHours, startMins] = booking.start_time.split(':').map(Number);
      const [endHours, endMins] = booking.end_time.split(':').map(Number);
      const bookingStart = startHours * 60 + startMins;
      const bookingEnd = endHours * 60 + endMins;

      // Check if the slot falls within an existing booking's time range
      return slotMinutes >= bookingStart && slotMinutes < bookingEnd;
    });
  };

  // Get available time slots for selected date and barber
  const getAvailableTimeSlots = (): string[] => {
    if (!selectedDate) return [];

    const dayOfWeek = getDay(selectedDate);
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    // If "any barber" selected, collect time slots where at least one barber is available
    if (!selectedBarber && anyBarber) {
      const slotAvailability = new Map<string, boolean>();

      barbers.forEach(barber => {
        // Check if this barber is available on this date
        const hasAvailability = availability.some(
          a => a.barber_id === barber.id &&
               a.day_of_week === dayOfWeek &&
               a.is_available
        );

        const hasTimeOff = timeOff.some(
          t => t.barber_id === barber.id &&
               dateString >= t.start_date &&
               dateString <= t.end_date
        );

        if (hasAvailability && !hasTimeOff) {
          // Get this barber's availability slots
          const barberAvailability = availability.filter(
            a => a.barber_id === barber.id &&
                 a.day_of_week === dayOfWeek &&
                 a.is_available
          );

          barberAvailability.forEach(avail => {
            const [startHour, startMin] = avail.start_time.split(':').map(Number);
            const [endHour, endMin] = avail.end_time.split(':').map(Number);

            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;

            // Generate 15-minute slots
            for (let minutes = startMinutes; minutes < endMinutes; minutes += 15) {
              const hours = Math.floor(minutes / 60);
              const mins = minutes % 60;
              const timeSlot = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

              // Check if this barber is available for this slot (not already booked)
              if (!isSlotBooked(timeSlot, barber.id)) {
                slotAvailability.set(timeSlot, true);
              }
            }
          });
        }
      });

      return filterPastTimeSlots(Array.from(slotAvailability.keys()).sort());
    }

    // Specific barber selected
    if (!selectedBarber) return [];

    const barberAvailability = availability.filter(
      a => a.barber_id === selectedBarber.id &&
           a.day_of_week === dayOfWeek &&
           a.is_available
    );

    if (barberAvailability.length === 0) return [];

    const slots: string[] = [];

    barberAvailability.forEach(avail => {
      const [startHour, startMin] = avail.start_time.split(':').map(Number);
      const [endHour, endMin] = avail.end_time.split(':').map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      // Generate 15-minute slots
      for (let minutes = startMinutes; minutes < endMinutes; minutes += 15) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const timeSlot = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

        // Only add if not already booked
        if (!isSlotBooked(timeSlot, selectedBarber.id)) {
          slots.push(timeSlot);
        }
      }
    });

    return filterPastTimeSlots(slots.sort());
  };

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatTimeTo12Hour = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const resetBooking = () => {
    setSelectedService(null);
    setSelectedBarber(null);
    setAnyBarber(false);
    setSelectedDate(undefined);
    setSelectedTime('');
    setStep(1);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <View className={styles.container}>
          <Text className={styles.title}>Loading...</Text>
        </View>
      </>
    );
  }

  const today = startOfDay(new Date());
  const twoMonthsFromNow = addDays(today, 60);

  return (
    <>
      <Navigation />
      <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>
          {isReschedule ? 'Reschedule Appointment' : 'Book Your Appointment'}
        </Text>
        <Link to={isReschedule ? '/dashboard' : '/'} className={styles.backLink}>
          {isReschedule ? '← Back to Dashboard' : '← Back to Home'}
        </Link>
      </View>

      {isReschedule && (
        <View className={styles.rescheduleNotice}>
          <Text className={styles.rescheduleNoticeText}>
            You are rescheduling an existing appointment. Your original booking will be cancelled when you confirm the new time.
          </Text>
        </View>
      )}

      {/* Progress Indicator */}
      <View className={styles.progressBar}>
        <View className={`${styles.progressStep} ${step >= 1 ? styles.progressStepActive : ''}`}>
          <View className={styles.progressNumber}>1</View>
          <Text className={styles.progressLabel}>Service</Text>
        </View>
        <View className={styles.progressLine} />
        <View className={`${styles.progressStep} ${step >= 2 ? styles.progressStepActive : ''}`}>
          <View className={styles.progressNumber}>2</View>
          <Text className={styles.progressLabel}>Barber</Text>
        </View>
        <View className={styles.progressLine} />
        <View className={`${styles.progressStep} ${step >= 3 ? styles.progressStepActive : ''}`}>
          <View className={styles.progressNumber}>3</View>
          <Text className={styles.progressLabel}>Date & Time</Text>
        </View>
        <View className={styles.progressLine} />
        <View className={`${styles.progressStep} ${step >= 4 ? styles.progressStepActive : ''}`}>
          <View className={styles.progressNumber}>4</View>
          <Text className={styles.progressLabel}>Confirm</Text>
        </View>
      </View>

      {/* Step 1: Select Service */}
      {step === 1 && (
        <View className={styles.stepContainer}>
          <Text className={styles.stepTitle}>Select a Service</Text>
          <View className={styles.serviceGrid}>
            {services.map((service) => (
              <View
                key={service.id}
                className={styles.serviceCard}
                onClick={() => handleServiceSelect(service)}
              >
                <Text className={styles.serviceName}>{service.name}</Text>
                {service.description && (
                  <Text className={styles.serviceDescription}>{service.description}</Text>
                )}
                <Text className={styles.serviceDuration}>{service.duration_minutes} minutes</Text>
                <Text className={styles.servicePoints}>+{service.reward_points} reward points</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Step 2: Select Barber */}
      {step === 2 && (
        <View className={styles.stepContainer}>
          <Text className={styles.stepTitle}>Choose Your Barber</Text>
          <Text className={styles.stepSubtitle}>
            Selected: {selectedService?.name}
          </Text>

          <View className={styles.barberGrid}>
            <View
              className={styles.barberCard}
              onClick={() => handleBarberSelect(null, true)}
            >
              <Text className={styles.barberName}>Any Available Barber</Text>
              <Text className={styles.barberBio}>
                We'll match you with the first available barber
              </Text>
            </View>

            {barbers.map((barber) => (
              <View
                key={barber.id}
                className={styles.barberCard}
                onClick={() => handleBarberSelect(barber, false)}
              >
                {barber.image_url && (
                  <View className={styles.barberImageWrapper}>
                    <img
                      src={barber.image_url}
                      alt={barber.name}
                      className={styles.barberImage}
                    />
                  </View>
                )}
                <Text className={styles.barberName}>{barber.name}</Text>
                {barber.bio && (
                  <Text className={styles.barberBio}>{barber.bio}</Text>
                )}
                {barber.instagram_handle && (
                  <Text className={styles.barberSocial}>@{barber.instagram_handle}</Text>
                )}
              </View>
            ))}
          </View>

          <button className={styles.backButton} onClick={() => setStep(1)}>
            ← Back to Services
          </button>
        </View>
      )}

      {/* Step 3: Select Date & Time */}
      {step === 3 && (
        <View className={styles.stepContainer}>
          <Text className={styles.stepTitle}>Pick Date & Time</Text>
          <Text className={styles.stepSubtitle}>
            {selectedService?.name} with {anyBarber ? 'any available barber' : selectedBarber?.name}
          </Text>

          <View className={calendarStyles.calendarContainer}>
            <View className={calendarStyles.calendarWrapper}>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  return isBefore(date, today) || !isDateAvailable(date);
                }}
                startMonth={today}
                endMonth={twoMonthsFromNow}
                modifiers={{
                  unavailable: (date) => !isDateAvailable(date),
                }}
              />
            </View>

            {selectedDate && (
              <View className={calendarStyles.timeSelectionWrapper}>
                <Text className={calendarStyles.timeLabel}>Available Times</Text>
                <View className={styles.timeGrid}>
                  {getAvailableTimeSlots().length > 0 ? (
                    getAvailableTimeSlots().map((time) => {
                      // Show time period label only if specific barber is selected
                      const timePeriodLabel = selectedBarber ?
                        (getTimePeriod(time, selectedBarber) === 'evening' ? ' (Evening)' : '') : '';

                      return (
                        <button
                          key={time}
                          className={`${styles.timeButton} ${selectedTime === time ? styles.timeButtonActive : ''}`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {formatTimeTo12Hour(time)}{timePeriodLabel}
                        </button>
                      );
                    })
                  ) : (
                    <Text className={calendarStyles.noTimesMessage}>
                      No available times for this date. Please select another date.
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>

          <button className={styles.backButton} onClick={() => setStep(2)}>
            ← Back to Barber Selection
          </button>
        </View>
      )}

      {/* Step 4: Confirm & Pay */}
      {step === 4 && (
        <View className={styles.stepContainer}>
          <Text className={styles.stepTitle}>Confirm Your Booking</Text>

          <View className={styles.confirmCard}>
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
              <Text className={styles.confirmDetail}>{selectedTime ? formatTimeTo12Hour(selectedTime) : ''}</Text>
            </View>

            {selectedBarber && (
              <View className={styles.confirmSection}>
                <Text className={styles.confirmLabel}>Price</Text>
                <Text className={styles.priceAmount}>${calculatePrice().toFixed(2)}</Text>
                <Text className={styles.confirmDetail}>
                  {getTimePeriod(selectedTime, selectedBarber) === 'evening'
                    ? `Evening rate (${formatTimeTo12Hour(selectedBarber.evening_hours_start)}-${formatTimeTo12Hour(selectedBarber.evening_hours_end)})`
                    : `Regular rate (${formatTimeTo12Hour(selectedBarber.regular_hours_start)}-${formatTimeTo12Hour(selectedBarber.regular_hours_end)})`}
                </Text>
              </View>
            )}

            <View className={styles.policySection}>
              <Text className={styles.policyTitle}>Cancellation Policy</Text>
              <Text className={styles.policyText}>
                Cancellations must be made at least 12 hours before your appointment.
                Cancellations within 12 hours will incur a 50% cancellation fee.
              </Text>
            </View>

            <View className={styles.buttonGroup}>
              <button
                className={styles.confirmButton}
                onClick={handleBooking}
                disabled={bookingInProgress}
              >
                {bookingInProgress
                  ? (isReschedule ? 'Rescheduling...' : 'Booking...')
                  : user
                    ? (isReschedule ? 'Confirm Reschedule' : 'Confirm Booking')
                    : 'Login to Book'}
              </button>
              <button className={styles.backButton} onClick={() => setStep(3)}>
                ← Back to Date & Time
              </button>
              <button className={styles.cancelButton} onClick={resetBooking}>
                Start Over
              </button>
            </View>
          </View>
        </View>
      )}
    </View>

      {/* Booking Confirmation Modal */}
      {showConfirmation && confirmedBookingDetails && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationModal}>
            <View className={styles.confirmationIcon}>
              <svg
                className={styles.confirmationCheckmark}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </View>

            <Text className={styles.confirmationTitle}>
              {isReschedule ? 'Appointment Rescheduled!' : 'Booking Confirmed!'}
            </Text>

            <Text className={styles.confirmationMessage}>
              {isReschedule
                ? 'Your appointment has been successfully rescheduled.'
                : `Your appointment is confirmed. You'll earn ${confirmedBookingDetails.rewardPoints} reward points when your appointment is completed!`}
            </Text>

            <View className={styles.confirmationDetails}>
              <View className={styles.confirmationDetailRow}>
                <Text className={styles.confirmationDetailLabel}>Service</Text>
                <Text className={styles.confirmationDetailValue}>
                  {confirmedBookingDetails.serviceName}
                </Text>
              </View>
              <View className={styles.confirmationDetailRow}>
                <Text className={styles.confirmationDetailLabel}>Barber</Text>
                <Text className={styles.confirmationDetailValue}>
                  {confirmedBookingDetails.barberName}
                </Text>
              </View>
              <View className={styles.confirmationDetailRow}>
                <Text className={styles.confirmationDetailLabel}>Date</Text>
                <Text className={styles.confirmationDetailValue}>
                  {confirmedBookingDetails.date}
                </Text>
              </View>
              <View className={styles.confirmationDetailRow}>
                <Text className={styles.confirmationDetailLabel}>Time</Text>
                <Text className={styles.confirmationDetailValue}>
                  {confirmedBookingDetails.time}
                </Text>
              </View>
              <View className={styles.confirmationDetailRow}>
                <Text className={styles.confirmationDetailLabel}>Total</Text>
                <Text className={styles.confirmationDetailValue}>
                  ${confirmedBookingDetails.price.toFixed(2)}
                </Text>
              </View>
            </View>

            <View className={styles.confirmationButtons}>
              <Link to="/dashboard" className={styles.confirmationPrimaryButton}>
                Back to Dashboard
              </Link>
              <Link to="/" className={styles.confirmationSecondaryButton}>
                Back to Home
              </Link>
            </View>
          </div>
        </div>
      )}
    </>
  );
}
