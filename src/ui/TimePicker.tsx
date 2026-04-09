// ui/TimePicker.tsx
//
// iOS behavior:
//   scroll wheel spinning → onChange (intermediate values, visual only)
//   Done tapped           → onBlur  (final value — save here)
//   Cancel tapped         → onBlur  (browser reverts to original — save original, no-op)
//   Clear tapped          → onChange("") then onBlur("") — both guarded, nothing saved
//
// Desktop behavior:
//   typing / arrow keys   → onChange (visual only)
//   focus leaves          → onBlur  (save)
//
// Props:
//   onPreview — fires on every onChange tick (update display state for error checking)
//   onChange  — fires on blur (the committed value — trigger save here)

import * as styles from '../styles/timePicker.css';

interface TimePickerProps {
  value: string;                       // HH:MM — the last committed value
  onChange: (val: string) => void;     // called on blur: update state + save
  onPreview?: (val: string) => void;   // called on change: update state for error display
  invalid?: boolean;
  label?: string;
}

export function TimePicker({ value, onChange, onPreview, invalid, label }: TimePickerProps) {
  return (
    <div>
      {label && <label className={styles.pickerLabel}>{label}</label>}
      <input
        type="time"
        step={300}
        value={value}
        onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
        onChange={(e) => {
          if (!e.target.value) return; // Clear button — ignore
          onPreview?.(e.target.value);
        }}
        onBlur={(e) => {
          if (!e.target.value) return; // Clear button — ignore, keep current value
          // Sync preview in case Cancel reverted the value (or Done confirmed it)
          onPreview?.(e.target.value);
          onChange(e.target.value);
        }}
        className={`${styles.webInput}${invalid ? ` ${styles.inputInvalid}` : ''}`}
      />
    </div>
  );
}
