// styles/pickers.css.ts
import { style } from '@vanilla-extract/css';
import { darker_bg, text_primary, text_secondary } from './globalStyles.css';

const wrapperBase = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: darker_bg,
  borderRadius: 8,
  padding: '6px 8px',
  boxSizing: 'border-box' as const,
};

export const timeSelectWrapper = style({
  ...wrapperBase,
  border: `1px solid ${text_secondary}`,
});

export const timeSelectWrapperInvalid = style({
  ...wrapperBase,
  border: '1px solid #dc2626',
});

const selectPartBase = {
  flex: '0 0 auto',
  minWidth: 0,
  backgroundColor: 'transparent',
  border: 'none',
  color: text_primary,
  fontSize: 16,
  fontFamily: 'inherit',
  colorScheme: 'dark' as const,
  cursor: 'pointer' as const,
  textAlign: 'center' as const,
  padding: '4px 0px',
  ':focus': { outline: 'none' },
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 18,
    },
  },
};

export const timeSelectPart = style({
  ...selectPartBase,
  width: 48, // 👈 hours & minutes consistent
});

export const timeSelectPeriod = style({
  ...selectPartBase,
  width: 56, // 👈 AM/PM slightly wider
});

// Date select

export const dateSelectWrapper = style({
  ...wrapperBase,
  border: `1px solid ${text_secondary}`,
  gap: 2,
});

export const dateSelectPart = style({
  ...selectPartBase,
  textAlign: 'left' as const,
});
