import { style, keyframes } from '@vanilla-extract/css';

const darker_bg = "#101214";
const dark_bg = "#222222";
const button = "#96cfe0";
const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";
const border_subtle = "rgba(255,255,255,0.08)";

// Modal overlay and container
export const modalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: 16,
});

export const modalContainer = style({
  backgroundColor: dark_bg,
  borderRadius: 12,
  width: '100%',
  maxWidth: 600,
  maxHeight: '90vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${border_subtle}`,
  '@media': {
    'screen and (min-width: 768px)': {
      maxWidth: 700,
    },
  },
});

export const modalHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px',
  borderBottom: `1px solid ${border_subtle}`,
});

export const modalTitle = style({
  fontSize: 18,
  fontWeight: 600,
  color: text_primary,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 20,
    },
  },
});

export const modalCloseButton = style({
  background: 'transparent',
  border: 'none',
  color: text_muted,
  fontSize: 24,
  cursor: 'pointer',
  padding: 4,
  lineHeight: 1,
  transition: 'color 0.2s',
  ':hover': {
    color: text_primary,
  },
});

export const modalBody = style({
  padding: 20,
  overflowY: 'auto',
  flex: 1,
});

export const modalFooter = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 12,
  padding: '16px 20px',
  borderTop: `1px solid ${border_subtle}`,
});

// Form sections
export const formSection = style({
  marginBottom: 20,
});

export const formSectionTitle = style({
  fontSize: 12,
  fontWeight: 600,
  color: text_muted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 10,
});

// Customer search
export const searchContainer = style({
  position: 'relative',
});

export const searchInput = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  fontSize: 15,
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${border_subtle}`,
  borderRadius: 8,
  outline: 'none',
  transition: 'border-color 0.2s',
  ':focus': {
    borderColor: button,
  },
  '::placeholder': {
    color: text_muted,
  },
});

export const searchDropdown = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: darker_bg,
  border: `1px solid ${border_subtle}`,
  borderRadius: 8,
  marginTop: 4,
  maxHeight: 240,
  overflowY: 'auto',
  zIndex: 10,
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
});

export const searchResultItem = style({
  padding: '12px 14px',
  cursor: 'pointer',
  borderBottom: `1px solid ${border_subtle}`,
  transition: 'background-color 0.15s',
  ':hover': {
    backgroundColor: dark_bg,
  },
  ':last-child': {
    borderBottom: 'none',
  },
});

export const searchResultName = style({
  fontSize: 15,
  fontWeight: 500,
  color: text_primary,
  marginBottom: 2,
});

export const searchResultDetail = style({
  fontSize: 13,
  color: text_secondary,
});

export const searchLoading = style({
  padding: '16px 14px',
  textAlign: 'center',
  color: text_muted,
  fontSize: 14,
});

export const searchNoResults = style({
  padding: '16px 14px',
  textAlign: 'center',
  color: text_muted,
  fontSize: 14,
});

export const selectedCustomer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 14px',
  backgroundColor: darker_bg,
  borderRadius: 8,
  border: `1px solid ${button}`,
});

export const selectedCustomerInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const selectedCustomerName = style({
  fontSize: 15,
  fontWeight: 500,
  color: text_primary,
});

export const selectedCustomerDetail = style({
  fontSize: 13,
  color: text_secondary,
});

export const clearButton = style({
  background: 'transparent',
  border: 'none',
  color: text_muted,
  fontSize: 18,
  cursor: 'pointer',
  padding: 4,
  transition: 'color 0.2s',
  ':hover': {
    color: '#ef4444',
  },
});

// Dropdowns
export const selectInput = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  fontSize: 15,
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${border_subtle}`,
  borderRadius: 8,
  outline: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  ':focus': {
    borderColor: button,
  },
});

// Two-column layout
export const twoColumnGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 16,
  '@media': {
    'screen and (min-width: 480px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
});

// Date and time selection
export const dateTimeSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  '@media': {
    'screen and (min-width: 600px)': {
      flexDirection: 'row',
    },
  },
});

export const datePickerWrapper = style({
  flex: '0 0 auto',
});

export const timeSlotWrapper = style({
  flex: 1,
  minWidth: 0,
});

export const timeSlotLabel = style({
  fontSize: 14,
  fontWeight: 500,
  color: text_secondary,
  marginBottom: 8,
});

export const timeSlotGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 8,
  maxHeight: 200,
  overflowY: 'auto',
  '@media': {
    'screen and (min-width: 480px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
});

export const timeSlotButton = style({
  padding: '8px 4px',
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: darker_bg,
  color: text_secondary,
  border: `1px solid ${border_subtle}`,
  borderRadius: 6,
  cursor: 'pointer',
  transition: 'all 0.15s',
  ':hover': {
    borderColor: button,
    color: text_primary,
  },
});

export const timeSlotButtonActive = style({
  backgroundColor: button,
  color: darker_bg,
  borderColor: button,
  ':hover': {
    backgroundColor: '#7fbccd',
    color: darker_bg,
  },
});

export const noTimeSlotsMessage = style({
  padding: 16,
  textAlign: 'center',
  color: text_muted,
  fontSize: 14,
});

// Recurring section
export const recurrenceSection = style({
  padding: 16,
  backgroundColor: darker_bg,
  borderRadius: 8,
  border: `1px solid ${border_subtle}`,
});

export const recurrenceToggle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
});

export const recurrenceCheckbox = style({
  width: 18,
  height: 18,
  cursor: 'pointer',
  accentColor: button,
});

export const recurrenceLabel = style({
  fontSize: 15,
  fontWeight: 500,
  color: text_primary,
});

export const recurrenceOptions = style({
  marginTop: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const recurrenceRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  '@media': {
    'screen and (min-width: 480px)': {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
});

export const recurrenceInputLabel = style({
  fontSize: 14,
  color: text_secondary,
  minWidth: 80,
});

export const recurrenceSelect = style({
  flex: 1,
  padding: '10px 12px',
  fontSize: 14,
  backgroundColor: dark_bg,
  color: text_primary,
  border: `1px solid ${border_subtle}`,
  borderRadius: 6,
  outline: 'none',
  cursor: 'pointer',
  ':focus': {
    borderColor: button,
  },
});

export const recurrenceCountInput = style({
  width: 70,
  padding: '10px 12px',
  fontSize: 14,
  backgroundColor: dark_bg,
  color: text_primary,
  border: `1px solid ${border_subtle}`,
  borderRadius: 6,
  outline: 'none',
  textAlign: 'center',
  ':focus': {
    borderColor: button,
  },
  '::-webkit-inner-spin-button': {
    opacity: 1,
    filter: 'invert(1)',
  },
});

// Preview list
export const previewSection = style({
  marginTop: 16,
});

export const previewTitle = style({
  fontSize: 13,
  fontWeight: 500,
  color: text_secondary,
  marginBottom: 8,
});

export const previewList = style({
  maxHeight: 160,
  overflowY: 'auto',
  backgroundColor: dark_bg,
  borderRadius: 6,
  padding: '8px 0',
});

export const previewItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 12px',
  fontSize: 13,
});

export const previewItemAvailable = style({
  color: text_primary,
});

export const previewItemConflict = style({
  color: '#f87171',
});

export const previewIcon = style({
  fontSize: 14,
});

export const previewDate = style({
  flex: 1,
});

export const previewReason = style({
  fontSize: 12,
  color: text_muted,
  fontStyle: 'italic',
});

// Summary section
export const summarySection = style({
  padding: 16,
  backgroundColor: darker_bg,
  borderRadius: 8,
  border: `1px solid ${border_subtle}`,
});

export const summaryRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
  ':last-child': {
    marginBottom: 0,
  },
});

export const summaryLabel = style({
  fontSize: 14,
  color: text_secondary,
});

export const summaryValue = style({
  fontSize: 14,
  fontWeight: 500,
  color: text_primary,
});

export const summaryTotal = style({
  fontSize: 18,
  fontWeight: 600,
  color: button,
});

export const summaryWarning = style({
  fontSize: 13,
  color: '#fbbf24',
  marginTop: 8,
});

// Buttons
export const primaryButton = style({
  padding: '12px 24px',
  fontSize: 15,
  fontWeight: 600,
  backgroundColor: button,
  color: darker_bg,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#7fbccd',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const secondaryButton = style({
  padding: '12px 24px',
  fontSize: 15,
  fontWeight: 500,
  backgroundColor: 'transparent',
  color: text_secondary,
  border: `1px solid ${border_subtle}`,
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    borderColor: text_muted,
    color: text_primary,
  },
});

// Loading spinner
const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const spinner = style({
  width: 16,
  height: 16,
  border: '2px solid transparent',
  borderTopColor: darker_bg,
  borderRadius: '50%',
  animation: `${spin} 0.8s linear infinite`,
  display: 'inline-block',
  marginRight: 8,
});

// Book Appointment button for calendar header
export const bookAppointmentButton = style({
  padding: '10px 16px',
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: button,
  color: darker_bg,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  ':hover': {
    backgroundColor: '#7fbccd',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '12px 20px',
      fontSize: 15,
    },
  },
});

export const plusIcon = style({
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1,
});
