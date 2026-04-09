import * as styles from '../styles/timePicker.css';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  min?: string;
  label?: string;
  required?: boolean;
}

export function DatePicker({ value, onChange, min, label, required }: DatePickerProps) {
  return (
    <div>
      {label && <label className={styles.pickerLabel}>{label}</label>}
      <input
        type="date"
        value={value}
        min={min}
        required={required}
        onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
        onChange={(e) => { if (e.target.value) onChange(e.target.value); }}
        className={styles.dateInput}
      />
    </div>
  );
}
