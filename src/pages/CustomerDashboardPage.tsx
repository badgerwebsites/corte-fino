// pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { supabase } from '../lib/supabase.ts';
import type { BookingWithDetails } from '../types/database.types.ts';
import { Navigation } from '../components/Navigation.tsx';
import { View } from '../ui/View.tsx';
import { Text } from '../ui/Text.tsx';
import * as styles from '../styles/dashboard.css.ts';

export default function CustomerDashboardPage() {
  const { user, customer, refreshCustomer } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<BookingWithDetails | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();

  // Refresh customer data (including reward points) when dashboard loads
  useEffect(() => {
    refreshCustomer();
  }, [refreshCustomer]);

  useEffect(() => {
    if (loading) return;

    if (customer?.is_admin) {
      navigate('/admin', { replace: true });
    }
  }, [customer, loading, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadBookings = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            barber:barbers(*),
            service:services(*)
          `)
          .eq('customer_id', user.id)
          .in('status', ['pending', 'confirmed'])
          .gte('booking_date', today)
          .order('booking_date', { ascending: true });

        if (error) throw error;

        // Filter out appointments that ended more than 1 hour ago
        const now = new Date();
        const filtered = (data || []).filter(booking => {
          const endDateTime = new Date(`${booking.booking_date}T${booking.end_time}`);
          const oneHourAfterEnd = new Date(endDateTime.getTime() + 60 * 60 * 1000);
          return now < oneHourAfterEnd;
        });

        setBookings(filtered);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    if (!user) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          barber:barbers(*),
          service:services(*)
        `)
        .eq('customer_id', user.id)
        .in('status', ['pending', 'confirmed'])
        .gte('booking_date', today)
        .order('booking_date', { ascending: true });

      if (error) throw error;

      // Filter out appointments that ended more than 1 hour ago
      const now = new Date();
      const filtered = (data || []).filter(booking => {
        const endDateTime = new Date(`${booking.booking_date}T${booking.end_time}`);
        const oneHourAfterEnd = new Date(endDateTime.getTime() + 60 * 60 * 1000);
        return now < oneHourAfterEnd;
      });

      setBookings(filtered);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  // Check if booking is upcoming and can be modified
  const isUpcoming = (booking: BookingWithDetails): boolean => {
    const now = new Date();
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    return bookingDateTime > now && (booking.status === 'pending' || booking.status === 'confirmed');
  };

  // Check if cancellation is within 12 hours (fee applies)
  const isWithin12Hours = (booking: BookingWithDetails): boolean => {
    const now = new Date();
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    const hoursUntil = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil < 12;
  };

  const handleCancelBooking = async () => {
    if (!cancellingBooking) return;

    setCancelling(true);
    try {
      // Delete the booking instead of just updating status
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', cancellingBooking.id);

      if (error) throw error;

      setCancellingBooking(null);
      loadBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReschedule = (booking: BookingWithDetails) => {
    navigate('/book', {
      state: {
        rescheduleFrom: booking.id,
        serviceId: booking.service_id,
        barberId: booking.barber_id,
      }
    });
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const formatDateShort = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date(new Date().toDateString());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Navigation />
      <View className={styles.container}>
        <View className={styles.content}>
            <View className={styles.header}>
              <Text className={styles.greeting}>Welcome back, {customer?.first_name}</Text>
              {bookings.length > 0 && (
                <View className={styles.section}>
                  <Link to="/book" className={styles.primaryCta}>
                    Book Appointment
                  </Link>
                </View>
              )}
            </View>

          {/* Upcoming Appointments */}
          <View className={styles.section}>

            {bookings.length === 0 ? (
              <View className={styles.emptyState}>
                <svg
                  className={styles.emptyStateIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <polyline points="9 16 11 18 15 14" />
                </svg>
                <Text className={styles.emptyStateTitle}>No upcoming appointments</Text>
                <Text className={styles.emptyStateText}>
                  Book your first appointment and start earning reward points.
                </Text>
                <Link to="/book" className={styles.emptyStateButton}>
                  Book Appointment
                </Link>
              </View>
            ) : (
              <View className={styles.bookingsList}>
                {bookings.map((booking) => (
                  <View key={booking.id} className={styles.bookingCard}>
                    <View className={styles.bookingMain}>
                      <View className={styles.bookingInfo}>
                        <Text className={styles.bookingDate}>
                          {formatDateShort(booking.booking_date)}
                        </Text>
                        <View className={styles.bookingMeta}>
                          <Text>
                            <span className={styles.bookingTime}>{formatTime(booking.start_time)}</span>
                          </Text>
                          <Text>{booking.service?.name}</Text>
                          {booking.barber && <Text>with {booking.barber.name}</Text>}
                        </View>
                      </View>
                      <View className={styles.bookingRight}>
                        <Text className={styles.bookingPrice}>
                          ${booking.total_price.toFixed(2)}
                        </Text>
                        <View className={`${styles.statusBadge} ${styles[booking.status]}`}>
                          <Text>{booking.status}</Text>
                        </View>
                      </View>
                    </View>
                    {isUpcoming(booking) && (
                      <View className={styles.bookingActions}>
                        <button
                          className={styles.actionLink}
                          onClick={() => handleReschedule(booking)}
                        >
                          Reschedule
                        </button>
                        <button
                          className={styles.actionLinkDanger}
                          onClick={() => setCancellingBooking(booking)}
                        >
                          Cancel
                        </button>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Rewards Card */}
          <View className={styles.section}>
            <View className={styles.rewardsCard}>
              <View className={styles.rewardsInfo}>
                <svg
                  className={styles.rewardsIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="8" width="18" height="13" rx="2" />
                  <line x1="12" y1="8" x2="12" y2="21" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <path d="M12 8c0-2-1.5-4-3-4-1.5 0-2.5 1-2.5 2.5C6.5 8 9 8 12 8z" />
                  <path d="M12 8c0-2 1.5-4 3-4 1.5 0 2.5 1 2.5 2.5C17.5 8 15 8 12 8z" />
                </svg>
                {/* <img src={giftIcon} alt="" className={styles.rewardsIcon} /> */}
                <Text className={styles.rewardsText}>
                  <span className={styles.rewardsPoints}>{customer?.reward_points || 0}</span> points
                </Text>
              </View>
              <Link to="/rewards" className={styles.rewardsLink}>
                Rewards
              </Link>
            </View>
          </View>
        </View>
      </View>

      {/* Cancel Confirmation Modal */}
      {cancellingBooking && (
        <div className={styles.modalOverlay} onClick={() => setCancellingBooking(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalTitleRow}>
              <Text className={styles.modalTitle}>Cancel appointment?</Text>
            </div>
            <View className={styles.modalBookingInfo}>
              <Text className={styles.modalBookingDate}>
                {new Date(cancellingBooking.booking_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Text className={styles.modalBookingTime}>
                {formatTime(cancellingBooking.start_time)} · {cancellingBooking.service?.name}
              </Text>
            </View>

            {isWithin12Hours(cancellingBooking) ? (
              <View className={styles.feeWarning}>
                <Text className={styles.feeWarningTitle}>Cancellation fee applies</Text>
                <Text className={styles.feeWarningText}>
                  A 50% fee (${(cancellingBooking.total_price * 0.5).toFixed(2)}) applies for cancellations within 12 hours.
                </Text>
              </View>
            ) : (
              <View className={styles.nofeeWarning}>
                <Text className={styles.nofeeText}>
                  No fee if canceled at least 12 hours in advance.
                </Text>
              </View>
            )}

            <View className={styles.modalActions}>
              <button
                className={styles.modalKeepButton}
                onClick={() => setCancellingBooking(null)}
                disabled={cancelling}
              >
                Keep
              </button>
              <button
                className={styles.modalCancelButton}
                onClick={handleCancelBooking}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Cancel'}
              </button>
            </View>
          </div>
        </div>
      )}
    </>
  );
}
