import { style } from '@vanilla-extract/css';
import { darker_bg, text_primary, text_secondary, text_muted } from './globalStyles.css';

const sharedBorder = {
  border: `1px solid ${text_secondary}`,
  borderRadius: 8,
  backgroundColor: darker_bg,
};

// ─── Web (native <input type="time">) ───────────────────────────────────────

export const webInput = style({
  ...sharedBorder,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  color: text_primary,
  padding: '10px 6px',
  fontSize: 15,
  fontFamily: 'inherit',
  colorScheme: 'dark',
  cursor: 'pointer',
  display: 'block',
  textAlign: 'center',
  ':focus': {
    outline: 'none',
    border: `1px solid ${text_secondary}`,
  },
  '@media': {
    'screen and (min-width: 480px)': {
      padding: '12px 8px',
      fontSize: 16,
    },
  },
  selectors: {
    '&::-webkit-clear-button': { display: 'none' },
    '&::-webkit-inner-spin-button': { display: 'none' },
  },
});

// ─── Mobile (three <select> dropdowns) ──────────────────────────────────────

export const mobileWrapper = style({
  ...sharedBorder,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 4px',
  gap: 2,
  '@media': {
    'screen and (min-width: 480px)': {
      padding: '8px 6px',
    },
  },
});

export const mobileSelect = style({
  flex: 1,
  minWidth: 0,
  backgroundColor: 'transparent',
  color: text_primary,
  border: 'none',
  fontSize: 15,
  fontFamily: 'inherit',
  cursor: 'pointer',
  textAlign: 'center',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  padding: '4px 0',
  '@media': {
    'screen and (min-width: 480px)': {
      fontSize: 16,
    },
  },
});

export const mobileSelectPeriod = style({
  flex: '0 0 auto',
  width: 42,
});

export const mobileColon = style({
  color: text_secondary,
  fontSize: 15,
  flexShrink: 0,
  userSelect: 'none',
});

// ─── Date (native <input type="date">) ──────────────────────────────────────

export const dateInput = style({
  ...sharedBorder,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  color: text_primary,
  padding: '10px 6px',
  fontSize: 15,
  fontFamily: 'inherit',
  colorScheme: 'dark',
  cursor: 'pointer',
  display: 'block',
  textAlign: 'center',
  ':focus': {
    outline: 'none',
    border: `1px solid ${text_secondary}`,
  },
  '@media': {
    'screen and (min-width: 480px)': {
      padding: '12px 8px',
      fontSize: 16,
    },
  },
  selectors: {
    '&::-webkit-clear-button': { display: 'none' },
    '&::-webkit-inner-spin-button': { display: 'none' },
    '&::-webkit-calendar-picker-indicator': {
      filter: 'invert(1)',
      opacity: 0.5,
      cursor: 'pointer',
    },
  },
});

// ─── Shared invalid state ────────────────────────────────────────────────────

export const inputInvalid = style({
  border: '1px solid #dc2626',
});

// ─── Label ──────────────────────────────────────────────────────────────────

export const pickerLabel = style({
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: text_muted,
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});
