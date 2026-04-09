// ui/DatePicker.tsx
//
// Same commit model as TimePicker:
//   onChange → visual preview only (no save)
//   onBlur   → save
//   Clear / empty value → guarded in both handlers

import * as styles from '../styles/timePicker.css';

interface DatePickerProps {
  value: string;                       // YYYY-MM-DD
  onChange: (val: string) => void;     // called on blur: update state + save
  onPreview?: (val: string) => void;   // called on change: update state
  min?: string;
  label?: string;
  required?: boolean;
}

export function DatePicker({ value, onChange, onPreview, min, label, required }: DatePickerProps) {
  return (
    <div>
      {label && <label className={styles.pickerLabel}>{label}</label>}
      <input
        type="date"
        value={value}
        min={min}
        required={required}
        onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
        onChange={(e) => {
          if (!e.target.value) return;
          onPreview?.(e.target.value);
        }}
        onBlur={(e) => {
          if (!e.target.value) return;
          onPreview?.(e.target.value);
          onChange(e.target.value);
        }}
        className={styles.dateInput}
      />
    </div>
  );
}
