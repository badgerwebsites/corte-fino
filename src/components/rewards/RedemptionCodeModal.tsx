import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/rewards.css';

interface RedemptionCodeModalProps {
  code: string;
  onClose: () => void;
}

export function RedemptionCodeModal({ code, onClose }: RedemptionCodeModalProps) {
  return (
    <View className={styles.codeModal}>
      <View className={styles.codeModalContent}>
        <Text className={styles.codeModalTitle}>Redemption Code</Text>
        <View className={styles.codeDisplay}>
          <Text className={styles.codeText}>{code}</Text>
        </View>
        <Text className={styles.codeModalHint}>
          Show this code to your barber to claim your reward
        </Text>
        <button className={styles.codeModalButton} onClick={onClose}>
          Got It
        </button>
      </View>
    </View>
  );
}
