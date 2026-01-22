import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Barber, Service, BarberServicePricing } from '../types/database.types';
import { Navigation } from '../components/Navigation';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/booking.css';

type BookingStep = 1 | 2 | 3 | 4;

export default function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<BookingStep>(1);
  const [loading, setLoading] = useState(true);

  // Data from database
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [pricing, setPricing] = useState<BarberServicePricing[]>([]);

  // Booking selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [anyBarber, setAnyBarber] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesRes, barbersRes, pricingRes] = await Promise.all([
        supabase.from('services').select('*').order('name'),
        supabase.from('barbers').select('*').eq('is_active', true).order('name'),
        supabase.from('barber_service_pricing').select('*'),
      ]);

      if (servicesRes.error) throw servicesRes.error;
      if (barbersRes.error) throw barbersRes.error;
      if (pricingRes.error) throw pricingRes.error;

      setServices(servicesRes.data || []);
      setBarbers(barbersRes.data || []);
      setPricing(pricingRes.data || []);
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

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
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
    if (!user) {
      navigate('/login?redirect=/book');
      return;
    }

    // TODO: Integrate with Stripe payment
    alert('Payment integration coming next! This will require Stripe setup.');
  };

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const startHour = 9;
    const endHour = 21;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    return slots;
  };

  const getNextAvailableDates = (): string[] => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const resetBooking = () => {
    setSelectedService(null);
    setSelectedBarber(null);
    setAnyBarber(false);
    setSelectedDate('');
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

  return (
    <>
      <Navigation />
      <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>Book Your Appointment</Text>
        <Link to="/" className={styles.backLink}>← Back to Home</Link>
      </View>

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

          <View className={styles.dateTimeContainer}>
            <View className={styles.dateSection}>
              <Text className={styles.sectionLabel}>Select Date</Text>
              <View className={styles.dateGrid}>
                {getNextAvailableDates().map((date) => (
                  <button
                    key={date}
                    className={`${styles.dateButton} ${selectedDate === date ? styles.dateButtonActive : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </View>
            </View>

            {selectedDate && (
              <View className={styles.timeSection}>
                <Text className={styles.sectionLabel}>Select Time</Text>
                <View className={styles.timeGrid}>
                  {generateTimeSlots().map((time) => {
                    // If specific barber selected, show their pricing period
                    let timePeriodLabel = '';
                    if (selectedBarber) {
                      const period = getTimePeriod(time, selectedBarber);
                      timePeriodLabel = period === 'evening' ? ' (Evening)' : '';
                    }

                    return (
                      <button
                        key={time}
                        className={`${styles.timeButton} ${selectedTime === time ? styles.timeButtonActive : ''}`}
                        onClick={() => handleDateTimeSelect(selectedDate, time)}
                      >
                        {time}{timePeriodLabel}
                      </button>
                    );
                  })}
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
              <Text className={styles.confirmValue}>{formatDate(selectedDate)}</Text>
              <Text className={styles.confirmDetail}>{selectedTime}</Text>
            </View>

            {selectedBarber && (
              <View className={styles.confirmSection}>
                <Text className={styles.confirmLabel}>Price</Text>
                <Text className={styles.priceAmount}>${calculatePrice().toFixed(2)}</Text>
                <Text className={styles.confirmDetail}>
                  {getTimePeriod(selectedTime, selectedBarber) === 'evening'
                    ? `Evening rate (${selectedBarber.evening_hours_start}-${selectedBarber.evening_hours_end})`
                    : `Regular rate (${selectedBarber.regular_hours_start}-${selectedBarber.regular_hours_end})`}
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
              <button className={styles.confirmButton} onClick={handleBooking}>
                {user ? 'Proceed to Payment' : 'Login to Book'}
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
    </>
  );
}
