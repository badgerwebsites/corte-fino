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

export default function CustomerDashboardPage() {
  const { user, customer, signOut } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // const { customer, loading } = useAuth();

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
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            barber:barbers(*),
            service:services(*)
          `)
          .eq('customer_id', user.id)
          .order('booking_date', { ascending: false });
  
        if (error) throw error;
        setBookings(data || []);
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

  if (loading) {
    return (
      <View className={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Navigation />
      <View className={styles.container}>
        <View className={styles.header}>
        <View>
          <Text className={styles.title}>My Dashboard</Text>
          <Text className={styles.subtitle}>
            Welcome back, {customer?.first_name}!
          </Text>
        </View>
        <button onClick={handleSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </View>

      <View className={styles.statsGrid}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{customer?.reward_points || 0}</Text>
          <Text className={styles.statLabel}>Reward Points</Text>
        </View>
        <View className={styles.statCard}>
          {(() => {
            const today = new Date(new Date().toDateString());
            const upcoming = bookings
              .filter(b =>
                new Date(b.booking_date) >= today &&
                (b.status === 'pending' || b.status === 'confirmed')
              )
              .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime());

            if (upcoming.length === 0) {
              return (
                <>
                  <Text className={styles.statValueSmall}>None scheduled</Text>
                  <Text className={styles.statLabel}>Next Appointment</Text>
                </>
              );
            }

            const nextDate = new Date(upcoming[0].booking_date);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            let dateText = nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (nextDate.getTime() === today.getTime()) dateText = 'Today';
            else if (nextDate.getTime() === tomorrow.getTime()) dateText = 'Tomorrow';

            return (
              <>
                <Text className={styles.statValue}>{dateText}</Text>
                <Text className={styles.statLabel}>Next Appointment</Text>
              </>
            );
          })()}
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>My Bookings</Text>
          <Link to="/book" className={styles.bookButton}>
            Book New Appointment
          </Link>
        </View>

        {bookings.length === 0 ? (
          <View className={styles.emptyState}>
            <img src={calendarCheckIcon} alt="" className={styles.emptyStateIcon} />
            <Text className={styles.emptyStateTitle}>No appointments yet</Text>
            <Text className={styles.emptyStateText}>
              Book your first appointment and start earning reward points with every visit.
            </Text>
            <Link to="/book" className={styles.bookButton}>
              Book Appointment
            </Link>
          </View>
        ) : (
          <View className={styles.bookingsList}>
            {bookings.map((booking) => (
              <View key={booking.id} className={styles.bookingCard}>
                <View className={styles.bookingHeader}>
                  <Text className={styles.bookingDate}>
                    {new Date(booking.booking_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <View className={`${styles.statusBadge} ${styles[booking.status]}`}>
                    <Text>{booking.status}</Text>
                  </View>
                </View>
                <View className={styles.bookingDetails}>
                  <Text className={styles.bookingTime}>{booking.start_time}</Text>
                  <Text className={styles.bookingService}>
                    {booking.service?.name}
                  </Text>
                  {booking.barber && (
                    <Text className={styles.bookingBarber}>
                      with {booking.barber.name}
                    </Text>
                  )}
                  <Text className={styles.bookingPrice}>
                    ${booking.total_price.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className={styles.section}>
        <View className={styles.rewardsCard}>
          <View className={styles.rewardsInfo}>
            <Text className={styles.rewardsIcon}>&#127873;</Text>
            <View className={styles.rewardsText}>
              <Text className={styles.rewardsTitle}>Rewards Program</Text>
              <Text className={styles.rewardsSubtitle}>Redeem your points for free services</Text>
            </View>
          </View>
          <Link to="/rewards" className={styles.rewardsLink}>
            View Rewards
          </Link>
        </View>
      </View>

      {customer?.is_admin && (
        <View className={styles.section}>
          <Link to="/admin" className={styles.adminLink}>
            Admin Dashboard
          </Link>
        </View>
      )}
    </View>
    </>
  );
}
