import { style } from '@vanilla-extract/css';

const darker_bg = "#101214";
const dark_bg = "#222222";
const button =  "#96cfe0";
const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";
const border_subtle = "rgba(255,255,255,0.08)";
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
  color: '#1a1a1a',
  border: 'none',
  borderRadius: 6,
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
//   padding: '1rem',
//   backgroundColor: darker_bg,
//   borderRadius: '0.5rem',
//   border: `1px solid ${border_subtle}`,
});

export const breaksHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 12,
  marginBottom: 4,
});

export const breaksLabel = style({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#92400e',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const addBreakButton = style({
  padding: '0.25rem 0.5rem',
  backgroundColor: '#f59e0b',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.25rem',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
});

export const breakRow = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto 1fr auto', // 📱 mobile (stack-friendly)
  gap: '0.5rem',
  alignItems: 'center',

  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'auto auto auto auto auto', // 🖥️ web (tight)
    },
  },
});

export const breakInput = style({
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
  '::placeholder': {
    color: text_muted,
  },
});

export const breakSeparator = style({
  textAlign: 'center',
  color: text_secondary,
  fontStyle: 'bold',
  fontSize: 12,
});

export const removeBreakButton = style({
  padding: '0.375rem',
//   backgroundColor: ,
  color: '#b91c1c',
  border: 'none',
  borderRadius: '0.25rem',
  cursor: 'pointer',
  fontSize: '0.75rem',
  fontWeight: 600,
});

export const scheduleSummary = style({
  padding: '0.75rem',
  backgroundColor: '#f3f4f6',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  color: '#4b5563',
});


export const timeOffCard = style({
  padding: '0.75rem 1rem',
  backgroundColor: dark_bg,
  border: `1px solid ${border_subtle}`,
  borderRadius: '0.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.5rem',
});

export const timeOffDate = style({
  fontWeight: 500,
  color: '#92400e',
});

export const timeOffReason = style({
  fontSize: '0.875rem',
  color: '#a16207',
  marginTop: '0.25rem',
});

export const deleteTimeOffButton = style({
  padding: '0.375rem 0.75rem',
  backgroundColor: '#e5a3a3',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.375rem',
  fontSize: '0.75rem',
  fontWeight: 500,
  cursor: 'pointer',
});
