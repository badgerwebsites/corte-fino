import type { Customer } from '../../types/database.types';
import { CustomerSearchInput } from './CustomerSearchInput';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/booking.css';

interface StepCustomerSelectProps {
  selectedCustomer: Customer | null;
  onSelect: (customer: Customer) => void;
  onClear: () => void;
}

export function StepCustomerSelect({ selectedCustomer, onSelect, onClear }: StepCustomerSelectProps) {
  return (
    <View className={styles.stepContainer}>
      <Text className={styles.stepTitle}>Select Customer</Text>
      <CustomerSearchInput
        selectedCustomer={selectedCustomer}
        onSelect={onSelect}
        onClear={onClear}
      />
    </View>
  );
}
