// ui/DatePicker.tsx
//
// iOS behavior (date wheels fire onChange on every spin, same as TimePicker):
//   scroll wheel spinning → onChange  (preview only — keeps controlled input in sync)
//   Done tapped           → onBlur   (final value — save here)
//   Cancel tapped         → onBlur   (browser reverts to original — re-saves original, no-op)
//   Reset tapped          → onChange("") → guarded; onBlur("") → guarded, restores preview
//
// Web behavior:
//   pick from calendar    → onChange (save immediately)
//   blur                  → onBlur  (no-op if value unchanged)

import { useState, useEffect } from 'react';
import * as styles from '../styles/timePicker.css';

interface DatePickerProps {
  value: string;                       // YYYY-MM-DD
  onChange: (val: string) => void;     // called on blur: update state + save
  onPreview?: (val: string) => void;   // optional: called on change for external error display
  min?: string;
  label?: string;
  required?: boolean;
}

export function DatePicker({ value, onChange, onPreview, min, label, required }: DatePickerProps) {
  // Internal preview state prevents the controlled-input snap-back on iOS
  // while the user is spinning wheels before tapping Done.
  const [preview, setPreview] = useState(value);

  // Keep preview in sync when the committed value changes externally (e.g. form reset).
  useEffect(() => {
    setPreview(value);
  }, [value]);

  return (
    <div>
      {label && <label className={styles.pickerLabel}>{label}</label>}
      <input
        type="date"
        value={preview}
        min={min}
        required={required}
        className={styles.dateInput}
        onChange={(e) => {
          const val = e.target.value;
          if (!val) return; // Reset / clear — ignore, blur will restore
          setPreview(val);
          onPreview?.(val);
        }}
        onBlur={(e) => {
          const val = e.target.value;
          if (!val) {
            // Reset was tapped and picker closed — discard, restore to last committed value
            setPreview(value);
            return;
          }
          onPreview?.(val);
          onChange(val);
        }}
      />
    </div>
  );
}
