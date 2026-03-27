import { Link } from 'react-router-dom';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/home.css';

export function HomeFooter() {
  return (
    <View className={styles.footer}>
      <View className={styles.contactInfo}>
        <a
          href="https://maps.apple.com/?address=966%20W%20400%20N%20ste%20100,%20Logan,%20UT%2084321,%20USA"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          <View className={styles.contactRow}>
            <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <View>
              <Text className={styles.contactText}>966 W 400 N Ste 100</Text>
              <Text className={styles.contactText}> Logan, UT 84321</Text>
            </View>
          </View>
        </a>

        <a href="mailto:cortefino962@gmail.com" className={styles.contactLink}>
          <View className={styles.contactRow}>
            <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <Text className={styles.contactText}>cortefino962@gmail.com</Text>
          </View>
        </a>
      </View>
      <Link to="/privacy" className={styles.footerText}>
        Privacy Policy
      </Link>
      <Text className={styles.footerText}>
        © 2026 Corte Fino. All rights reserved.
      </Text>
    </View>
  );
}
