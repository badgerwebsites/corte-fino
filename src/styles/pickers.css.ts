// styles/pickers.css.ts
import { style } from '@vanilla-extract/css';
import { darker_bg, text_primary, text_secondary } from './globalStyles.css';

const wrapperBase = {
  display: 'flex' as const,
  alignItems: 'center' as const,
  backgroundColor: darker_bg,
  borderRadius: 8,
  padding: '6px 4px',
  gap: 2,
  width: '100%',
  boxSizing: 'border-box' as const,
  cursor: 'pointer' as const,
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
  flex: 1,
  minWidth: 0,
  backgroundColor: 'transparent',
  border: 'none',
  color: text_primary,
  fontSize: 14,
  fontFamily: 'inherit',
  colorScheme: 'dark' as const,
  cursor: 'pointer' as const,
  textAlign: 'center' as const,
  padding: '2px 0',
  ':focus': { outline: 'none' },
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 15,
    },
  },
};

export const timeSelectPart = style(selectPartBase);

export const timeSelectPeriod = style({
  ...selectPartBase,
  flex: '0 0 auto' as unknown as number,
});

export const timeSelectColon = style({
  flexShrink: 0,
  color: text_secondary,
  fontSize: 14,
  userSelect: 'none',
  paddingBottom: 1,
});

// Date select

export const dateSelectWrapper = style({
  ...wrapperBase,
  border: `1px solid ${text_secondary}`,
  gap: 4,
});

export const dateSelectPart = style({
  ...selectPartBase,
  textAlign: 'left' as const,
});
