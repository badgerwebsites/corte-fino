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
import calendarCheckIcon from '../assets/calendar-check.svg';
import giftIcon from '../assets/gift.svg';

export default function CustomerDashboardPage() {
  const { user, customer, signOut } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<BookingWithDetails | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();

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


  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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

  // Get next appointment info
  const getNextAppointment = () => {
    const today = new Date(new Date().toDateString());
    const upcoming = bookings
      .filter(b =>
        new Date(b.booking_date) >= today &&
        (b.status === 'pending' || b.status === 'confirmed')
      )
      .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime());

    if (upcoming.length === 0) return null;

    const next = upcoming[0];
    const nextDate = new Date(next.booking_date);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateText = nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (nextDate.getTime() === today.getTime()) dateText = 'Today';
    else if (nextDate.getTime() === tomorrow.getTime()) dateText = 'Tomorrow';

    return dateText;
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <View className={styles.container}>
          <View className={styles.content}>
            <Text className={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </>
    );
  }

  const nextAppointment = getNextAppointment();

  return (
    <>
      <Navigation />
      <View className={styles.container}>
        <View className={styles.content}>
          {/* Header */}
          <View className={styles.header}>
            <View className={styles.headerTop}>
              <View>
                <Text className={styles.greeting}>Welcome back, {customer?.first_name}</Text>
                <Text className={styles.title}>Dashboard</Text>
              </View>
              <button onClick={handleSignOut} className={styles.signOutButton}>
                Sign out
              </button>
            </View>

            {/* Primary CTA */}
            <Link to="/book" className={styles.primaryCta}>
              Book Appointment
            </Link>
          </View>

          {/* Stats */}
          <View className={styles.statsRow}>
            <View className={styles.stat}>
              <Text className={styles.statValue}>{customer?.reward_points || 0}</Text>
              <Text className={styles.statLabel}>Points</Text>
            </View>
            <View className={styles.stat}>
              {nextAppointment ? (
                <Text className={styles.statValue}>{nextAppointment}</Text>
              ) : (
                <Text className={styles.statValueMuted}>None</Text>
              )}
              <Text className={styles.statLabel}>Next appointment</Text>
            </View>
          </View>

          {/* Upcoming Appointments */}
          <View className={styles.section}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>Upcoming</Text>
            </View>

            {bookings.length === 0 ? (
              <View className={styles.emptyState}>
                <img src={calendarCheckIcon} alt="" className={styles.emptyStateIcon} />
                <Text className={styles.emptyStateTitle}>No appointments</Text>
                <Text className={styles.emptyStateText}>
                  Book your first appointment and start earning rewards.
                </Text>
                <Link to="/book" className={styles.emptyStateButton}>
                  Book now
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
                        <Text className={styles.bookingMeta}>
                          <span className={styles.bookingTime}>{formatTime(booking.start_time)}</span>
                          {' · '}
                          {booking.service?.name}
                          {booking.barber && ` with ${booking.barber.name}`}
                        </Text>
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

          {/* Rewards - subtle secondary section */}
          <View className={styles.section}>
            <View className={styles.rewardsCard}>
              <View className={styles.rewardsInfo}>
                <img src={giftIcon} alt="" className={styles.rewardsIcon} />
                <Text className={styles.rewardsText}>
                  <span className={styles.rewardsPoints}>{customer?.reward_points || 0}</span> points available
                </Text>
              </View>
              <Link to="/rewards" className={styles.rewardsLink}>
                View rewards
              </Link>
            </View>
          </View>

          {customer?.is_admin && (
            <View className={styles.section}>
              <Link to="/admin" className={styles.adminLink}>
                Admin Dashboard →
              </Link>
            </View>
          )}
        </View>
      </View>

      {/* Cancel Confirmation Modal */}
      {cancellingBooking && (
        <div className={styles.modalOverlay} onClick={() => setCancellingBooking(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>Cancel appointment?</Text>

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
                  A 50% fee (${(cancellingBooking.total_price * 0.5).toFixed(2)}) applies for appointments within 12 hours.
                </Text>
              </View>
            ) : (
              <Text className={styles.nofeeText}>
                No cancellation fee for appointments more than 12 hours away.
              </Text>
            )}

            <View className={styles.modalActions}>
              <button
                className={styles.modalCancelButton}
                onClick={() => setCancellingBooking(null)}
                disabled={cancelling}
              >
                Keep
              </button>
              <button
                className={styles.modalConfirmButton}
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
