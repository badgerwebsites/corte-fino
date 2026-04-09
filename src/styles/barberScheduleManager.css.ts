// styles/barberScheduleManager.css.ts
import { style } from '@vanilla-extract/css';
import { darker_bg, dark_bg, button, accent, text_primary, text_secondary, text_muted, border_hover, border_subtle } from './globalStyles.css';

export const headerTitle = style({
  fontSize: 20,
  fontWeight: 500,
  color: text_primary,
  marginBottom: 12,
});

export const scheduleToggleChevron = style({
  transition: 'transform 0.2s ease',
});

export const scheduleList = style({
  display: 'flex',
  flexDirection: 'column',
  // paddingTop: 8,
  marginBottom: 20,
  gap: 12,
});

export const dayCard = style({
  backgroundColor: dark_bg,
  border: `2px solid ${border_subtle}`,
  borderRadius: '0.75rem',
  padding: '1rem',
  transition: 'all 0.2s',
});

export const dayCardActive = style({
  backgroundColor: darker_bg,
  borderColor: border_hover,
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
  width: 20,
  height: 20,
  cursor: 'pointer',
  accentColor: accent,
});

export const dayLabel = style({
  fontSize: 20,
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
  fontSize: 15,
  fontWeight: 600,
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
  maxWidth: 480,
  margin: '0 auto',
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
  width: '100%',
  minWidth: 0,
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${text_secondary}`,
  boxSizing: 'border-box',
  padding: '12px 8px',
  borderRadius: 8,
  fontSize: 16,
  fontFamily: 'inherit',
  colorScheme: 'dark',
  cursor: 'pointer',
  position: 'relative',
  ':focus': {
    outline: 'none',
    border: `1px solid ${text_secondary}`,
  },
  selectors: {
    '&::-webkit-calendar-picker-indicator': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer',
    },
  },
});

export const centerButton = style({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 8,
});

export const breaksCard = style({
  marginTop: 12,
  marginBottom: 12,
});

export const breaksHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 16,
  marginBottom: 16,
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
  fontWeight: 600,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#fcb3b3',
  },
});

export const breakRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
  maxWidth: 480,
  margin: '0 auto',
});

export const breakInputGroup = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  gap: 4,
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
});

export const breakInput = style({
  width: '100%',
  minWidth: 0,
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${text_secondary}`,
  boxSizing: 'border-box',
  padding: '12px 8px',
  borderRadius: 8,
  fontSize: 16,
  fontFamily: 'inherit',
  colorScheme: 'dark',
  cursor: 'pointer',
  position: 'relative',
  ':focus': {
    outline: 'none',
    border: `1px solid ${text_secondary}`,
  },
  selectors: {
    '&::-webkit-calendar-picker-indicator': {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer',
    },
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
  marginTop: 16,
  borderRadius: '0.375rem',
  fontSize: 16,
  color: text_primary,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 18,
    },
  },
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
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#fcb3b3',
  },
});
