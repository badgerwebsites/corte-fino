// components/AdminCalendar.tsx
import { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, addMonths, subMonths, parseISO } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Barber, BookingWithDetails } from '../types/database.types';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/adminCalendar.css';

interface AdminCalendarProps {
  barbers: Barber[];
  onBookingUpdate?: () => void;
}

type ViewMode = 'day' | 'week' | 'month';
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export function AdminCalendar({ barbers, onBookingUpdate }: AdminCalendarProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [previousView, setPreviousView] = useState<'week' | 'month' | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBarberId, setSelectedBarberId] = useState<string>('all');
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);

  useEffect(() => {
    loadBookings();
  }, [currentDate, viewMode]);

  // Subscribe to real-time changes on bookings table
  useEffect(() => {
    const channel = supabase
      .channel('admin-calendar-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        () => {
          // Reload bookings when any change occurs
          loadBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentDate, viewMode]);

  const loadBookings = async () => {
    setLoading(true);
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
        // Month view - get all days visible in the calendar grid
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
        .order('start_time', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
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

      // Award reward points when marking as completed
      if (newStatus === 'completed' && selectedBooking) {
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

      loadBookings();
      setSelectedBooking(null);
      onBookingUpdate?.();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
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

  const getStatusColor = (status: BookingStatus): string => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'confirmed': return styles.statusConfirmed;
      case 'completed': return styles.statusCompleted;
      case 'cancelled': return styles.statusCancelled;
      case 'no_show': return styles.statusNoShow;
      default: return '';
    }
  };

  // Generate time slots for the day view (7 AM to 9 PM)
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = 7 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Get bookings for a specific time slot
  const getBookingsForTimeSlot = (date: Date, timeSlot: string) => {
    return filteredBookings.filter(booking => {
      // Parse date string as local date to avoid timezone issues
      const bookingDate = parseISO(booking.booking_date);
      if (!isSameDay(bookingDate, date)) return false;

      const bookingHour = parseInt(booking.start_time.split(':')[0]);
      const slotHour = parseInt(timeSlot.split(':')[0]);
      return bookingHour === slotHour;
    });
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

  // Day names for header
  const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNamesFull = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className={styles.container}>
      {/* Calendar Header */}
      <View className={styles.header}>
        <View className={styles.navigation}>
          {viewMode === 'day' && previousView && (
            <button
              className={styles.backButton}
              onClick={() => {
                setViewMode(previousView);
                setPreviousView(null);
              }}
            >
              &larr; Back
            </button>
          )}
          <button className={styles.navButton} onClick={() => navigateDate('prev')}>
            &larr;
          </button>
          <button className={styles.todayButton} onClick={goToToday}>
            Today
          </button>
          <button className={styles.navButton} onClick={() => navigateDate('next')}>
            &rarr;
          </button>
        </View>

        <Text className={styles.dateTitle}>
          {viewMode === 'day'
            ? format(currentDate, 'EEEE, MMMM d, yyyy')
            : viewMode === 'week'
            ? `${format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'MMM d')} - ${format(endOfWeek(currentDate, { weekStartsOn: 0 }), 'MMM d, yyyy')}`
            : format(currentDate, 'MMMM yyyy')}
        </Text>

        <View className={styles.controls}>
          <select
            className={styles.barberFilter}
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
          >
            <option value="all">All Barbers</option>
            {barbers.map(barber => (
              <option key={barber.id} value={barber.id}>{barber.name}</option>
            ))}
          </select>

          <View className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'day' ? styles.viewButtonActive : ''}`}
              onClick={() => { setPreviousView(null); setViewMode('day'); }}
            >
              Day
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'week' ? styles.viewButtonActive : ''}`}
              onClick={() => { setPreviousView(null); setViewMode('week'); }}
            >
              Week
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'month' ? styles.viewButtonActive : ''}`}
              onClick={() => { setPreviousView(null); setViewMode('month'); }}
            >
              Month
            </button>
          </View>
        </View>
      </View>

      {loading ? (
        <View className={styles.loadingContainer}>
          <Text>Loading appointments...</Text>
        </View>
      ) : (
        <>
          {/* Day View */}
          {viewMode === 'day' && (
            <View className={styles.dayView}>
              {filteredBookings.length === 0 ? (
                <View className={styles.emptyState}>
                  <Text className={styles.emptyStateText}>No appointments scheduled for this day</Text>
                </View>
              ) : (
                <View className={styles.timeGrid}>
                  {timeSlots.map(timeSlot => {
                    const slotBookings = getBookingsForTimeSlot(currentDate, timeSlot);
                    return (
                      <View key={timeSlot} className={styles.timeRow}>
                        <View className={styles.timeLabel}>
                          <Text>{formatTime(timeSlot)}</Text>
                        </View>
                        <View className={styles.appointmentsColumn}>
                          {slotBookings.map(booking => (
                            <View
                              key={booking.id}
                              className={`${styles.appointmentCard} ${getStatusColor(booking.status)}`}
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Text className={styles.appointmentTime}>
                                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                              </Text>
                              <Text className={styles.appointmentCustomer}>
                                {booking.customer?.first_name} {booking.customer?.last_name}
                              </Text>
                              <Text className={styles.appointmentService}>
                                {booking.service?.name}
                              </Text>
                              <Text className={styles.appointmentBarber}>
                                with {booking.barber?.name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
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

              {/* Time grid with rows for each hour */}
              <View className={styles.weekTimeGrid}>
                {timeSlots.map(timeSlot => (
                  <View key={timeSlot} className={styles.weekTimeRow}>
                    <View className={styles.weekTimeLabel}>
                      <Text>{formatTime(timeSlot)}</Text>
                    </View>
                    {getWeekDays().map(day => {
                      const slotBookings = getBookingsForTimeSlot(day, timeSlot);
                      return (
                        <View
                          key={day.toISOString()}
                          className={`${styles.weekTimeCell} ${isSameDay(day, new Date()) ? styles.todayCell : ''}`}
                        >
                          {slotBookings.map(booking => (
                            <View
                              key={booking.id}
                              className={`${styles.weekAppointment} ${getStatusColor(booking.status)}`}
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Text className={styles.weekAppointmentName}>
                                {booking.customer?.first_name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      );
                    })}
                  </View>
                ))}
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
                        setPreviousView('month');
                        setCurrentDate(day);
                        setViewMode('day');
                      }}
                    >
                      <Text className={styles.monthCellDate}>{format(day, 'd')}</Text>
                      {dayBookings.length > 0 && (
                        <View className={styles.monthCellBookings}>
                          {dayBookings.slice(0, 3).map(booking => (
                            <div
                              key={booking.id}
                              className={`${styles.monthBookingDot} ${getStatusColor(booking.status)}`}
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                setSelectedBooking(booking);
                              }}
                            >
                              <Text className={styles.monthBookingText}>
                                {booking.customer?.first_name}
                              </Text>
                            </div>
                          ))}
                          {dayBookings.length > 3 && (
                            <Text className={styles.monthMoreBookings}>
                              +{dayBookings.length - 3} more
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
      )}

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
                  {selectedBooking.customer?.first_name} {selectedBooking.customer?.last_name}
                </Text>
              </View>

              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Phone</Text>
                <Text className={styles.detailValue}>
                  {selectedBooking.customer?.phone || 'N/A'}
                </Text>
              </View>

              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Email</Text>
                <Text className={styles.detailValue}>
                  {selectedBooking.customer?.email || 'N/A'}
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
                <Text className={styles.detailLabel}>Date & Time</Text>
                <Text className={styles.detailValue}>
                  {format(new Date(selectedBooking.booking_date), 'MMMM d, yyyy')}
                  {' at '}
                  {formatTime(selectedBooking.start_time)} - {formatTime(selectedBooking.end_time)}
                </Text>
              </View>

              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Price</Text>
                <Text className={styles.detailValue}>
                  ${selectedBooking.total_price.toFixed(2)}
                </Text>
              </View>

              <View className={styles.detailRow}>
                <Text className={styles.detailLabel}>Status</Text>
                <Text className={`${styles.statusBadge} ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </Text>
              </View>
            </View>

            <View className={styles.modalActions}>
              <Text className={styles.actionsLabel}>Update Status:</Text>
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
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                  >
                    Cancel
                  </button>
                )}
              </View>
            </View>
          </div>
        </div>
      )}
    </View>
  );
}
