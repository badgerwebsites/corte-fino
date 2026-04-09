// ui/TimeSelect.tsx
import * as styles from '../styles/pickers.css';

interface Props {
  value: string; // "HH:MM" 24-hour
  onChange: (value: string) => void;
  invalid?: boolean;
}

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function to24Hour(h: number, period: string): number {
  if (period === 'AM') return h === 12 ? 0 : h;
  return h === 12 ? 12 : h + 12;
}

export function TimeSelect({ value, onChange, invalid }: Props) {
  const [hStr, mStr] = value.split(':');
  const hours24 = parseInt(hStr) || 0;
  const minutes = parseInt(mStr) || 0;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const displayHour = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;

  const emit = (h: number, m: number, p: string) => {
    const h24 = to24Hour(h, p);
    onChange(`${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  };

  return (
    <div className={invalid ? styles.timeSelectWrapperInvalid : styles.timeSelectWrapper}>
      <select
        className={styles.timeSelectPart}
        value={displayHour}
        onChange={(e) => emit(parseInt(e.target.value), minutes, period)}
      >
        {HOURS.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
      <select
        className={styles.timeSelectPart}
        value={minutes}
        onChange={(e) => emit(displayHour, parseInt(e.target.value), period)}
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
        ))}
      </select>
      <select
        className={styles.timeSelectPeriod}
        value={period}
        onChange={(e) => emit(displayHour, minutes, e.target.value)}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}
