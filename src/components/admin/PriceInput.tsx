// components/admin/PriceInput.tsx
import { useState } from 'react';

interface PriceInputProps {
  initialValue: number;
  onSave: (value: number) => void;
  className?: string;
  placeholder?: string;
}

export function PriceInput({ initialValue, onSave, className, placeholder = '$' }: PriceInputProps) {
  const [localValue, setLocalValue] = useState(initialValue > 0 ? initialValue.toString() : '');
  const [lastSavedValue, setLastSavedValue] = useState<number | null>(null);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);

  // Derived state during render — React re-runs the component immediately with updated state
  if (prevInitialValue !== initialValue) {
    setPrevInitialValue(initialValue);
    const currentNumValue = parseFloat(localValue) || 0;
    if (lastSavedValue === null) {
      setLocalValue(initialValue > 0 ? initialValue.toString() : '');
    } else if (initialValue === lastSavedValue) {
      setLastSavedValue(null);
    } else if (initialValue !== currentNumValue && initialValue !== lastSavedValue) {
      setLocalValue(initialValue > 0 ? initialValue.toString() : '');
      setLastSavedValue(null);
    }
  }

  const handleBlur = () => {
    const numValue = parseFloat(localValue) || 0;
    const currentPropValue = initialValue || 0;
    if (numValue !== currentPropValue) {
      setLastSavedValue(numValue);
      onSave(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.currentTarget.blur();
  };

  return (
    <input
      type="number"
      step="1"
      min="0"
      className={className}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
    />
  );
}
