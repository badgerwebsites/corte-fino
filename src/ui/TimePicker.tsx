import { useMemo } from 'react';
import * as styles from '../styles/timePicker.css';

interface TimePickerProps {
  value: string; // HH:MM
  onChange: (value: string) => void;
  step?: number; // seconds, default 300 (5 min)
  invalid?: boolean;
  label?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseTime(value: string) {
  const [h, m] = (value || '00:00').split(':').map(Number);
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return { hour12, minute: m || 0, period };
}

function toHHMM(hour12: number, minute: number, period: 'AM' | 'PM'): string {
  let h: number;
  if (period === 'AM') {
    h = hour12 === 12 ? 0 : hour12;
  } else {
    h = hour12 === 12 ? 12 : hour12 + 12;
  }
  return `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

const isMobile =
  typeof navigator !== 'undefined' &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// ─── Web version ─────────────────────────────────────────────────────────────

export function WebTimePicker({ value, onChange, step = 300, invalid, label }: TimePickerProps) {
  return (
    <div>
      {label && <label className={styles.pickerLabel}>{label}</label>}
      <input
        type="time"
        step={step}
        value={value}
        onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
        onChange={(e) => { if (e.target.value) onChange(e.target.value); }}
        className={`${styles.webInput}${invalid ? ` ${styles.inputInvalid}` : ''}`}
      />
    </div>
  );
}

// ─── Mobile version ──────────────────────────────────────────────────────────

export function MobileTimePicker({ value, onChange, step = 300, invalid, label }: TimePickerProps) {
  const { hour12, minute, period } = useMemo(() => parseTime(value), [value]);

  const minuteStep = Math.max(1, Math.round(step / 60));
  const minuteOptions = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => i * minuteStep
  );

  const emit = (h: number, m: number, p: 'AM' | 'PM') => onChange(toHHMM(h, m, p));

  return (
    <div>
      {label && <label className={styles.pickerLabel}>{label}</label>}
      <div className={`${styles.mobileWrapper}${invalid ? ` ${styles.inputInvalid}` : ''}`}>
        <select
          value={hour12}
          onChange={(e) => emit(Number(e.target.value), minute, period)}
          className={styles.mobileSelect}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <span className={styles.mobileColon}>:</span>

        <select
          value={minute}
          onChange={(e) => emit(hour12, Number(e.target.value), period)}
          className={styles.mobileSelect}
        >
          {minuteOptions.map((m) => (
            <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
          ))}
        </select>

        <select
          value={period}
          onChange={(e) => emit(hour12, minute, e.target.value as 'AM' | 'PM')}
          className={`${styles.mobileSelect} ${styles.mobileSelectPeriod}`}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}

// ─── Auto-selecting wrapper ───────────────────────────────────────────────────

export function TimePicker(props: TimePickerProps) {
  return isMobile ? <MobileTimePicker {...props} /> : <WebTimePicker {...props} />;
}
