// ui/DateSelect.tsx
import * as styles from '../styles/pickers.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

interface Props {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  min?: string; // "YYYY-MM-DD"
}

export function DateSelect({ value, onChange, min }: Props) {
  const [yStr, mStr, dStr] = value.split('-');
  const year = parseInt(yStr);
  const month = parseInt(mStr); // 1-12
  const day = parseInt(dStr);

  const minParts = min ? min.split('-').map(Number) : null;
  const minYear = minParts ? minParts[0] : new Date().getFullYear();
  const minMonth = minParts ? minParts[1] : 1;
  const minDay = minParts ? minParts[2] : 1;

  const maxYear = new Date().getFullYear() + 2;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const daysInMonth = new Date(year, month, 0).getDate();

  const emit = (y: number, m: number, d: number) => {
    const clampedDay = Math.min(d, new Date(y, m, 0).getDate());
    onChange(`${y}-${m.toString().padStart(2, '0')}-${clampedDay.toString().padStart(2, '0')}`);
  };

  const availableMonths = MONTHS.map((label, i) => ({ label, value: i + 1 })).filter(({ value: m }) => {
    if (!minParts || year > minYear) return true;
    return m >= minMonth;
  });

  const availableDays = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter((d) => {
    if (!minParts || year > minYear || month > minMonth) return true;
    return d >= minDay;
  });

  return (
    <div className={styles.dateSelectWrapper}>
      <select
        className={styles.dateSelectPart}
        value={month}
        onChange={(e) => emit(year, parseInt(e.target.value), day)}
      >
        {availableMonths.map(({ label, value: m }) => (
          <option key={m} value={m}>{label}</option>
        ))}
      </select>
      <select
        className={styles.dateSelectPart}
        value={day}
        onChange={(e) => emit(year, month, parseInt(e.target.value))}
      >
        {availableDays.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select
        className={styles.dateSelectPart}
        value={year}
        onChange={(e) => emit(parseInt(e.target.value), month, day)}
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
