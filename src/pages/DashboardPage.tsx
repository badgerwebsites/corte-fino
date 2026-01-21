import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { BookingWithDetails } from '../types/database.types';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/dashboard.css';

export default function DashboardPage() {
  const { user, customer, signOut } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadBookings();
  }, [user, navigate]);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          barber:barbers(*),
          service:services(*)
        `)
        .eq('customer_id', user?.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <Text className={styles.statValue}>{bookings.length}</Text>
          <Text className={styles.statLabel}>Total Bookings</Text>
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
            <Text>No bookings yet</Text>
            <Link to="/book" className={styles.bookButton}>
              Book Your First Appointment
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
        <Link to="/rewards" className={styles.rewardsLink}>
          View Available Rewards →
        </Link>
      </View>
    </View>
  );
}
