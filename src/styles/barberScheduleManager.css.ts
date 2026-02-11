import { style } from '@vanilla-extract/css';

const darker_bg = "#101214";
const dark_bg = "#222222";
const button =  "#96cfe0";
const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";
// const border_subtle = "rgba(255,255,255,0.08)";
// const border_hover = "rgba(255,255,255,0.18)";

export const headerTitle = style({
  fontSize: 20,
  fontWeight: 600,
  color: text_primary,
});

export const scheduleList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

export const dayCard = style({
//   backgroundColor: dark_bg,
//   border: `2px solid ${border_subtle}`,
//   borderRadius: '0.75rem',
//   padding: '1rem',
//   transition: 'all 0.2s',
});

export const dayCardActive = style({
//   backgroundColor: darker_bg,
//   borderColor: border_hover,
});

export const dayHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
});

export const dayHeaderLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
});

export const dayCheckbox = style({
  width: 18,
  height: 18,
  cursor: 'pointer',
  accentColor: button,
});

export const dayLabel = style({
  fontSize: 18,
  fontWeight: 600,
  color: text_primary,
});

export const dayLabelInactive = style({
  color: text_muted,
});

export const notWorkingText = style({
  fontSize: 14,
  color: text_secondary,
  fontStyle: 'italic',
});

export const saveButton = style({
  padding: '0.375rem 0.75rem',
  backgroundColor: button,
  color: dark_bg,
  border: 'none',
  borderRadius: 4,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
});

export const saveButtonDisabled = style({
  cursor: 'not-allowed',
  opacity: 0.7,
});

export const saveDayOffButton = style({
  padding: '0.375rem 0.75rem',
  backgroundColor: '#6b7280',
  color: text_primary,
  border: 'none',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
});

export const workingHoursCard = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
});

export const timeLabel = style({
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: text_secondary,
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const timeInput = style({
  backgroundColor: darker_bg,
  color: text_primary,
  border: '1px solid #1a1a1a',
  boxSizing: 'border-box',
  padding: '0.625rem',
  borderRadius: 4,
  fontSize: '0.875rem',
  colorScheme: 'dark',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      width: '100%',
    },
  },
  ':focus': {
    outline: 'none',
    border: '1px solid #96cfe0',
  },
  '::placeholder': {
    color: text_muted,
  },
});

export const breaksCard = style({
//   padding: 12,
//   backgroundColor: darker_bg,
//   borderRadius: '0.5rem',
//   border: `1px solid ${border_subtle}`,
  marginTop: 12,
  marginBottom: 12,
});

export const breaksHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 16,
  marginBottom: 12,
});

export const breaksLabel = style({
  fontSize: 14,
  fontWeight: 600,
  color: '#dc2626',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const addBreakButton = style({
  padding: '8px',
  backgroundColor: '#fecaca',
  color: '#dc2626',
  border: 'none',
  borderRadius: 4,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#fcb3b3',
  },
});

export const breakRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr auto',
  alignItems: 'center',
  width: '100%',
  minWidth: 0,

  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: '1fr auto 1fr auto',
      gap: 4,
    },
  },
});

export const breakInput = style({
  width: '100%',
  minWidth: 0,
  backgroundColor: darker_bg,
  color: text_primary,
  border: '1px solid #1a1a1a',
  boxSizing: 'border-box',
  padding: 8,
  borderRadius: 4,
  fontSize: '0.875rem',
  colorScheme: 'dark',

  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.75rem',
      borderRadius: '0.5rem',
      fontSize: '1rem',
    },
  },

  ':focus': {
    outline: 'none',
    border: '1px solid #96cfe0',
  },
});

export const breakSeparator = style({
  display: 'flex',
  padding: 4,
  justifyContent: 'center',
  alignItems: 'center',
  color: text_secondary,
  fontSize: 16,
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 8,
    },
  },
});

export const removeBreakButton = style({
  backgroundColor: 'transparent',
  color: '#dc2626',
  border: 'none',
  cursor: 'pointer',
});

export const scheduleSummary = style({
  padding: 12,
  borderRadius: '0.375rem',
  border: `1px solid ${text_secondary}`,
  fontSize: 16,
  color: text_primary,
});

export const timeOffCard = style({
  padding: 12,
  backgroundColor: dark_bg,
  border: `1px solid ${text_secondary}`,
  borderRadius: '0.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.5rem',
  marginTop: 8,
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 16,
    },
  },
});

export const timeOffDate = style({
  fontWeight: 500,
  color: text_primary,
});

export const timeOffReason = style({
  fontSize: 15,
  color: text_secondary,
  marginTop: '0.25rem',
});

export const deleteTimeOffButton = style({
  padding: '0.375rem 0.75rem',
  backgroundColor: '#fecaca',
  color: '#dc2626',
  border: 'none',
  borderRadius: 4,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#fcb3b3',
  },
});
