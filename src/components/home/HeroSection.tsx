import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/home.css';

interface HeroSectionProps {
  heroBackground: string;
  isLoading: boolean;
  activeHeroLogos: string[];
  heroLogoIndex: number;
  onBook: () => void;
}

export function HeroSection({ heroBackground, isLoading, activeHeroLogos, heroLogoIndex, onBook }: HeroSectionProps) {
  return (
    <View className={styles.heroBackground}>
      <View
        className={styles.heroFullScreen}
        style={{ backgroundImage: `url('${heroBackground}')` }}
      >
        <View className={styles.heroOverlay} />

        <View className={`${styles.heroContent} ${isLoading ? styles.heroContentLoading : ''}`}>
          {isLoading ? (
            <View className={styles.heroLogoPlaceholder} />
          ) : activeHeroLogos.length > 1 ? (
            <View className={styles.heroCarouselContainer}>
              <View
                className={styles.heroCarouselTrack}
                style={{ transform: `translateX(-${heroLogoIndex * 100}%)` }}
              >
                {activeHeroLogos.map((logoSrc, index) => (
                  <View key={index} className={styles.heroCarouselSlide}>
                    <img
                      src={logoSrc}
                      alt={`Logo ${index + 1}`}
                      className={styles.heroCarouselImage}
                    />
                  </View>
                ))}
              </View>
            </View>
          ) : activeHeroLogos.length === 1 ? (
            <img
              src={activeHeroLogos[0]}
              alt="Corte Fino"
              className={styles.heroLogoLarge}
            />
          ) : null}

          <button className={styles.heroBookButton} onClick={onBook}>
            Book Appointment
          </button>
        </View>

        <View className={styles.scrollIndicator}>
          <Text className={styles.scrollText}>Meet Our Barbers</Text>
          <Text className={styles.scrollArrow}>↓</Text>
        </View>
      </View>
    </View>
  );
}
