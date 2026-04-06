// components/dashboard/CancelBookingModal.tsx
import type { BookingWithDetails } from '../../types/database.types';
import { RECURRENCE_LABELS } from '../../types/database.types';
import { View } from '../../ui/View';
import { Text } from '../../ui/Text';
import * as styles from '../../styles/dashboard.css';

interface CancelBookingModalProps {
  booking: BookingWithDetails;
  cancelling: boolean;
  isWithin12Hours: boolean;
  parseLocalDate: (dateStr: string) => Date;
  formatTime: (time: string) => string;
  onClose: () => void;
  onConfirm: (mode: 'single' | 'all') => void;
}

export function CancelBookingModal({
  booking,
  cancelling,
  // isWithin12Hours,
  parseLocalDate,
  formatTime,
  onClose,
  onConfirm,
}: CancelBookingModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalTitleRow}>
          <Text className={styles.modalTitle}>Cancel appointment?</Text>
        </div>
        <View className={styles.modalBookingInfo}>
          <Text className={styles.modalBookingDate}>
            {parseLocalDate(booking.booking_date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          <Text className={styles.modalBookingTime}>
            {formatTime(booking.start_time)} · {booking.service?.name}
          </Text>
          {booking.recurrence_group_id && (
            <Text className={styles.recurringBadge}>
              Recurring {RECURRENCE_LABELS[booking.recurrence_pattern as keyof typeof RECURRENCE_LABELS] || 'appointment'}
            </Text>
          )}
        </View>

        {/* {isWithin12Hours ? (
          <View className={styles.feeWarning}>
            <Text className={styles.feeWarningTitle}>Cancellation fee applies</Text>
            <Text className={styles.feeWarningText}>
              A 50% fee (${(booking.total_price * 0.5).toFixed(2)}) applies for cancellations within 12 hours.
            </Text>
          </View>
        ) : (
          <View className={styles.nofeeWarning}>
            <Text className={styles.nofeeText}>
              No fee if canceled at least 12 hours in advance.
            </Text>
          </View>
        )} */}

        {booking.recurrence_group_id ? (
          <View className={styles.cancelOptions}>
            <button
              className={styles.cancelOptionButton}
              onClick={() => onConfirm('single')}
              disabled={cancelling}
            >
              <span className={styles.cancelOptionLabel}>Cancel this appointment only</span>
              <span className={styles.cancelOptionDesc}>Other appointments in the series will remain</span>
            </button>
            <button
              className={styles.cancelOptionButtonDanger}
              onClick={() => onConfirm('all')}
              disabled={cancelling}
            >
              <span className={styles.cancelOptionLabel}>Cancel all future appointments</span>
              <span className={styles.cancelOptionDesc}>Cancel this and all remaining appointments in the series</span>
            </button>
            <button
              className={styles.modalKeepButton}
              onClick={onClose}
              disabled={cancelling}
              style={{ marginTop: 8 }}
            >
              Keep appointments
            </button>
          </View>
        ) : (
          <View className={styles.modalActions}>
            <button className={styles.modalKeepButton} onClick={onClose} disabled={cancelling}>
              Keep
            </button>
            <button
              className={styles.modalCancelButton}
              onClick={() => onConfirm('single')}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Delete'}
            </button>
          </View>
        )}
      </div>
    </div>
  );
}
