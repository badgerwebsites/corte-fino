// utils/bookingHelpers.ts
import { addDays, format, getDay } from 'date-fns';
import type {
  Barber,
  Booking,
  BarberServicePricing,
  BarberAvailability,
  BarberTimeOff,
  RecurrencePattern,
  TimePeriod,
} from '../types/database.types';
import { RECURRENCE_DAYS } from '../types/database.types';

/**
 * Calculate end time from start time and service duration
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [startHours, startMins] = startTime.split(':').map(Number);
  const totalMinutes = startHours * 60 + startMins + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMins = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
}

/**
 * Determine if a time falls within regular or evening hours for a barber
 */
export function getTimePeriod(time: string, barber: Barber): TimePeriod {
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
}

/**
 * Calculate price based on barber, service, time period, and pricing table
 */
export function calculatePrice(
  barberId: string,
  serviceId: string,
  time: string,
  barber: Barber,
  pricing: BarberServicePricing[],
  defaultPrice: number = 0
): number {
  const timePeriod = getTimePeriod(time, barber);
  const priceEntry = pricing.find(
    p => p.barber_id === barberId &&
         p.service_id === serviceId &&
         p.time_period === timePeriod
  );
  return priceEntry?.price || defaultPrice;
}

/**
 * Check if a time slot overlaps with any existing booking for a specific barber
 */
export function isSlotBooked(
  time: string,
  barberId: string,
  serviceDuration: number,
  existingBookings: Booking[]
): boolean {
  const [slotHours, slotMins] = time.split(':').map(Number);
  const newStart = slotHours * 60 + slotMins;
  const newEnd = newStart + serviceDuration;

  return existingBookings.some(booking => {
    if (booking.barber_id !== barberId) return false;
    if (booking.status === 'cancelled') return false;

    const [startHours, startMins] = booking.start_time.split(':').map(Number);
    const [endHours, endMins] = booking.end_time.split(':').map(Number);
    const bookingStart = startHours * 60 + startMins;
    const bookingEnd = endHours * 60 + endMins;

    // Check for interval overlap
    return newStart < bookingEnd && newEnd > bookingStart;
  });
}

/**
 * Check if a barber is available on a specific date (has availability and no time off)
 */
export function isBarberAvailableOnDate(
  barberId: string,
  date: Date,
  availability: BarberAvailability[],
  timeOff: BarberTimeOff[]
): boolean {
  const dayOfWeek = getDay(date);
  const dateString = format(date, 'yyyy-MM-dd');

  // Check if barber has availability for this day of week
  const hasAvailability = availability.some(
    a => a.barber_id === barberId &&
         a.day_of_week === dayOfWeek &&
         a.is_available
  );

  if (!hasAvailability) return false;

  // Check if barber has time off on this date
  const hasTimeOff = timeOff.some(
    t => t.barber_id === barberId &&
         dateString >= t.start_date &&
         dateString <= t.end_date
  );

  return !hasTimeOff;
}

/**
 * Generate array of dates based on recurrence pattern
 */
export function generateRecurringDates(
  startDate: Date,
  pattern: RecurrencePattern,
  count: number
): Date[] {
  const dates: Date[] = [];
  const dayInterval = RECURRENCE_DAYS[pattern];

  for (let i = 0; i < count; i++) {
    const date = addDays(startDate, i * dayInterval);
    dates.push(date);
  }

  return dates;
}

export interface DateAvailabilityResult {
  date: Date;
  dateString: string;
  available: boolean;
  reason?: string;
}

/**
 * Check availability for multiple dates (for recurring bookings)
 */
export function checkRecurringAvailability(
  dates: Date[],
  time: string,
  barberId: string,
  serviceDuration: number,
  availability: BarberAvailability[],
  timeOff: BarberTimeOff[],
  existingBookings: Booking[]
): DateAvailabilityResult[] {
  return dates.map(date => {
    const dateString = format(date, 'yyyy-MM-dd');

    // Check if barber works on this day of week
    const dayOfWeek = getDay(date);
    const hasAvailability = availability.some(
      a => a.barber_id === barberId &&
           a.day_of_week === dayOfWeek &&
           a.is_available
    );

    if (!hasAvailability) {
      return {
        date,
        dateString,
        available: false,
        reason: 'Barber not available on this day',
      };
    }

    // Check if barber has time off
    const hasTimeOff = timeOff.some(
      t => t.barber_id === barberId &&
           dateString >= t.start_date &&
           dateString <= t.end_date
    );

    if (hasTimeOff) {
      return {
        date,
        dateString,
        available: false,
        reason: 'Barber has time off',
      };
    }

    // Check if slot is already booked on this date
    const dateBookings = existingBookings.filter(
      b => b.booking_date === dateString && b.status !== 'cancelled'
    );
    const slotTaken = isSlotBooked(time, barberId, serviceDuration, dateBookings);

    if (slotTaken) {
      return {
        date,
        dateString,
        available: false,
        reason: 'Time slot already booked',
      };
    }

    return {
      date,
      dateString,
      available: true,
    };
  });
}

/**
 * Get available time slots for a specific barber on a specific date
 */
export function getAvailableTimeSlotsForBarber(
  barberId: string,
  date: Date,
  serviceDuration: number,
  availability: BarberAvailability[],
  existingBookings: Booking[]
): string[] {
  const dayOfWeek = getDay(date);
  const dateString = format(date, 'yyyy-MM-dd');

  const barberAvailability = availability.filter(
    a => a.barber_id === barberId &&
         a.day_of_week === dayOfWeek &&
         a.is_available
  );

  if (barberAvailability.length === 0) return [];

  const dateBookings = existingBookings.filter(
    b => b.booking_date === dateString && b.status !== 'cancelled'
  );

  const slots: string[] = [];

  barberAvailability.forEach(avail => {
    const [startHour, startMin] = avail.start_time.split(':').map(Number);
    const [endHour, endMin] = avail.end_time.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    // Generate 15-minute slots
    for (let minutes = startMinutes; minutes + serviceDuration <= endMinutes; minutes += 15) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeSlot = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

      if (!isSlotBooked(timeSlot, barberId, serviceDuration, dateBookings)) {
        slots.push(timeSlot);
      }
    }
  });

  return slots.sort();
}

/**
 * Format time from 24h to 12h format
 */
export function formatTimeTo12Hour(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
