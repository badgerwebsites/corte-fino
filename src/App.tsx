import { View } from "./ui/View";
import { Text } from "./ui/Text";
import * as styles from "./styles/home.css";

export default function App() {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>Corte Fino</Text>
      <Text className={styles.subtitle}>
        Precision cuts. Refined style.
      </Text>
    </View>
  );
}
