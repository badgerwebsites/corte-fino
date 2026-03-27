// pages/CustomerDashboardPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { supabase } from '../lib/supabase.ts';
import type { BookingWithDetails, SiteSettings } from '../types/database.types.ts';
import { Navigation } from '../components/Navigation.tsx';
import { View } from '../ui/View.tsx';
import * as styles from '../styles/dashboard.css.ts';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { EmptyBookingsState } from '../components/dashboard/EmptyBookingsState';
import { StandaloneBookingCard } from '../components/dashboard/StandaloneBookingCard';
import { RecurringBookingCard } from '../components/dashboard/RecurringBookingCard';
import { CancelBookingModal } from '../components/dashboard/CancelBookingModal';
import { EditProfileModal } from '../components/dashboard/EditProfileModal';

interface RecurringBookingGroup {
  groupId: string;
  pattern: string;
  nextBooking: BookingWithDetails;
  allBookings: BookingWithDetails[];
  remainingCount: number;
}

export default function CustomerDashboardPage() {
  const { user, customer, refreshCustomer, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<BookingWithDetails | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [expandedRecurring, setExpandedRecurring] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate();

  // ─── Derived data ──────────────────────────────────────────────────────────

  const { recurringGroups, standaloneBookings } = useMemo(() => {
    const groups: Record<string, BookingWithDetails[]> = {};
    const standalone: BookingWithDetails[] = [];

    bookings.forEach(booking => {
      if (booking.recurrence_group_id) {
        if (!groups[booking.recurrence_group_id]) groups[booking.recurrence_group_id] = [];
        groups[booking.recurrence_group_id].push(booking);
      } else {
        standalone.push(booking);
      }
    });

    const recurringGroups: RecurringBookingGroup[] = Object.entries(groups).map(([groupId, bookings]) => {
      const sorted = [...bookings].sort((a, b) =>
        a.booking_date.localeCompare(b.booking_date) || a.start_time.localeCompare(b.start_time)
      );
      return {
        groupId,
        pattern: sorted[0].recurrence_pattern || 'recurring',
        nextBooking: sorted[0],
        allBookings: sorted,
        remainingCount: sorted.length,
      };
    });

    recurringGroups.sort((a, b) =>
      a.nextBooking.booking_date.localeCompare(b.nextBooking.booking_date)
    );

    return { recurringGroups, standaloneBookings: standalone };
  }, [bookings]);

  // ─── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => { refreshCustomer(); }, [refreshCustomer]);

  useEffect(() => {
    if (loading) return;
    if (customer?.is_admin) navigate('/admin', { replace: true });
  }, [customer, loading, navigate]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login', { replace: true }); return; }

    const loadData = async () => {
      try {
        const currentDate = new Date();
        const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        const [bookingsRes, settingsRes] = await Promise.all([
          supabase
            .from('bookings')
            .select(`*, barber:barbers(*), service:services(*)`)
            .eq('customer_id', user.id)
            .in('status', ['pending', 'confirmed'])
            .gte('booking_date', today)
            .order('booking_date', { ascending: true }),
          supabase.from('site_settings').select('*').single(),
        ]);

        if (bookingsRes.error) throw bookingsRes.error;

        const now = new Date();
        const filtered = (bookingsRes.data || []).filter(booking => {
          const endDateTime = new Date(`${booking.booking_date}T${booking.end_time}`);
          return now < new Date(endDateTime.getTime() + 60 * 60 * 1000);
        });

        setBookings(filtered);
        setSiteSettings(settingsRes.data || null);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, authLoading, navigate]);

  // ─── Data refresh ──────────────────────────────────────────────────────────

  const loadBookings = async () => {
    if (!user) return;
    try {
      const currentDate = new Date();
      const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const { data, error } = await supabase
        .from('bookings')
        .select(`*, barber:barbers(*), service:services(*)`)
        .eq('customer_id', user.id)
        .in('status', ['pending', 'confirmed'])
        .gte('booking_date', today)
        .order('booking_date', { ascending: true });

      if (error) throw error;

      const now = new Date();
      const filtered = (data || []).filter(booking => {
        const endDateTime = new Date(`${booking.booking_date}T${booking.end_time}`);
        return now < new Date(endDateTime.getTime() + 60 * 60 * 1000);
      });

      setBookings(filtered);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleCancelBooking = async (mode: 'single' | 'all') => {
    if (!cancellingBooking) return;
    setCancelling(true);
    try {
      if (mode === 'all' && cancellingBooking.recurrence_group_id) {
        const { error } = await supabase
          .from('bookings').delete()
          .eq('recurrence_group_id', cancellingBooking.recurrence_group_id)
          .gte('booking_date', cancellingBooking.booking_date);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('bookings').delete().eq('id', cancellingBooking.id);
        if (error) throw error;
      }
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
      state: { rescheduleFrom: booking.id, serviceId: booking.service_id, barberId: booking.barber_id },
    });
  };

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const isUpcoming = (booking: BookingWithDetails): boolean => {
    const now = new Date();
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    return bookingDateTime > now && (booking.status === 'pending' || booking.status === 'confirmed');
  };

  const isWithin12Hours = (booking: BookingWithDetails): boolean => {
    const now = new Date();
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time}`);
    return (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60) < 12;
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const parseLocalDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateShort = (dateStr: string): string => {
    const date = parseLocalDate(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading) return <div style={{ minHeight: '100dvh', backgroundColor: '#101214' }} />;

  const rewardsEnabled = siteSettings?.rewards_enabled !== false;

  return (
    <>
      <Navigation />
      <View className={styles.container}>
        <View className={styles.content}>
          <DashboardHeader
            firstName={customer?.first_name}
            hasBookings={bookings.length > 0}
            rewardsEnabled={rewardsEnabled}
            rewardPoints={customer?.reward_points || 0}
            onEditProfile={() => setShowEditProfile(true)}
          />

          <View className={styles.section}>
            {bookings.length === 0 ? (
              <EmptyBookingsState rewardsEnabled={rewardsEnabled} />
            ) : (
              <View className={styles.bookingsList}>
                {recurringGroups.map((group) => (
                  <RecurringBookingCard
                    key={group.groupId}
                    group={group}
                    isExpanded={expandedRecurring === group.groupId}
                    isUpcoming={isUpcoming(group.nextBooking)}
                    formatTime={formatTime}
                    formatDateShort={formatDateShort}
                    onToggleExpand={() =>
                      setExpandedRecurring(
                        expandedRecurring === group.groupId ? null : group.groupId
                      )
                    }
                    onCancel={() => setCancellingBooking(group.nextBooking)}
                  />
                ))}
                {standaloneBookings.map((booking) => (
                  <StandaloneBookingCard
                    key={booking.id}
                    booking={booking}
                    isUpcoming={isUpcoming(booking)}
                    formatTime={formatTime}
                    formatDateShort={formatDateShort}
                    onReschedule={() => handleReschedule(booking)}
                    onCancel={() => setCancellingBooking(booking)}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {cancellingBooking && (
        <CancelBookingModal
          booking={cancellingBooking}
          cancelling={cancelling}
          isWithin12Hours={isWithin12Hours(cancellingBooking)}
          parseLocalDate={parseLocalDate}
          formatTime={formatTime}
          onClose={() => setCancellingBooking(null)}
          onConfirm={handleCancelBooking}
        />
      )}

      {showEditProfile && customer && (
        <EditProfileModal
          customer={customer}
          onClose={() => setShowEditProfile(false)}
          onSaved={() => {
            refreshCustomer();
            setShowEditProfile(false);
          }}
          onAccountDeleted={() => navigate('/', { replace: true })}
        />
      )}
    </>
  );
}
