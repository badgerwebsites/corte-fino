// components/home/BarbersSection.tsx
import type { Barber } from '../../types/database.types';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/home.css';
import { formatPhone } from '../../../utils/formatPhone';

interface BarbersSectionProps {
  barbers: Barber[];
}

export function BarbersSection({ barbers }: BarbersSectionProps) {
  if (barbers.length === 0) return null;

  return (
    <View className={styles.sectionDark}>
      <View className={styles.barbersGrid}>
        {barbers.map((barber) => (
          <View key={barber.id} className={styles.barberCard}>
            {barber.image_url ? (
              <img
                src={barber.image_url}
                alt={barber.name}
                className={styles.barberImage}
              />
            ) : (
              <View className={styles.barberImagePlaceholder}>
                Barber Photo
              </View>
            )}

            <View className={styles.barberInfo}>
              <Text className={styles.barberName}>{barber.name}</Text>

              {barber.bio && (
                <Text className={styles.barberBio}>{barber.bio}</Text>
              )}

              {barber.instagram_handle && (
                <a
                  href={`https://instagram.com/${barber.instagram_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.barberSocialLink}
                >
                  <View className={styles.barberSocialRow}>
                    <svg
                      className={styles.barberSocialIcon}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" />
                    </svg>
                    <Text className={styles.barberSocial}>
                      @{barber.instagram_handle}
                    </Text>
                  </View>
                </a>
              )}

              {barber.phone && (
                <a href={`tel:${barber.phone}`} className={styles.barberPhoneLink}>
                  <View className={styles.barberPhoneRow}>
                    <svg
                      className={styles.barberPhoneIcon}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    <Text className={styles.barberPhone}>
                      {formatPhone(barber.phone)}
                    </Text>
                  </View>
                </a>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
