import { useState } from 'react';
import { Link } from 'react-router-dom';
import { View } from '../ui/View';
import { Text } from '../ui/Text';
import * as styles from '../styles/booking.css';

export default function BookingPage() {
  const [step, setStep] = useState(1);

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>Book Your Appointment</Text>
        <Text className={styles.subtitle}>
          We'll build this booking flow in the next steps
        </Text>
      </View>

      <View className={styles.comingSoon}>
        <Text className={styles.comingSoonText}>
          Booking interface coming next!
        </Text>
        <Text>This will include:</Text>
        <ul className={styles.featureList}>
          <li>Select service</li>
          <li>Choose barber or "any available"</li>
          <li>Pick date and time</li>
          <li>Dynamic pricing display</li>
          <li>Stripe payment with card requirement</li>
          <li>Cancellation policy agreement</li>
        </ul>
      </View>

      <View className={styles.backLink}>
        <Link to="/" className={styles.link}>← Back to Home</Link>
      </View>
    </View>
  );
}
