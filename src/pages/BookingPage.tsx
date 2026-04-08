// pages/BookingPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { addMonths, format, getDay, startOfDay } from 'date-fns';
import { useAuth } from '../auth/useAuth.ts';
import { supabase } from '../lib/supabase';
import type {
  Barber,
  BarberAvailability,
  BarberService,
  BarberServicePricing,
  BarberTimeOff,
  Booking,
  RecurrencePattern,
  Service,
  ShopSettings,
} from '../types/database.types';
import type { Customer } from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { View } from '../ui/View';
import * as styles from '../styles/booking.css';
import { generateRecurringDates, checkRecurringAvailability, type DateAvailabilityResult } from '../utils/bookingHelpers';
import { BookingProgressBar } from '../components/booking/BookingProgressBar';
import { StepCustomerSelect } from '../components/booking/StepCustomerSelect';
import { StepServiceSelect } from '../components/booking/StepServiceSelect';
import { StepBarberSelect } from '../components/booking/StepBarberSelect';
import { StepDateTimeSelect } from '../components/booking/StepDateTimeSelect';
import { StepConfirm, type GuestInfo } from '../components/booking/StepConfirm';
import { BookingConfirmationModal } from '../components/booking/BookingConfirmationModal';
import { Text } from '../ui/Text';

type BookingStep = 0 | 1 | 2 | 3 | 4;

interface LocationState {
  rescheduleFrom?: string;
  serviceId?: string;
  barberId?: string;
  date?: string;
  time?: string;
}

export default function BookingPage() {
  const { user, customer, loading: authLoading } = useAuth();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const isAdminMode = location.state?.adminMode;
  const isAdmin = isAdminMode || !!customer?.is_admin;

  const rescheduleFromId = locationState?.rescheduleFrom;
  const isReschedule = !!rescheduleFromId;

  const [step, setStep] = useState<BookingStep>(isAdmin ? 0 : 1);
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

  // Database data
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [barberServices, setBarberServices] = useState<BarberService[]>([]);
  const [pricing, setPricing] = useState<BarberServicePricing[]>([]);
  const [availability, setAvailability] = useState<BarberAvailability[]>([]);
  const [timeOff, setTimeOff] = useState<BarberTimeOff[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [shopSettings, setShopSettings] = useState<ShopSettings | null>(null);

  // Booking selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [anyBarber, setAnyBarber] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');

  // Guest booking
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({ firstName: '', lastName: '', email: '', phone: '' });

  // Recurring appointments (admin only)
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>('weekly');
  const [recurrenceCount, setRecurrenceCount] = useState(8);
  const [recurringAvailability, setRecurringAvailability] = useState<DateAvailabilityResult[]>([]);

  // ─── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedDate) { setExistingBookings([]); return; }
    const fetchExistingBookings = async () => {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('bookings').select('*').eq('booking_date', dateString).neq('status', 'cancelled');
      if (error) { console.error('Error fetching existing bookings:', error); return; }
      setExistingBookings(data || []);
    };
    fetchExistingBookings();
  }, [selectedDate]);

  useEffect(() => {
    if (!loading && locationState) {
      if (locationState.barberId) {
        const barber = barbers.find(b => b.id === locationState.barberId);
        if (barber) {
          setSelectedBarber(barber);
          setAnyBarber(false);
          setStep(2);
        }
      }
      if (locationState.serviceId) {
        const service = services.find(s => s.id === locationState.serviceId);
        if (service) {
          setSelectedService(service);
          if (locationState.barberId) setStep(3);
        }
      }
      if (locationState.date) {
        setSelectedDate(new Date(locationState.date + 'T00:00:00'));
      }
      if (locationState.time) {
        setSelectedTime(locationState.time);
      }
    }
  }, [loading, locationState, services, barbers]);

  useEffect(() => {
    if (!loading && user && services.length > 0 && barbers.length > 0) {
      const savedState = localStorage.getItem('pendingBooking');
      if (!savedState) return;
      try {
        const bookingState = JSON.parse(savedState);
        if (Date.now() - bookingState.savedAt > 1000 * 60 * 60) {
          localStorage.removeItem('pendingBooking');
          return;
        }
        if (bookingState.serviceId) {
          const service = services.find(s => s.id === bookingState.serviceId);
          if (service) setSelectedService(service);
        }
        if (bookingState.barberId) {
          const barber = barbers.find(b => b.id === bookingState.barberId);
          if (barber) setSelectedBarber(barber);
        }
        setAnyBarber(bookingState.anyBarber || false);
        if (bookingState.selectedDate) setSelectedDate(new Date(bookingState.selectedDate));
        if (bookingState.selectedTime) setSelectedTime(bookingState.selectedTime);
        if (bookingState.step) setStep(bookingState.step);
        localStorage.removeItem('pendingBooking');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch (e) {
        console.error('Error restoring booking state:', e);
        localStorage.removeItem('pendingBooking');
      }
    }
  }, [loading, user, services, barbers]);

  useEffect(() => {
    if (!isRecurring || !selectedDate || !selectedTime || !selectedBarber || !selectedService) {
      setRecurringAvailability([]);
      return;
    }
    const dates = generateRecurringDates(selectedDate, recurrencePattern, recurrenceCount);
    const results = checkRecurringAvailability(
      dates, selectedTime, selectedBarber.id, selectedService.duration_minutes,
      availability, timeOff, existingBookings
    );
    setRecurringAvailability(results);
  }, [isRecurring, selectedDate, selectedTime, selectedBarber, selectedService, recurrencePattern, recurrenceCount, availability, timeOff, existingBookings]);

  // ─── Data loading ──────────────────────────────────────────────────────────

  const loadData = async () => {
    try {
      const [servicesRes, barbersRes, barberServicesRes, pricingRes, availabilityRes, timeOffRes, shopSettingsRes] = await Promise.all([
        supabase.from('services').select('*').order('name'),
        supabase.from('barbers').select('*').eq('is_active', true).order('name'),
        supabase.from('barber_services').select('*'),
        supabase.from('barber_service_pricing').select('*'),
        supabase.from('barber_availability').select('*'),
        supabase.from('barber_time_off').select('*'),
        supabase.from('shop_settings').select('*').single(),
      ]);

      if (servicesRes.error) throw servicesRes.error;
      if (barbersRes.error) throw barbersRes.error;
      if (pricingRes.error) throw pricingRes.error;

      setServices(servicesRes.data || []);
      setBarbers(barbersRes.data || []);
      setBarberServices(barberServicesRes.data || []);
      setPricing(pricingRes.data || []);
      setAvailability(availabilityRes.data || []);
      setTimeOff(timeOffRes.data || []);
      setShopSettings(shopSettingsRes.data || null);
    } catch (error) {
      console.error('Error loading booking data:', error);
      alert('Failed to load booking options');
    } finally {
      setLoading(false);
    }
  };

  // ─── Selection handlers ────────────────────────────────────────────────────

  const handleBarberSelect = (barber: Barber | null, anyAvailable = false) => {
    setSelectedBarber(barber);
    setAnyBarber(anyAvailable);
    setSelectedService(null);
    setStep(2);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(3);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (anyBarber && selectedDate) {
      const dayOfWeek = getDay(selectedDate);
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const resolved = resolveAnyBarber(dateString, dayOfWeek, time);
      setSelectedBarber(resolved);
    }
    setStep(4);
  };

  // ─── Price & availability helpers ─────────────────────────────────────────

  const getTimePeriod = (time: string, barber: Barber): 'regular' | 'evening' => {
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const [eveningHours, eveningMinutes] = barber.evening_hours_start.split(':').map(Number);
    const eveningStartMinutes = eveningHours * 60 + eveningMinutes;
    const [eveningEndHours, eveningEndMins] = barber.evening_hours_end.split(':').map(Number);
    const eveningEndMinutes = eveningEndHours * 60 + eveningEndMins;
    return (timeInMinutes >= eveningStartMinutes && timeInMinutes < eveningEndMinutes) ? 'evening' : 'regular';
  };

  const calculatePrice = (): number => {
    if (!selectedService || !selectedBarber || !selectedTime || !selectedDate) return 0;
    const timePeriod = getTimePeriod(selectedTime, selectedBarber);
    const dayOfWeek = getDay(selectedDate);
    const priceEntry = pricing.find(
      p => p.barber_id === selectedBarber.id &&
           p.service_id === selectedService.id &&
           p.time_period === timePeriod &&
           p.day_of_week === dayOfWeek
    );
    return priceEntry?.price || 0;
  };

  const isDateAvailable = (date: Date): boolean => {
    const dayOfWeek = getDay(date);
    const dateString = format(date, 'yyyy-MM-dd');

    if (!selectedBarber && anyBarber) {
      return barbers.some(barber => {
        const hasAvailability = availability.some(
          a => a.barber_id === barber.id && a.day_of_week === dayOfWeek && a.is_available
        );
        const hasTimeOff = timeOff.some(
          t => t.barber_id === barber.id && dateString >= t.start_date && dateString <= t.end_date
        );
        return hasAvailability && !hasTimeOff;
      });
    }

    if (!selectedBarber) return true;

    const hasAvailability = availability.some(
      a => a.barber_id === selectedBarber.id && a.day_of_week === dayOfWeek && a.is_available
    );
    if (!hasAvailability) return false;

    const hasTimeOff = timeOff.some(
      t => t.barber_id === selectedBarber.id && dateString >= t.start_date && dateString <= t.end_date
    );
    return !hasTimeOff;
  };

  const isSlotBooked = (time: string, barberId: string, serviceDuration: number): boolean => {
    const [slotHours, slotMins] = time.split(':').map(Number);
    const newStart = slotHours * 60 + slotMins;
    const newEnd = newStart + serviceDuration;

    return existingBookings.some(booking => {
      if (booking.barber_id !== barberId) return false;
      const [startHours, startMins] = booking.start_time.split(':').map(Number);
      const [endHours, endMins] = booking.end_time.split(':').map(Number);
      const bookingStart = startHours * 60 + startMins;
      const bookingEnd = endHours * 60 + endMins;
      return newStart < bookingEnd && newEnd > bookingStart;
    });
  };

  const filterPastTimeSlots = (slots: string[]): string[] => {
    if (!selectedDate) return slots;
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');
    if (selectedDateStr !== todayStr) return slots;
    const cutoffTime = now.getHours() * 60 + now.getMinutes() + 15;
    return slots.filter(slot => {
      const [hours, mins] = slot.split(':').map(Number);
      return hours * 60 + mins >= cutoffTime;
    });
  };

  const getAvailableTimeSlots = (): string[] => {
    if (!selectedDate) return [];
    const dayOfWeek = getDay(selectedDate);
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    const hasSlotPricing = (barberId: string, timeSlot: string): boolean => {
      if (!selectedService) return false;
      const barber = barbers.find(b => b.id === barberId);
      if (!barber) return false;
      const timePeriod = getTimePeriod(timeSlot, barber);
      return pricing.some(
        p => p.barber_id === barberId &&
             p.service_id === selectedService.id &&
             p.time_period === timePeriod &&
             p.day_of_week === dayOfWeek &&
             p.price > 0
      );
    };

    if (!selectedBarber && anyBarber) {
      const slotAvailability = new Map<string, boolean>();
      barbers.forEach(barber => {
        const hasAvailability = availability.some(
          a => a.barber_id === barber.id && a.day_of_week === dayOfWeek && a.is_available
        );
        const hasTimeOff = timeOff.some(
          t => t.barber_id === barber.id && dateString >= t.start_date && dateString <= t.end_date
        );
        if (hasAvailability && !hasTimeOff) {
          availability
            .filter(a => a.barber_id === barber.id && a.day_of_week === dayOfWeek && a.is_available)
            .forEach(avail => {
              const [startHour, startMin] = avail.start_time.split(':').map(Number);
              const [endHour, endMin] = avail.end_time.split(':').map(Number);
              const startMinutes = startHour * 60 + startMin;
              const endMinutes = endHour * 60 + endMin;
              const serviceDuration = selectedService?.duration_minutes || 0;
              for (let m = startMinutes; m + serviceDuration <= endMinutes; m += 15) {
                const timeSlot = `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;
                if (selectedService &&
                    !isSlotBooked(timeSlot, barber.id, selectedService.duration_minutes) &&
                    hasSlotPricing(barber.id, timeSlot)) {
                  slotAvailability.set(timeSlot, true);
                }
              }
            });
        }
      });
      return filterPastTimeSlots(Array.from(slotAvailability.keys()).sort());
    }

    if (!selectedBarber) return [];

    const barberAvailability = availability.filter(
      a => a.barber_id === selectedBarber.id && a.day_of_week === dayOfWeek && a.is_available
    );
    if (barberAvailability.length === 0) return [];

    const slots: string[] = [];
    barberAvailability.forEach(avail => {
      const [startHour, startMin] = avail.start_time.split(':').map(Number);
      const [endHour, endMin] = avail.end_time.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const serviceDuration = selectedService?.duration_minutes || 0;
      for (let m = startMinutes; m + serviceDuration <= endMinutes; m += 15) {
        const timeSlot = `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`;
        if (selectedService &&
            !isSlotBooked(timeSlot, selectedBarber.id, selectedService.duration_minutes) &&
            hasSlotPricing(selectedBarber.id, timeSlot)) {
          slots.push(timeSlot);
        }
      }
    });
    return filterPastTimeSlots(slots.sort());
  };

  // ─── Formatting helpers ────────────────────────────────────────────────────

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatTimeTo12Hour = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // ─── Email notifications ──────────────────────────────────────────────────

  const sendConfirmationEmail = async (params: {
    email: string;
    firstName: string;
    lastName: string;
    serviceName: string;
    barberName: string;
    date: Date;
    time: string;
    price: number;
    durationMinutes?: number;
  }) => {
    const body = {
      customerEmail: params.email,
      customerName: `${params.firstName} ${params.lastName}`,
      serviceName: params.serviceName,
      barberName: params.barberName,
      bookingDate: formatDate(params.date),
      startTime: formatTimeTo12Hour(params.time),
      totalPrice: params.price,
      bookingDateRaw: format(params.date, 'yyyy-MM-dd'),
      startTimeRaw: params.time,
      durationMinutes: params.durationMinutes,
    };
    console.log('[email] invoking send-booking-confirmation with:', body);
    const { data, error } = await supabase.functions.invoke('send-booking-confirmation', { body });
    if (error) console.error('[email] send-booking-confirmation error:', error);
    else console.log('[email] send-booking-confirmation response:', data);
  };

  const sendRescheduleEmail = async (params: {
    email: string;
    firstName: string;
    lastName: string;
    serviceName: string;
    barberName: string;
    date: Date;
    time: string;
    price: number;
    rescheduledBy: 'customer' | 'admin';
    durationMinutes?: number;
  }) => {
    const body = {
      customerEmail: params.email,
      customerName: `${params.firstName} ${params.lastName}`,
      serviceName: params.serviceName,
      barberName: params.barberName,
      bookingDate: formatDate(params.date),
      startTime: formatTimeTo12Hour(params.time),
      totalPrice: params.price,
      rescheduledBy: params.rescheduledBy,
      bookingDateRaw: format(params.date, 'yyyy-MM-dd'),
      startTimeRaw: params.time,
      durationMinutes: params.durationMinutes,
    };
    console.log('[email] invoking send-reschedule-notification with:', body);
    const { data, error } = await supabase.functions.invoke('send-reschedule-notification', { body });
    if (error) console.error('[email] send-reschedule-notification error:', error);
    else console.log('[email] send-reschedule-notification response:', data);
  };

  // ─── Round-robin barber selection ─────────────────────────────────────────

  const resolveAnyBarber = (dateString: string, dayOfWeek: number, time: string): Barber | null => {
    const [slotH, slotM] = time.split(':').map(Number);
    const slotMinutes = slotH * 60 + slotM;
    const serviceDuration = selectedService?.duration_minutes || 0;

    const availableBarbers = barbers.filter(barber => {
      // Must offer this service
      const offersService = selectedService
        ? barberServices.some(bs => bs.barber_id === barber.id && bs.service_id === selectedService.id)
        : false;
      if (!offersService) return false;

      // Must have a price > 0 for this service on this day + time period
      const timePeriod = getTimePeriod(time, barber);
      const hasPricing = selectedService
        ? pricing.some(
            p => p.barber_id === barber.id &&
                 p.service_id === selectedService.id &&
                 p.time_period === timePeriod &&
                 p.day_of_week === dayOfWeek &&
                 p.price > 0
          )
        : false;
      if (!hasPricing) return false;

      // Must have the specific time slot within their availability window
      const timeInWindow = availability.some(a => {
        if (a.barber_id !== barber.id || a.day_of_week !== dayOfWeek || !a.is_available) return false;
        const [startH, startM] = a.start_time.split(':').map(Number);
        const [endH, endM] = a.end_time.split(':').map(Number);
        const windowStart = startH * 60 + startM;
        const windowEnd = endH * 60 + endM;
        return slotMinutes >= windowStart && slotMinutes + serviceDuration <= windowEnd;
      });
      if (!timeInWindow) return false;

      // Must not be on time off
      const hasTimeOff = timeOff.some(
        t => t.barber_id === barber.id && dateString >= t.start_date && dateString <= t.end_date
      );
      if (hasTimeOff) return false;

      // Must not already have a booking at this slot
      const isBooked = selectedService
        ? isSlotBooked(time, barber.id, selectedService.duration_minutes)
        : false;
      return !isBooked;
    });

    if (availableBarbers.length === 0) return null;

    const lastBarberId = shopSettings?.last_rotation_barber_id;
    if (availableBarbers.length === 1 || !lastBarberId) return availableBarbers[0];

    const lastIndex = barbers.findIndex(b => b.id === lastBarberId);
    for (let i = 1; i <= barbers.length; i++) {
      const nextBarber = barbers[(lastIndex + i) % barbers.length];
      if (availableBarbers.some(ab => ab.id === nextBarber.id)) return nextBarber;
    }
    return availableBarbers[0];
  };

  const updateRotation = async (barberId: string) => {
    if (!shopSettings?.id) return;
    await supabase.from('shop_settings').update({ last_rotation_barber_id: barberId }).eq('id', shopSettings.id);
    setShopSettings(prev => prev ? { ...prev, last_rotation_barber_id: barberId } : prev);
  };

  // ─── Booking state persistence ────────────────────────────────────────────

  const saveBookingState = () => {
    localStorage.setItem('pendingBooking', JSON.stringify({
      serviceId: selectedService?.id,
      barberId: selectedBarber?.id,
      anyBarber,
      selectedDate: selectedDate?.toISOString(),
      selectedTime,
      step,
      savedAt: Date.now(),
    }));
  };

  // ─── Guest booking ─────────────────────────────────────────────────────────

  const handleGuestBooking = async () => {
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      alert('Please fill in all guest information fields');
      return;
    }
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Please complete all booking selections');
      return;
    }

    setBookingInProgress(true);
    try {
      let bookingBarber = selectedBarber;
      if (anyBarber && !selectedBarber) {
        const dayOfWeek = getDay(selectedDate);
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        bookingBarber = resolveAnyBarber(dateString, dayOfWeek, selectedTime);
        if (!bookingBarber) {
          alert('No barber available for this time slot. Please select a different time.');
          setBookingInProgress(false);
          return;
        }
        await updateRotation(bookingBarber.id);
      }

      if (!bookingBarber) {
        alert('No barber available for this time slot. Please select a different time.');
        setBookingInProgress(false);
        return;
      }

      const [startHours, startMins] = selectedTime.split(':').map(Number);
      const totalMinutes = startHours * 60 + startMins + selectedService.duration_minutes;
      const endTime = `${Math.floor(totalMinutes / 60).toString().padStart(2, '0')}:${(totalMinutes % 60).toString().padStart(2, '0')}`;

      const timePeriod = getTimePeriod(selectedTime, bookingBarber);
      const dayOfWeekForGuestPrice = getDay(selectedDate);
      const priceEntry = pricing.find(
        p => p.barber_id === bookingBarber!.id &&
             p.service_id === selectedService.id &&
             p.time_period === timePeriod &&
             p.day_of_week === dayOfWeekForGuestPrice
      );
      const totalPrice = priceEntry?.price || selectedService.base_price;

      if (totalPrice <= 0) {
        alert('This service does not have a price set for the selected time. Please choose a different time.');
        setBookingInProgress(false);
        return;
      }

      const { error: bookingError } = await supabase.from('bookings').insert({
        customer_id: null,
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
        is_guest: true,
        guest_first_name: guestInfo.firstName,
        guest_last_name: guestInfo.lastName,
        guest_email: guestInfo.email,
        guest_phone: guestInfo.phone,
      });
      if (bookingError) throw bookingError;

      setConfirmedBookingDetails({
        serviceName: selectedService.name,
        barberName: bookingBarber.name,
        date: formatDate(selectedDate),
        time: formatTimeTo12Hour(selectedTime),
        price: totalPrice,
        rewardPoints: 0,
      });

      // Send confirmation email to guest
      await sendConfirmationEmail({
        email: guestInfo.email,
        firstName: guestInfo.firstName,
        lastName: guestInfo.lastName,
        serviceName: selectedService.name,
        barberName: bookingBarber.name,
        date: selectedDate,
        time: selectedTime,
        price: totalPrice,
        durationMinutes: selectedService.duration_minutes,
      });

      setShowConfirmation(true);
      setShowGuestForm(false);
    } catch (error) {
      console.error('Error creating guest booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setBookingInProgress(false);
    }
  };

  // ─── Authenticated booking ─────────────────────────────────────────────────

  const handleBooking = async () => {
    if (!user || !customer) return;
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Please complete all booking selections');
      return;
    }
    if (isAdmin && !selectedCustomer) {
      alert('Please select a customer.');
      return;
    }

    setBookingInProgress(true);
    try {
      let bookingBarber = selectedBarber;
      if (anyBarber && !selectedBarber) {
        const dayOfWeek = getDay(selectedDate);
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        bookingBarber = resolveAnyBarber(dateString, dayOfWeek, selectedTime);
        if (!bookingBarber) {
          alert('No barber available for this time slot. Please select a different time.');
          setBookingInProgress(false);
          return;
        }
        await updateRotation(bookingBarber.id);
      }

      if (!bookingBarber) {
        alert('No barber available for this time slot. Please select a different time.');
        setBookingInProgress(false);
        return;
      }

      const [startHours, startMins] = selectedTime.split(':').map(Number);
      const totalMinutes = startHours * 60 + startMins + selectedService.duration_minutes;
      const endTime = `${Math.floor(totalMinutes / 60).toString().padStart(2, '0')}:${(totalMinutes % 60).toString().padStart(2, '0')}`;

      const timePeriod = getTimePeriod(selectedTime, bookingBarber);
      const dayOfWeekForPrice = getDay(selectedDate);
      const priceEntry = pricing.find(
        p => p.barber_id === bookingBarber!.id &&
             p.service_id === selectedService.id &&
             p.time_period === timePeriod &&
             p.day_of_week === dayOfWeekForPrice
      );
      const totalPrice = priceEntry?.price || selectedService.base_price;

      if (totalPrice <= 0) {
        alert('This service does not have a price set for the selected time. Please choose a different time.');
        setBookingInProgress(false);
        return;
      }

      if (rescheduleFromId) {
        const { error: deleteError } = await supabase.from('bookings').delete().eq('id', rescheduleFromId);
        if (deleteError) console.error('Error deleting original booking:', deleteError);
      }

      if (isRecurring && isAdmin && recurringAvailability.length > 0) {
        const groupId = crypto.randomUUID();
        const availableDates = recurringAvailability.filter(r => r.available);
        if (availableDates.length === 0) {
          alert('No available dates for the recurring appointment. Please adjust your selection.');
          setBookingInProgress(false);
          return;
        }
        const bookingsToInsert = availableDates.map((result, index) => ({
          customer_id: selectedCustomer?.id,
          created_by_admin: true,
          barber_id: bookingBarber!.id,
          service_id: selectedService.id,
          booking_date: result.dateString,
          start_time: selectedTime,
          end_time: endTime,
          total_price: totalPrice,
          status: 'confirmed' as const,
          cancellation_fee_charged: false,
          reminder_sent: false,
          review_request_sent: false,
          recurrence_group_id: groupId,
          recurrence_pattern: recurrencePattern,
          recurrence_index: index,
        }));
        const { error: bookingError } = await supabase.from('bookings').insert(bookingsToInsert);
        if (bookingError) throw bookingError;
        const skippedCount = recurringAvailability.length - availableDates.length;
        setConfirmedBookingDetails({
          serviceName: selectedService.name,
          barberName: bookingBarber.name,
          date: `${availableDates.length} appointments scheduled${skippedCount > 0 ? ` (${skippedCount} skipped)` : ''}`,
          time: formatTimeTo12Hour(selectedTime),
          price: totalPrice * availableDates.length,
          rewardPoints: selectedService.reward_points * availableDates.length,
        });
        // Send recurring confirmation email with all dates
        if (selectedCustomer?.email && availableDates.length > 0) {
          const body = {
            customerEmail: selectedCustomer.email,
            customerName: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
            serviceName: selectedService.name,
            barberName: bookingBarber.name,
            startTime: formatTimeTo12Hour(selectedTime),
            totalPrice,
            dates: availableDates.map(r => r.dateString),
            startTimeRaw: selectedTime,
            durationMinutes: selectedService.duration_minutes,
          };
          const { error: emailError } = await supabase.functions.invoke('send-recurring-confirmation', { body });
          if (emailError) console.error('[email] send-recurring-confirmation error:', emailError);
        }
      } else {
        const { error: bookingError } = await supabase.from('bookings').insert({
          customer_id: isAdmin ? selectedCustomer?.id : user.id,
          created_by_admin: isAdmin,
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
        setConfirmedBookingDetails({
          serviceName: selectedService.name,
          barberName: bookingBarber.name,
          date: formatDate(selectedDate),
          time: formatTimeTo12Hour(selectedTime),
          price: totalPrice,
          rewardPoints: rescheduleFromId ? 0 : selectedService.reward_points,
        });
        // Send confirmation or reschedule email
        const targetCustomer = isAdmin ? selectedCustomer : customer;
        if (targetCustomer?.email) {
          if (rescheduleFromId) {
            await sendRescheduleEmail({
              email: targetCustomer.email,
              firstName: targetCustomer.first_name,
              lastName: targetCustomer.last_name,
              serviceName: selectedService.name,
              barberName: bookingBarber.name,
              date: selectedDate,
              time: selectedTime,
              price: totalPrice,
              rescheduledBy: isAdmin ? 'admin' : 'customer',
              durationMinutes: selectedService.duration_minutes,
            });
          } else {
            await sendConfirmationEmail({
              email: targetCustomer.email,
              firstName: targetCustomer.first_name,
              lastName: targetCustomer.last_name,
              serviceName: selectedService.name,
              barberName: bookingBarber.name,
              date: selectedDate,
              time: selectedTime,
              price: totalPrice,
              durationMinutes: selectedService.duration_minutes,
            });
          }
        }
      }

      setShowConfirmation(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setBookingInProgress(false);
    }
  };

  // ─── Derived values for StepConfirm ───────────────────────────────────────

  const price = calculatePrice();
  const timePeriodLabel = (() => {
    if (!selectedBarber || !selectedTime || !selectedDate) return '';
    if (getTimePeriod(selectedTime, selectedBarber) === 'evening') {
      return `Evening Rate (${formatTimeTo12Hour(selectedBarber.evening_hours_start)} - ${formatTimeTo12Hour(selectedBarber.evening_hours_end)})`;
    }
    const dayOfWeek = getDay(selectedDate);
    const dayBlocks = availability.filter(
      a => a.barber_id === selectedBarber.id && a.day_of_week === dayOfWeek && a.is_available
    );
    const workStart = dayBlocks.length > 0
      ? dayBlocks.reduce((min, a) => a.start_time < min ? a.start_time : min, dayBlocks[0].start_time)
      : selectedBarber.regular_hours_start;
    const workEnd = dayBlocks.length > 0
      ? dayBlocks.reduce((max, a) => a.end_time > max ? a.end_time : max, dayBlocks[0].end_time)
      : selectedBarber.evening_hours_end;
    const [h, m] = selectedTime.split(':').map(Number);
    const timeMinutes = h * 60 + m;
    const [eh, em] = selectedBarber.evening_hours_start.split(':').map(Number);
    const eveningStartMinutes = eh * 60 + em;
    if (timeMinutes < eveningStartMinutes) {
      return `Regular Rate (${formatTimeTo12Hour(workStart)} - ${formatTimeTo12Hour(selectedBarber.evening_hours_start)})`;
    }
    return `Regular Rate (${formatTimeTo12Hour(selectedBarber.evening_hours_end)} - ${formatTimeTo12Hour(workEnd)})`;
  })();

  const today = startOfDay(new Date());
  const endMonth = addMonths(today, 6);

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading) return null;

  return (
    <>
      <Navigation />
      <View className={styles.container}>
        <View className={styles.backLink}>
          <Link to={user ? '/dashboard' : '/'} className={styles.link}>
            ← Back
          </Link>
        </View>

        {isReschedule && (
          <View className={styles.rescheduleNoticeWrapper}>
            <View className={styles.rescheduleNotice}>
              <Text className={styles.rescheduleNoticeText}>
                You are rescheduling an appointment
              </Text>
            </View>
          </View>
        )}

        <BookingProgressBar step={step} isAdmin={isAdmin} />

        {isAdmin && step === 0 && (
          <StepCustomerSelect
            selectedCustomer={selectedCustomer}
            onSelect={(c) => { setSelectedCustomer(c); setStep(1); }}
            onClear={() => setSelectedCustomer(null)}
          />
        )}

        {step === 1 && (
          <StepBarberSelect
            barbers={barbers}
            isAdmin={isAdmin}
            onSelect={handleBarberSelect}
            onBack={() => {
              setSelectedBarber(null);
              setAnyBarber(false);
              setSelectedService(null);
              setSelectedDate(undefined);
              setSelectedTime('');
              setStep(0);
            }}
          />
        )}

        {step === 2 && (
          <StepServiceSelect
            services={
              anyBarber
                ? services.filter((s) =>
                    barberServices.some((bs) => bs.service_id === s.id &&
                      availability.some((a) => a.barber_id === bs.barber_id && a.is_available)
                    )
                  )
                : !selectedBarber
                  ? services
                  : services.filter((s) =>
                      barberServices.some(
                        (bs) => bs.barber_id === selectedBarber.id && bs.service_id === s.id
                      )
                    )
            }
            onSelect={handleServiceSelect}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepDateTimeSelect
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedBarber={selectedBarber}
            today={today}
            endMonth={endMonth}
            timeSlots={getAvailableTimeSlots()}
            isDateAvailable={isDateAvailable}
            getTimePeriod={getTimePeriod}
            formatTimeTo12Hour={formatTimeTo12Hour}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <StepConfirm
            selectedService={selectedService}
            selectedBarber={selectedBarber}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedCustomer={selectedCustomer}
            isAdmin={isAdmin}
            isReschedule={isReschedule}
            price={price}
            timePeriodLabel={timePeriodLabel}
            isRecurring={isRecurring}
            recurrencePattern={recurrencePattern}
            recurrenceCount={recurrenceCount}
            recurringAvailability={recurringAvailability}
            authCustomer={customer}
            authLoading={authLoading}
            user={user}
            showGuestForm={showGuestForm}
            guestInfo={guestInfo}
            bookingInProgress={bookingInProgress}
            formatDate={formatDate}
            formatTimeTo12Hour={formatTimeTo12Hour}
            getTimePeriod={getTimePeriod}
            onBack={() => {
              if (anyBarber) setSelectedBarber(null);
              setStep(3);
            }}
            onConfirm={handleBooking}
            onGuestConfirm={handleGuestBooking}
            onLoginToBook={() => { saveBookingState(); navigate('/login?redirect=/book'); }}
            onShowGuestForm={() => setShowGuestForm(true)}
            onHideGuestForm={() => setShowGuestForm(false)}
            onGuestInfoChange={(updates) => setGuestInfo(prev => ({ ...prev, ...updates }))}
            onRecurringToggle={setIsRecurring}
            onPatternChange={setRecurrencePattern}
            onCountChange={setRecurrenceCount}
          />
        )}
      </View>

      {showConfirmation && confirmedBookingDetails && (
        <BookingConfirmationModal
          details={confirmedBookingDetails}
          isReschedule={isReschedule}
        />
      )}
    </>
  );
}
