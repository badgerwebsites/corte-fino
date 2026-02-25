// components/AdminCalendar.tsx
import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, addMonths, subMonths, parseISO } from 'date-fns';
import { DndContext, DragOverlay, useDraggable, useDroppable, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { supabase } from '../lib/supabase';
import type { Barber, BookingWithDetails, Service, BarberServicePricing, BarberAvailability, BarberTimeOff, Booking } from '../types/database.types';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/adminCalendar.css';
// import * as bookingStyles from '../styles/adminBooking.css';
import { ChevronLeft, ChevronRight, Check, Ban, Circle } from "lucide-react";
// import { AdminBookingModal } from './AdminBookingModal';
import { canRescheduleToSlot, calculateEndTime } from '../utils/bookingHelpers';
import { useNavigate } from 'react-router-dom';

interface AdminCalendarProps {
  barbers: Barber[];
  services: Service[];
  pricing: BarberServicePricing[];
  availability: BarberAvailability[];
  timeOff: BarberTimeOff[];
  onBookingUpdate?: () => void;
}

type ViewMode = 'day' | 'week' | 'month';
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export function AdminCalendar({ barbers, availability, timeOff, onBookingUpdate }: AdminCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBarberId, setSelectedBarberId] = useState<string>('all');
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const navigate = useNavigate();

  // Drag and drop state
  const [draggedBooking, setDraggedBooking] = useState<BookingWithDetails | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<{
    booking: BookingWithDetails;
    newDate: Date;
    newTime: string;
  } | null>(null);
  const [allBookingsForValidation, setAllBookingsForValidation] = useState<Booking[]>([]);
  const [activeDropTarget, setActiveDropTarget] = useState<{ dateStr: string; time: string } | null>(null);

  // Cancel confirmation for recurring appointments
  const [cancelTarget, setCancelTarget] = useState<BookingWithDetails | null>(null);

  // Configure drag sensor with distance constraint (allows clicks to work)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag only starts after moving 8px
      },
    })
  );

  const BARBER_COLORS: Record<
  string,
  { accent: string; bg: string }
> = {
  'fb04ef37-1cff-40df-a2ec-dfe9a48cd32b': {
    accent: "#60a5fa",
    bg: "#1e293b",
  },
  '780ec7e0-4ce1-4212-947f-511b6c9f3a88': {
    accent: "#4ade80",
    bg: "#1f2e26",
  },
  '3087d11b-1282-4c2f-802f-e5287f61e996': {
    accent: "#f87171",
    bg: "#2a1f22",
  },
};

const getBarberColors = (booking: BookingWithDetails) => {
  // Show grey for completed appointments so barbers can easily see what's done
  if (booking.status === 'completed') {
    return {
      accent: '#6b7280',
      bg: '#374151',
    };
  }

  return booking.barber_id && BARBER_COLORS[booking.barber_id]
    ? BARBER_COLORS[booking.barber_id]
    : {
        accent: '#64748b',
        bg: '#1f2937',
      };
};

  const renderStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case 'completed':
        return <Check size={18} color="#22c55e" strokeWidth={4} />;
      case 'cancelled':
        return <Ban size={14} color="#ef4444" strokeWidth={2.5} />;
      case 'no_show':
        return <Circle size={12} color="#94a3b8" fill="#94a3b8" />;
      default:
        return null;
    }
  };

  const loadBookings = useCallback(async () => {
    try {
      let startDate: string;
      let endDate: string;

      if (viewMode === 'day') {
        startDate = format(currentDate, 'yyyy-MM-dd');
        endDate = startDate;
      } else if (viewMode === 'week') {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
        startDate = format(weekStart, 'yyyy-MM-dd');
        endDate = format(weekEnd, 'yyyy-MM-dd');
      } else {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
        startDate = format(calendarStart, 'yyyy-MM-dd');
        endDate = format(calendarEnd, 'yyyy-MM-dd');
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(first_name, last_name, phone, email, reward_points),
          barber:barbers(id, name),
          service:services(name, duration_minutes, reward_points)
        `)
        .gte('booking_date', startDate)
        .lte('booking_date', endDate)
        .neq('status', 'cancelled')
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } 
  }, [currentDate, viewMode]);

    useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-calendar-bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          loadBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadBookings]);

  // Load all bookings for validation when dragging (need more than visible range)
  useEffect(() => {
    const loadAllBookingsForValidation = async () => {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
      const { data } = await supabase
        .from('bookings')
        .select('*')
        .gte('booking_date', format(weekStart, 'yyyy-MM-dd'))
        .lte('booking_date', format(weekEnd, 'yyyy-MM-dd'))
        .neq('status', 'cancelled');
      setAllBookingsForValidation(data || []);
    };
    loadAllBookingsForValidation();
  }, [currentDate, bookings]);

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const bookingId = event.active.id as string;
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setDraggedBooking(booking);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over && over.id.toString().startsWith('slot-')) {
      const dropId = over.id as string;
      const parts = dropId.split('-');
      const dateStr = parts.slice(1, 4).join('-');
      const timeStr = parts.slice(4).join(':');
      setActiveDropTarget({ dateStr, time: timeStr });
    } else {
      setActiveDropTarget(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedBooking(null);
    setActiveDropTarget(null);

    if (!over || !active) return;

    const bookingId = active.id as string;
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Parse the drop target ID (format: "slot-{date}-{time}")
    const dropId = over.id as string;
    if (!dropId.startsWith('slot-')) return;

    const parts = dropId.split('-');
    const dateStr = parts.slice(1, 4).join('-'); // yyyy-MM-dd
    const timeStr = parts.slice(4).join(':'); // HH:MM

    const newDate = parseISO(dateStr);
    const serviceDuration = booking.service?.duration_minutes || 30;

    // Validate the reschedule
    const { canReschedule } = canRescheduleToSlot(
      booking.id,
      booking.barber_id || '',
      newDate,
      timeStr,
      serviceDuration,
      availability,
      timeOff,
      allBookingsForValidation
    );

    // Check if time actually changed (not dropping on same slot)
    const originalDate = booking.booking_date;
    const originalTime = booking.start_time.substring(0, 5);
    const isSameSlot = dateStr === originalDate && timeStr === originalTime;

    if (canReschedule && !isSameSlot) {
      // Show confirmation modal
      setRescheduleTarget({
        booking,
        newDate,
        newTime: timeStr,
      });
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleTarget) return;

    const { booking, newDate, newTime } = rescheduleTarget;
    const serviceDuration = booking.service?.duration_minutes || 30;
    const newEndTime = calculateEndTime(newTime, serviceDuration);

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          booking_date: format(newDate, 'yyyy-MM-dd'),
          start_time: newTime,
          end_time: newEndTime,
        })
        .eq('id', booking.id);

      if (error) throw error;

      // TODO: Send Twilio SMS notification to customer about reschedule
      // The notification should include:
      // - Customer name
      // - New date and time
      // - Barber name
      // - Service name
      console.log('TODO: Send Twilio notification for reschedule', {
        customerId: booking.customer_id,
        customerPhone: booking.customer?.phone || booking.guest_phone,
        newDate: format(newDate, 'MMMM d, yyyy'),
        newTime: newTime,
      });

      loadBookings();
      onBookingUpdate?.();
      setRescheduleTarget(null);
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      alert('Failed to reschedule appointment');
    }
  };

  // Check if a slot falls within the appointment duration range during drag
  const isSlotInDragRange = (slotDateStr: string, slotTime: string): boolean => {
    if (!activeDropTarget || !draggedBooking) return false;
    if (slotDateStr !== activeDropTarget.dateStr) return false;

    const duration = draggedBooking.service?.duration_minutes || 30;
    const [targetHour, targetMin] = activeDropTarget.time.split(':').map(Number);
    const targetMinutes = targetHour * 60 + targetMin;
    const endMinutes = targetMinutes + duration;

    const [slotHour, slotMin] = slotTime.split(':').map(Number);
    const slotMinutes = slotHour * 60 + slotMin;

    return slotMinutes >= targetMinutes && slotMinutes < endMinutes;
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const updateData: Record<string, unknown> = { status: newStatus };

      if (newStatus === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;

      // Award reward points when marking as completed (only for non-guest bookings)
      if (newStatus === 'completed' && selectedBooking) {
        // Skip reward points for guest bookings
        if (selectedBooking.is_guest || !selectedBooking.customer_id) {
          alert('Appointment marked as complete. (Guest booking - no reward points)');
        } else {
          // Fetch the service's reward points directly from the database
          const { data: serviceData, error: serviceError } = await supabase
            .from('services')
            .select('reward_points')
            .eq('id', selectedBooking.service_id)
            .single();

          if (serviceError) {
            console.error('Failed to fetch service:', serviceError);
            alert('Appointment marked as complete, but failed to fetch service for reward points.');
          } else {
            const serviceRewardPoints = serviceData?.reward_points || 0;

            if (serviceRewardPoints > 0) {
              // Fetch the customer's current points fresh from the database
              const { data: customerData, error: fetchError } = await supabase
                .from('customers')
                .select('reward_points')
                .eq('id', selectedBooking.customer_id)
                .single();

              if (fetchError) {
                console.error('Failed to fetch customer points:', fetchError);
                alert('Appointment marked as complete, but failed to fetch customer for reward points.');
              } else {
                const currentPoints = customerData?.reward_points || 0;
                const newPoints = currentPoints + serviceRewardPoints;

                const { data: updateResult, error: pointsError } = await supabase
                  .from('customers')
                  .update({ reward_points: newPoints })
                  .eq('id', selectedBooking.customer_id)
                  .select('reward_points');

                if (pointsError) {
                  console.error('Failed to award points:', pointsError);
                  alert('Appointment marked as complete, but failed to award reward points.');
                } else if (!updateResult || updateResult.length === 0) {
                  console.error('No rows updated - RLS policy may be blocking the update');
                  console.log('Customer ID:', selectedBooking.customer_id);
                  console.log('New points value:', newPoints);
                  alert('Appointment marked as complete, but could not update reward points (permission issue). Check RLS policies.');
                } else {
                  console.log('Points updated successfully:', updateResult);
                  alert(`Appointment completed! ${serviceRewardPoints} reward points awarded to customer. New total: ${updateResult[0].reward_points}`);
                }
              }
            } else {
              alert('Appointment marked as complete. (No reward points for this service)');
            }
          }
        }
      }

      loadBookings();
      setSelectedBooking(null);
      onBookingUpdate?.();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  // Handle canceling a single appointment or all in a recurring series
  const handleCancelAppointment = async (booking: BookingWithDetails, cancelAll: boolean) => {
    try {
      const updateData = {
        status: 'cancelled' as const,
        cancelled_at: new Date().toISOString(),
      };

      if (cancelAll && booking.recurrence_group_id) {
        // Cancel all future appointments in the series (including this one)
        const { error } = await supabase
          .from('bookings')
          .update(updateData)
          .eq('recurrence_group_id', booking.recurrence_group_id)
          .gte('booking_date', booking.booking_date)
          .neq('status', 'completed');

        if (error) throw error;
      } else {
        // Cancel just this appointment
        const { error } = await supabase
          .from('bookings')
          .update(updateData)
          .eq('id', booking.id);

        if (error) throw error;
      }

      loadBookings();
      setSelectedBooking(null);
      setCancelTarget(null);
      onBookingUpdate?.();
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'day') {
      setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(direction === 'prev' ? subDays(currentDate, 7) : addDays(currentDate, 7));
    } else {
      setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const filteredBookings = selectedBarberId === 'all'
    ? bookings
    : bookings.filter(b => b.barber_id === selectedBarberId);

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Generate hourly time slots for display (7 AM to 9 PM)
  const hourlySlots = Array.from({ length: 14 }, (_, i) => {
    const hour = 7 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Generate 15-minute intervals within an hour for drop zones
  const getQuarterSlots = (hourSlot: string) => {
    const hour = parseInt(hourSlot.split(':')[0]);
    return [0, 15, 30, 45].map(minutes =>
      `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    );
  };

  // Get bookings for a specific hour (all bookings starting in that hour)
  const getBookingsForHour = (date: Date, hourSlot: string) => {
    const hour = parseInt(hourSlot.split(':')[0]);
    return filteredBookings.filter(booking => {
      const bookingDate = parseISO(booking.booking_date);
      if (!isSameDay(bookingDate, date)) return false;
      const bookingHour = parseInt(booking.start_time.split(':')[0]);
      return bookingHour === hour;
    });
  };

  // Get the vertical position offset for a booking within its hour (0-75%)
  const getBookingOffset = (startTime: string) => {
    const minutes = parseInt(startTime.split(':')[1]);
    return (minutes / 60) * 100;
  };

  // Get the height of an appointment based on its duration (as percentage of hour)
  const getBookingHeight = (durationMinutes: number) => {
    return (durationMinutes / 60) * 100;
  };

  // Get days for week view
  const getWeekDays = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  // Get all days for month view calendar grid
  const getMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  // Get bookings for a specific day (for month view)
  const getBookingsForDay = (date: Date) => {
    return filteredBookings.filter(booking => {
      // Parse date string as local date to avoid timezone issues
      const bookingDate = parseISO(booking.booking_date);
      return isSameDay(bookingDate, date);
    });
  };

  // Draggable appointment component
  const DraggableAppointment = ({ booking, children }: { booking: BookingWithDetails; children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: booking.id,
    });

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`${styles.draggableAppointment} ${isDragging ? styles.dragging : ''}`}
        style={{ touchAction: 'none' }}
      >
        {children}
      </div>
    );
  };

  // Droppable time slot component
  const DroppableTimeSlot = ({
    id,
    date,
    timeSlot,
    className,
    isInDragRange,
    children
  }: {
    id: string;
    date: Date;
    timeSlot: string;
    className?: string;
    isInDragRange?: boolean;
    children?: React.ReactNode
  }) => {
    const { setNodeRef, isOver, active } = useDroppable({ id });

    // Check if this is a valid drop target (only for the primary hover slot)
    let isValidTarget = false;
    if (active && draggedBooking && isOver) {
      const serviceDuration = draggedBooking.service?.duration_minutes || 30;
      const { canReschedule } = canRescheduleToSlot(
        draggedBooking.id,
        draggedBooking.barber_id || '',
        date,
        timeSlot,
        serviceDuration,
        availability,
        timeOff,
        allBookingsForValidation
      );
      isValidTarget = canReschedule;
    }

    // Determine if this slot should show the range highlight
    const showRangeHighlight = isInDragRange && !isOver;

    const slotClasses = [
      className,
      styles.droppableSlot,
      active ? styles.droppableActive : '',
      isOver && isValidTarget ? styles.droppableOver : '',
      isOver && !isValidTarget ? styles.droppableInvalid : '',
      showRangeHighlight ? styles.droppableInRange : '',
    ].filter(Boolean).join(' ');

    return (
      <div ref={setNodeRef} className={slotClasses}>
        {children}
      </div>
    );
  };

  // Day names for header
  const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNamesFull = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
    <View className={styles.container}>
      {/* Calendar Header */}
      <View className={styles.header}>
        <View className={styles.navigation}>
          <button className={styles.navButton} onClick={() => navigateDate('prev')} aria-label="Previous">
            <ChevronLeft />
          </button>

          <button
            className={styles.todayButton}
            aria-pressed={isSameDay(currentDate, new Date())}
            onClick={goToToday}
          >
            Today
          </button>

          <button className={styles.navButton} onClick={() => navigateDate('next')} aria-label="Next">
            <ChevronRight />
          </button>
        </View>

        <Text className={styles.dateTitle}>
          {viewMode === 'day'
            ? format(currentDate, 'EEE, MMMM d, yyyy')
            : viewMode === 'week'
            ? `${format(
                startOfWeek(currentDate, { weekStartsOn: 0 }),
                'MMM d'
              )} – ${format(
                endOfWeek(currentDate, { weekStartsOn: 0 }),
                'MMM d, yyyy'
              )}`
            : format(currentDate, 'MMMM yyyy')}
        </Text>


        <View className={styles.controls}>
          <div className={styles.selectWrapper}>
            <select
              className={styles.barberFilter}
              value={selectedBarberId}
              onChange={(e) => setSelectedBarberId(e.target.value)}
            >
              <option value="all">All Barbers</option>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </div>

          <View className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'day' ? styles.viewButtonActive : ''}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>

            <button
              className={`${styles.viewButton} ${viewMode === 'week' ? styles.viewButtonActive : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>

            <button
              className={`${styles.viewButton} ${viewMode === 'month' ? styles.viewButtonActive : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
          </View>
            <button
              className={styles.bookAppointmentButton}
              onClick={() =>
                navigate('/book', {
                  state: { adminMode: true },
                })
              }
            >
              <span className={styles.plusIcon}>+</span>
              <span className={styles.mobileOnlyText}>
                Add Appointment
              </span>
            </button>
        </View>
      </View>
        <>
          {/* Day View */}
          {viewMode === 'day' && (
            <View className={styles.dayView}>
              {/* Header with day column */}
              <View
                className={`${styles.dayHeader} ${
                  isSameDay(currentDate, new Date()) ? styles.dayHeaderToday : ''
                }`}
              >
                <View className={styles.dayTimeColumnHeader} />

                <View className={styles.dayColumnHeader}>
                  <Text className={styles.dayColumnDayName}>
                    {format(currentDate, 'EEE')}
                  </Text>
                  <Text className={styles.dayColumnDate}>
                    {format(currentDate, 'd')}
                  </Text>
                </View>
              </View>

              {/* Time grid with hourly rows */}
              <View className={styles.timeGrid}>
                {hourlySlots.map(hourSlot => {
                  const hourBookings = getBookingsForHour(currentDate, hourSlot);
                  const quarterSlots = getQuarterSlots(hourSlot);
                  return (
                    <View key={hourSlot} className={styles.timeRow}>
                      <View className={styles.timeLabel}>
                        <Text>{formatTime(hourSlot)}</Text>
                      </View>
                      <View
                        className={`${styles.hourCell} ${
                          isSameDay(currentDate, new Date()) ? styles.hourCellToday : ''
                        }`}
                      >
                      {/* <View className={styles.hourCell}> */}
                        {/* Quarter-hour drop zones */}
                        <View className={styles.quarterDropZones}>
                          {quarterSlots.map(quarterSlot => {
                            const dateStr = format(currentDate, 'yyyy-MM-dd');
                            const slotId = `slot-${dateStr}-${quarterSlot.replace(':', '-')}`;
                            return (
                              <DroppableTimeSlot
                                key={quarterSlot}
                                id={slotId}
                                date={currentDate}
                                timeSlot={quarterSlot}
                                className={styles.quarterZone}
                                isInDragRange={isSlotInDragRange(dateStr, quarterSlot)}
                              />
                            );
                          })}
                        </View>
                        {/* Appointments */}
                        {hourBookings.map(booking => {
                          const barberColors = getBarberColors(booking);
                          const isDraggable = booking.status !== 'completed' && booking.status !== 'cancelled';
                          const topOffset = getBookingOffset(booking.start_time);
                          const duration = booking.service?.duration_minutes || 30;
                          const heightPercent = getBookingHeight(duration);

                          const appointmentContent = (
                            <View
                              className={styles.appointmentCard}
                              style={{
                                position: 'absolute',
                                top: `${topOffset}%`,
                                height: `${heightPercent}%`,
                                minHeight: 24,
                                left: 4,
                                right: 4,
                                backgroundColor: barberColors.bg,
                                boxShadow: `inset 4px 0 0 ${barberColors.accent}`,
                                zIndex: 10,
                                overflow: 'hidden',
                              }}
                              onClick={() => setSelectedBooking(booking)}
                            >
                              {(() => {
                                const statusIcon = renderStatusIcon(booking.status);
                                return (
                                  <View className={styles.appointmentTimeRow}>
                                    <Text className={styles.appointmentTime}>
                                      {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                                    </Text>
                                    {statusIcon && (
                                      <View className={styles.dayStatusIcon}>
                                        {statusIcon}
                                      </View>
                                    )}
                                  </View>
                                );
                              })()}
                              <Text className={styles.appointmentCustomer}>
                                {booking.customer
                                  ? `${booking.customer.first_name} ${booking.customer.last_name}`
                                  : booking.guest_first_name
                                    ? `${booking.guest_first_name} ${booking.guest_last_name} (Guest)`
                                    : 'Unknown'} 
                                {booking.service?.name && ` - ${booking.service.name}`}
                              </Text>
                            </View>
                          );

                          return isDraggable ? (
                            <DraggableAppointment key={booking.id} booking={booking}>
                              {appointmentContent}
                            </DraggableAppointment>
                          ) : (
                            <div key={booking.id}>{appointmentContent}</div>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Week View */}
          {viewMode === 'week' && (
            <View className={styles.weekView}>
              {/* Header with day names */}
              <View className={styles.weekHeader}>
                <View className={styles.timeColumnHeader}></View>
                {getWeekDays().map((day, index) => (
                  <View
                    key={day.toISOString()}
                    className={`${styles.weekDayHeader} ${isSameDay(day, new Date()) ? styles.todayHeader : ''}`}
                  >
                    <Text className={styles.weekDayNameShort}>{dayNamesShort[index]}</Text>
                    <Text className={styles.weekDayNameFull}>{dayNamesFull[index]}</Text>
                    <Text className={styles.weekDayDate}>{format(day, 'd')}</Text>
                  </View>
                ))}
              </View>

              {/* Time grid with hourly rows */}
              <View className={styles.weekTimeGrid}>
                {hourlySlots.map(hourSlot => {
                  const quarterSlots = getQuarterSlots(hourSlot);
                  return (
                    <View key={hourSlot} className={styles.weekTimeRow}>
                      <View className={styles.weekTimeLabel}>
                        <Text>{formatTime(hourSlot)}</Text>
                      </View>
                      {getWeekDays().map(day => {
                        const hourBookings = getBookingsForHour(day, hourSlot);
                        return (
                          <View
                            key={day.toISOString()}
                            className={`${styles.weekTimeCell} ${isSameDay(day, new Date()) ? styles.todayCell : ''}`}
                          >
                            {/* Quarter-hour drop zones */}
                            <View className={styles.quarterDropZones}>
                              {quarterSlots.map(quarterSlot => {
                                const dateStr = format(day, 'yyyy-MM-dd');
                                const slotId = `slot-${dateStr}-${quarterSlot.replace(':', '-')}`;
                                return (
                                  <DroppableTimeSlot
                                    key={quarterSlot}
                                    id={slotId}
                                    date={day}
                                    timeSlot={quarterSlot}
                                    className={styles.quarterZone}
                                    isInDragRange={isSlotInDragRange(dateStr, quarterSlot)}
                                  />
                                );
                              })}
                            </View>
                            {/* Appointments */}
                            {hourBookings.map(booking => {
                              const barberColors = getBarberColors(booking);
                              const isDraggable = booking.status !== 'completed' && booking.status !== 'cancelled';
                              const topOffset = getBookingOffset(booking.start_time);
                              const duration = booking.service?.duration_minutes || 30;
                              const heightPercent = getBookingHeight(duration);

                              const appointmentContent = (
                                <View
                                  className={styles.weekAppointment}
                                  style={{
                                    position: 'absolute',
                                    top: `${topOffset}%`,
                                    height: `${heightPercent}%`,
                                    minHeight: 16,
                                    left: 2,
                                    right: 2,
                                    backgroundColor: barberColors.bg,
                                    boxShadow: `inset 4px 0 0 ${barberColors.accent}`,
                                    zIndex: 10,
                                    overflow: 'hidden',
                                  }}
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  <Text className={styles.weekAppointmentName}>
                                    {booking.customer?.first_name || booking.guest_first_name || 'Guest'}
                                  </Text>
                                </View>
                              );

                              return isDraggable ? (
                                <DraggableAppointment key={booking.id} booking={booking}>
                                  {appointmentContent}
                                </DraggableAppointment>
                              ) : (
                                <div key={booking.id}>{appointmentContent}</div>
                              );
                            })}
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Month View */}
          {viewMode === 'month' && (
            <View className={styles.monthView}>
              {/* Header with day names */}
              <View className={styles.monthHeader}>
                {dayNamesShort.map((dayName, index) => (
                  <View key={index} className={styles.monthDayHeader}>
                    <Text className={styles.monthDayNameShort}>{dayName}</Text>
                    <Text className={styles.monthDayNameFull}>{dayNamesFull[index]}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar grid */}
              <View className={styles.monthGrid}>
                {getMonthDays().map(day => {
                  const dayBookings = getBookingsForDay(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <View
                      key={day.toISOString()}
                      className={`${styles.monthCell} ${!isCurrentMonth ? styles.monthCellOther : ''} ${isToday ? styles.monthCellToday : ''}`}
                      onClick={() => {
                        setCurrentDate(day);
                        setViewMode('day');
                      }}
                    >
                      <Text className={styles.monthCellDate}>{format(day, 'd')}</Text>
                      {dayBookings.length > 0 && (
                        <View className={styles.monthCellBookings}>
                          {dayBookings.slice(0, 2).map(booking => (
                            <div
                              key={booking.id}
                              className={styles.monthBookingDot}
                              style={{
                                backgroundColor: getBarberColors(booking).bg,
                                boxShadow: `inset 4px 0 0 ${getBarberColors(booking).accent}`,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(booking);
                              }}
                            >
                              <Text className={styles.monthBookingText}>
                                {booking.customer?.first_name || booking.guest_first_name || 'Guest'}
                              </Text>
                            </div>
                          ))}
                          {dayBookings.length > 2 && (
                            <Text className={styles.monthMoreBookings}>
                              +{dayBookings.length - 2} more
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </>
      {/* )} */}

      {/* Appointment Detail Modal */}
      {selectedBooking && (
        <div className={styles.modal} onClick={() => setSelectedBooking(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>Appointment Details</Text>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedBooking(null)}
              >
                &times;
              </button>
            </View>

            <View className={styles.modalBody}>
              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Customer</Text>
                <Text className={styles.detailValue}>
                  {selectedBooking.customer
                    ? `${selectedBooking.customer.first_name} ${selectedBooking.customer.last_name}`
                    : selectedBooking.guest_first_name
                      ? `${selectedBooking.guest_first_name} ${selectedBooking.guest_last_name} (Guest)`
                      : 'Unknown'}
                </Text>
              </View>

              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Phone</Text>
                <Text className={styles.detailValue}>
                  {selectedBooking.customer?.phone || selectedBooking.guest_phone || 'N/A'}
                </Text>
              </View>

              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Email</Text>
                <Text className={styles.detailValue}>
                  {selectedBooking.customer?.email || (selectedBooking.is_guest ? 'Guest - No email' : 'N/A')}
                </Text>
              </View>

              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Service</Text>
                <Text className={styles.detailValue}>
                  {selectedBooking.service?.name}
                </Text>
              </View>

              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Barber</Text>
                <Text className={styles.detailValue}>
                  {selectedBooking.barber?.name}
                </Text>
              </View>

              <View className={styles.detailRow}>
                <View className={styles.detailLabelStack}>
                  <Text className={styles.detailLabel}>Date</Text>
                  <Text className={styles.detailLabel}>Time</Text>
                </View>

                <View className={styles.detailDateTime}>
                  <Text className={styles.detailDate}>
                    {format(new Date(selectedBooking.booking_date), 'MMMM d, yyyy')}
                  </Text>

                  <Text className={styles.detailTime}>
                    {formatTime(selectedBooking.start_time)} – {formatTime(selectedBooking.end_time)}
                  </Text>
                </View>
              </View>

              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Price</Text>
                <Text className={styles.detailValue}>
                  ${selectedBooking.total_price.toFixed(2)}
                </Text>
              </View>

              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Status</Text>
                <Text className={styles.statusBadge}>
                  {selectedBooking.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            <View className={styles.modalActions}>
              {/* <Text className={styles.actionsLabel}>Update Status:</Text> */}
              <View className={styles.actionButtons}>
                {selectedBooking.status !== 'confirmed' && (
                  <button
                    className={styles.actionConfirm}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                  >
                    Confirm
                  </button>
                )}
                {selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled' && (
                  <button
                    className={styles.actionComplete}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                  >
                    Complete
                  </button>
                )}
                {selectedBooking.status !== 'no_show' && selectedBooking.status !== 'cancelled' && (
                  <button
                    className={styles.actionNoShow}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'no_show')}
                  >
                    No Show
                  </button>
                )}
                {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                  <button
                    className={styles.actionCancel}
                    onClick={() => {
                      if (selectedBooking.recurrence_group_id) {
                        // Show confirmation modal for recurring appointments
                        setCancelTarget(selectedBooking);
                      } else {
                        // Directly cancel non-recurring appointments
                        handleStatusUpdate(selectedBooking.id, 'cancelled');
                      }
                    }}
                  >
                    Delete
                  </button>
                )}
              </View>
            </View>
          </div>
        </div>
      )}

      {/* Admin Booking Modal */}
      {/* <AdminBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={() => {
          loadBookings();
          onBookingUpdate?.();
        }}
        barbers={barbers}
        services={services}
        pricing={pricing}
        availability={availability}
        timeOff={timeOff}
      /> */}

      {/* Drag Overlay - shows appointment while dragging */}
      <DragOverlay>
        {draggedBooking ? (
          <View
            className={styles.dragOverlay}
            style={{
              backgroundColor: getBarberColors(draggedBooking).bg,
              boxShadow: `inset 4px 0 0 ${getBarberColors(draggedBooking).accent}`,
              padding: 8,
              paddingLeft: 12,
            }}
          >
            <Text className={styles.appointmentCustomer}>
              {draggedBooking.customer
                ? `${draggedBooking.customer.first_name} ${draggedBooking.customer.last_name}`
                : draggedBooking.guest_first_name
                  ? `${draggedBooking.guest_first_name} ${draggedBooking.guest_last_name}`
                  : 'Unknown'}
            </Text>
            <Text className={styles.appointmentMeta}>
              {draggedBooking.service?.name}
            </Text>
          </View>
        ) : null}
      </DragOverlay>

      {/* Reschedule Confirmation Modal */}
      {rescheduleTarget && (
        <div className={styles.rescheduleModal} onClick={() => setRescheduleTarget(null)}>
          <div className={styles.rescheduleModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.rescheduleModalHeader}>
              <h3 className={styles.rescheduleModalTitle}>Reschedule Appointment</h3>
            </div>

            <div className={styles.rescheduleModalBody}>
              <div className={styles.rescheduleInfo}>
                <div className={styles.rescheduleLabel}>Customer</div>
                <div className={styles.rescheduleValue}>
                  {rescheduleTarget.booking.customer
                    ? `${rescheduleTarget.booking.customer.first_name} ${rescheduleTarget.booking.customer.last_name}`
                    : rescheduleTarget.booking.guest_first_name
                      ? `${rescheduleTarget.booking.guest_first_name} ${rescheduleTarget.booking.guest_last_name} (Guest)`
                      : 'Unknown'}
                </div>
              </div>

              <div className={styles.rescheduleInfo}>
                <div className={styles.rescheduleLabel}>Service</div>
                <div className={styles.rescheduleValue}>
                  {rescheduleTarget.booking.service?.name}
                </div>
              </div>

              <div className={styles.rescheduleTimeChange}>
                <div className={styles.rescheduleTimeBlock}>
                  <div className={styles.rescheduleTimeLabel}>From</div>
                  <div className={styles.rescheduleTimeValue}>
                    {format(parseISO(rescheduleTarget.booking.booking_date), 'MMM d')}
                  </div>
                  <div className={styles.rescheduleTimeValue}>
                    {formatTime(rescheduleTarget.booking.start_time)}
                  </div>
                </div>

                <div className={styles.rescheduleArrow}>→</div>

                <div className={styles.rescheduleTimeBlock}>
                  <div className={styles.rescheduleTimeLabel}>To</div>
                  <div className={styles.rescheduleTimeValue}>
                    {format(rescheduleTarget.newDate, 'MMM d')}
                  </div>
                  <div className={styles.rescheduleTimeValue}>
                    {formatTime(rescheduleTarget.newTime)}
                  </div>
                </div>
              </div>

              <div className={styles.rescheduleNotice}>
                Customer will be notified via SMS once Twilio is configured.
              </div>
            </div>

            <div className={styles.rescheduleModalActions}>
              <button
                className={styles.rescheduleCancel}
                onClick={() => setRescheduleTarget(null)}
              >
                Cancel
              </button>
              <button
                className={styles.rescheduleConfirm}
                onClick={handleReschedule}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal for Recurring Appointments */}
      {cancelTarget && (
        <div className={styles.rescheduleModal} onClick={() => setCancelTarget(null)}>
          <div className={styles.rescheduleModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.rescheduleModalHeader}>
              <h3 className={styles.rescheduleModalTitle}>Cancel Recurring Appointment</h3>
            </div>

            <div className={styles.rescheduleModalBody}>
              <div className={styles.rescheduleInfo}>
                <div className={styles.rescheduleLabel}>Customer</div>
                <div className={styles.rescheduleValue}>
                  {cancelTarget.customer
                    ? `${cancelTarget.customer.first_name} ${cancelTarget.customer.last_name}`
                    : cancelTarget.guest_first_name
                      ? `${cancelTarget.guest_first_name} ${cancelTarget.guest_last_name} (Guest)`
                      : 'Unknown'}
                </div>
              </div>

              <div className={styles.rescheduleInfo}>
                <div className={styles.rescheduleLabel}>Service</div>
                <div className={styles.rescheduleValue}>{cancelTarget.service?.name}</div>
              </div>

              <div className={styles.rescheduleInfo}>
                <div className={styles.rescheduleLabel}>Appointment</div>
                <div className={styles.rescheduleValue}>
                  {format(parseISO(cancelTarget.booking_date), 'EEE, MMM d, yyyy')} at {formatTime(cancelTarget.start_time)}
                </div>
              </div>

              <div className={styles.cancelMessage}>
                This appointment is part of a recurring series. What would you like to do?
              </div>
            </div>

            <div className={styles.cancelModalActions}>
              <button
                className={styles.cancelSingleButton}
                onClick={() => handleCancelAppointment(cancelTarget, false)}
              >
                Cancel This Appointment Only
              </button>
              <button
                className={styles.cancelAllButton}
                onClick={() => handleCancelAppointment(cancelTarget, true)}
              >
                Cancel All Future Appointments
              </button>
              <button
                className={styles.rescheduleCancel}
                onClick={() => setCancelTarget(null)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </View>
    </DndContext>
  );
}
