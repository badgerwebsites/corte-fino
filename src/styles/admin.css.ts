import { style } from '@vanilla-extract/css';

const darker_bg = "#101214";
const dark_bg = "#222222";
const button =  "#96cfe0";
const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";
const border_subtle = "rgba(255,255,255,0.08)";
const border_hover = "rgba(255,255,255,0.18)";

export const container = style({
  minHeight: '100vh',
  backgroundColor: darker_bg,
  padding: 16,
  paddingTop: 68,
  paddingBottom: 100,
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 48,
      paddingTop: 84,
      paddingBottom: 100,
    },
  },
});

export const tabs = style({
  display: 'flex',
  gap: 4,
  marginBottom: 12,
  borderBottom: '2px solid #e5e5e5',
  overflowX: 'auto',
  '@media': {
    'screen and (min-width: 768px)': {
      gap: 16,
      marginBottom: 20,
    },
  },
});

export const tab = style({
  paddingTop: 12,
  paddingBottom: 8,
  background: 'none',
  border: 'none',
  color: text_primary,
  fontSize: 14,
  fontWeight: '400',
  cursor: 'pointer',
  borderBottom: '3px solid transparent',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '12px 24px',
      fontSize: 20,
    },
  },
  ':hover': {
    color: text_secondary,
  },
});

export const activeTab = style({
  color: button,
  fontWeight: 500,
  ':hover': {
    color: button,
  },
});

export const section = style({
  background: dark_bg,
  borderRadius: 8,
  padding: 12,
  border: `1px solid ${border_subtle}`,
  overflow: 'hidden',
  ":hover": {
    boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
    borderColor: border_hover,
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 24,
    },
  },
});

export const sectionHeader = style({
  marginBottom: 12,
  paddingTop: 12,
  '@media': {
    'screen and (min-width: 768px)': {
      paddingTop: 0,
    },
  },
});

export const sectionTitle = style({
  fontSize: 18,
  fontWeight: 500,
  color: text_primary,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 22,
    },
  },
});

export const sectionDescription = style({
  color: text_secondary,
  marginBottom: '1rem',
  fontSize: '0.875rem',
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: '1.5rem',
      fontSize: '1rem',
    },
  },
});

// pricing
export const serviceSection = style({
  marginBottom: 12,
  padding: 12,
  background: dark_bg,
  borderRadius: '0.5rem',
  border: `1px solid ${border_subtle}`,
  ":hover": {
    boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
    borderColor: border_hover,
  },
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: 20,
      padding: 20,
    },
  },
});

export const serviceSectionTitle = style({
  fontSize: 18,
  fontWeight: 600,
  color: text_primary,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 22,
    },
  },
});

export const adminDivider = style({
  marginTop: 24,
  borderTop: '2px solid #e2e8f0',
});

export const adminSplitLayout = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  '@media': {
    'screen and (min-width: 1024px)': {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 32,
    },
  },
});

export const adminLeftColumn = style({
  flex: 1,
});

export const adminRightColumn = style({
  flex: 1,
  borderTop: '2px solid #e2e8f0',
  '@media': {
    'screen and (min-width: 1024px)': {
      borderTop: 'none',
    },
  },
});

export const pricingGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  marginTop: 8,
  '@media': {
    'screen and (min-width: 768px)': {
      marginTop: 20,
      gap: 32,
      flexDirection: 'row',
    },
  },
});

export const pricingRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  padding: '0.75rem',
  background: dark_bg,
  borderRadius: '4px',
  border: '1px solid #e5e5e5',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 16,
      gap: '0.75rem',
    },
  },
});

export const barberNameCell = style({
  fontSize: 20,
  fontWeight: '500',
  color: text_primary,
});

export const barberTimeInfo = style({
  display: 'none',
});

export const priceInputWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const priceInputLabel = style({
  fontSize: 16,
  fontWeight: '500',
  color: text_primary,
  letterSpacing: '0.02em',
});

export const priceInputCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
});

export const priceInput = style({
  width: '70px',
  backgroundColor: darker_bg,
  color: text_primary,
  padding: '0.375rem 0.5rem',
  border: '1px solid #1a1a1a',
  letterSpacing: '0.05em',
  borderRadius: '4px',
  fontSize: 18,
  fontWeight: '500',
  textAlign: 'right',
  transition: 'border-color 0.2s',
  ':focus': {
    outline: 'none',
    border: '1px solid #96cfe0',
  },
  '::-webkit-inner-spin-button': {
    opacity: 1,
    filter: 'invert(1)',
  },
  '::-webkit-outer-spin-button': {
    opacity: 0.01,
  },
});

export const priceTimeHint = style({
  fontWeight: '400',
  color: text_secondary,
});

export const dollarSign = style({
  fontSize: 16,
  fontWeight: '400',
  color: text_secondary,
});

// Day-based pricing grid
export const dayPricingContainer = style({
  overflowX: 'auto',
  marginTop: 12,
  paddingBottom: 8,
});

export const dayPricingHeader = style({
  display: 'grid',
  gridTemplateColumns: '100px repeat(7, minmax(80px, 1fr))',
  gap: 4,
  marginBottom: 4,
  minWidth: 700,
});

export const dayPricingBarberHeader = style({
  fontSize: 14,
  fontWeight: '600',
  color: text_secondary,
  padding: '8px 4px',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
});

export const dayPricingDayHeader = style({
  textAlign: 'center',
  padding: '4px 2px',
  backgroundColor: darker_bg,
  borderRadius: 4,
});

export const dayPricingDayName = style({
  fontSize: 14,
  fontWeight: '600',
  color: text_primary,
  marginBottom: 4,
});

export const dayPricingPeriodLabels = style({
  display: 'flex',
  justifyContent: 'center',
  gap: 8,
});

export const dayPricingPeriodLabel = style({
  fontSize: 10,
  fontWeight: '500',
  color: text_secondary,
  textTransform: 'uppercase',
  width: 32,
  textAlign: 'center',
});

export const dayPricingRow = style({
  display: 'grid',
  gridTemplateColumns: '100px repeat(7, minmax(80px, 1fr))',
  gap: 4,
  marginBottom: 4,
  minWidth: 700,
});

export const dayPricingBarberName = style({
  fontSize: 14,
  fontWeight: '500',
  color: text_primary,
  padding: '8px 4px',
  display: 'flex',
  backgroundColor: darker_bg,
  borderRadius: 4,
  justifyContent: 'center',
  textAlign: 'center',
});

export const dayPricingCell = style({
  padding: '4px 2px',
  backgroundColor: darker_bg,
  borderRadius: 4,
  alignContent: 'center',
});

export const dayPricingInputGroup = style({
  display: 'flex',
  justifyContent: 'center',
  gap: 4,
});

export const dayPriceInput = style({
  width: 28,
  backgroundColor: dark_bg,
  color: text_primary,
  padding: '6px 2px',
  border: '1px solid #333',
  borderRadius: 4,
  fontSize: 13,
  fontWeight: '500',
  textAlign: 'center',
  transition: 'border-color 0.2s',
  ':focus': {
    outline: 'none',
    borderColor: button,
  },
  '::placeholder': {
    color: text_muted,
    fontSize: 11,
  },
  '::-webkit-inner-spin-button': {
    display: 'none',
  },
  '::-webkit-outer-spin-button': {
    display: 'none',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      width: 36,
    },
  },
});

// services
export const form = style({
  marginBottom: 8,
  marginTop: 8,
});

export const formGroup = style({
  marginBottom: 12,
});

export const formRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  marginBottom: 4,
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
    },
  },
});

export const label = style({
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
  color: text_secondary,
  fontSize: '0.875rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '1rem',
    },
  },
});

export const input = style({
  width: '100%',
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${text_muted}`,
  boxSizing: 'border-box',
  padding: '0.625rem',
  borderRadius: 8,
  fontSize: '0.875rem',
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
  '::-webkit-inner-spin-button': {
    opacity: 1,
    filter: 'invert(1)',
  },
  '::-webkit-outer-spin-button': {
    opacity: 0.01,
  },
});

export const textarea = style({
  width: '100%',
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${text_muted}`,
  boxSizing: 'border-box',
  padding: '0.625rem',
  borderRadius: 8,
  fontSize: '0.875rem',
  fontFamily: 'inherit',
  resize: 'vertical',
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

export const formActions = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 4,
  gap: 20,
});

export const submitButton = style({
  padding: '0.625rem 1.25rem',
  background: button,
  color: dark_bg,
  border: `1px solid ${border_subtle}`,
  borderRadius: 8,
  fontSize: 16,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 600,
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
    },
  },
  ':hover': {
    backgroundColor: '#7fbccd',
  },
});

export const cancelButton = style({
  padding: '0.625rem 1.25rem',
  backgroundColor: '#fecaca',
  color: '#dc2626',
  border: 'none',
  borderRadius: 8,
  fontSize: 16,
  cursor: 'pointer',
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 600,
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
    },
  },
  ':hover': {
    backgroundColor: '#fcb3b3',
  },
});

// export const barbersList = style({
//   // marginTop: 4,
// });

export const barberCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  background: darker_bg,
  borderRadius: '0.5rem',
  marginBottom: 12,
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem',
      borderRadius: '0.75rem',
    },
  },
});

export const barberInfo = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const barberName = style({
  fontSize: 18,
  fontWeight: 600,
  color: text_primary,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 20,
    },
  },
});

export const barberDetail = style({
  color: text_secondary,
  fontSize: '0.8125rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 14,
    },
  },
});

export const barberActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
});

export const editButton = style({
  padding: '0.5rem 0.875rem',
  background: 'transparent',
  color: '#0e7490',
  border: '1px solid #a5d8e6',
  borderRadius: 4,
  fontSize: 14,
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.625rem 1.25rem',
      fontSize: 16,
    },
  },
  ':hover': {
    background: dark_bg,
  },
});

export const deleteButton = style({
  padding: '0.5rem 0.875rem',
  background: 'transparent',
  color: '#b91c1c',
  border: '1px solid #e5a3a3',
  borderRadius: '4px',
  fontSize: 14,
  fontWeight: '500',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.625rem 1.25rem',
      fontSize: 16,
    },
  },
  ':hover': {
    background: dark_bg,
  },
});

// barbers
export const barberNameRow = style({
  display: 'flex',
  alignItems: 'center',
  // alignContent: 'center',
  gap: '0.75rem',
  flexWrap: 'wrap',
});

export const statusBadge = style({
  display: 'inline-block',
  padding: '0.2rem 0.6rem',
  background: button,
  color: darker_bg,
  borderRadius: 16,
  fontSize: 12,
  fontWeight: '500',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 14,
    },
  },
});

export const statusBadgeInactive = style({
  display: 'inline-block',
  padding: '0.2rem 0.6rem',
  background: text_muted,
  color: darker_bg,
  borderRadius: 16,
  fontSize: 12,
  fontWeight: '500',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 14,
    },
  },
});

export const toggleButton = style({
  padding: '0.5rem 0.875rem',
  background: 'transparent',
  color: text_secondary,
  border: '1px solid #b0b0b0',
  borderRadius: '4px',
  fontSize: '0.8125rem',
  fontWeight: '500',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.625rem 1.25rem',
      fontSize: '0.9375rem',
    },
  },
  ':hover': {
    background: dark_bg,
    color: text_primary,
  },
});

export const priceCard = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem',
  background: '#f7fafc',
  borderRadius: '0.75rem',
  marginBottom: '1rem',
});

export const serviceName = style({
  fontSize: '1.125rem',
  fontWeight: 'bold',
  color: '#1a202c',
  marginBottom: '0.25rem',
});

export const serviceDescription = style({
  color: '#718096',
  fontSize: '0.9rem',
  marginBottom: '0.25rem',
});

export const serviceDuration = style({
  color: '#a0aec0',
  fontSize: '0.875rem',
});

export const ruleName = style({
  fontSize: '1.125rem',
  fontWeight: 'bold',
  color: '#1a202c',
  marginBottom: '0.25rem',
});

export const ruleTime = style({
  color: '#718096',
  fontSize: '0.9rem',
});

export const priceControl = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

// Schedule manager styles
export const scheduleTimeRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginLeft: '0',
  marginTop: '0.75rem',
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      gap: '1rem',
      marginLeft: '2rem',
      marginTop: '0',
    },
  },
});

export const scheduleTimeInput = style({
  flex: 1,
  minWidth: 0,
  maxWidth: '140px',
  '@media': {
    'screen and (min-width: 768px)': {
      maxWidth: 'none',
    },
  },
});

export const scheduleDayCard = style({
  padding: '0.75rem',
  borderRadius: '0.5rem',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '1rem',
    },
  },
});

export const scheduleDayHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  '@media': {
    'screen and (min-width: 768px)': {
      gap: '1rem',
    },
  },
});

// Pricing Time Periods styles
export const pricingPeriodsTitle = style({
  display: 'block',
  fontSize: 16,
  fontWeight: '600',
  color: text_primary,
  marginBottom: 12,
  paddingTop: 8,
  '@media': {
    'screen and (min-width: 768px)': {
        paddingTop: 0,
        marginBottom: 16,
    },
  },
});

export const pricingTimeline = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: 12,
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: '0.75rem',
    },
  },
});

export const pricingTimeBlock = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const pricingTimeLabel = style({
  fontSize: 14,
  fontWeight: '500',
  color: text_secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
});

export const timeInput = style({
  width: '100%',
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${text_muted}`,
  boxSizing: 'border-box',
  padding: '0.625rem',
  borderRadius: 8,
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

export const pricingTimeArrow = style({
  display: 'none',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: text_secondary,
      fontSize: 20,
      paddingBottom: '0.5rem',
    },
  },
});

export const checkboxLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  cursor: 'pointer',
  // paddingTop: 16,
  marginBottom: 20,
  color: text_primary,
  fontSize: 18,
});

export const checkbox = style({
  transform: 'scale(1.3)',
  transformOrigin: 'left center',
  cursor: 'pointer',
  accentColor: button,
});

// Tab badge for notifications
export const tabBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '0.5rem',
  minWidth: '1.25rem',
  height: '1.25 rem',
  padding: '2px 8px',
  fontSize: 14,
  fontWeight: '600',
  backgroundColor: '#0ea5e9',
  color: text_primary,
  borderRadius: '9999px',
  lineHeight: 1.5,
});

// Rewards tab styles
export const verifyCodeForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginBottom: 16,
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
});

export const verifyCodeInput = style({
  flex: 1,
  padding: '0.75rem 1rem',
  fontSize: '1.25rem',
  fontWeight: '600',
  fontFamily: 'monospace',
  letterSpacing: '0.2em',
  textAlign: 'center',
  textTransform: 'uppercase',
  border: '2px solid #b0b0b0',
  borderRadius: '0.5rem',
  backgroundColor: darker_bg,
  color: text_primary,
  caretColor: text_primary,
  ':focus': {
    outline: 'none',
    border: '2px solid #7fbccd',
  },
  '::placeholder': {
    fontSize: '0.875rem',
    fontWeight: '400',
    color: text_secondary,
    letterSpacing: '0',
    textTransform: 'none',
  },
});

export const verifyCodeButton = style({
  padding: '14px 16px',
  whiteSpace: 'nowrap',
  background: 'transparent',
  color: button,
  border: `3px solid ${button}`,
  borderRadius: 8,
  fontSize: 16,
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  letterSpacing: '0.05em',
  ':hover': {
    backgroundColor: darker_bg,
  },
});

export const subsectionTitle = style({
  fontSize: 20,
  fontWeight: '600',
  color: text_primary,
});

export const redemptionsList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

export const redemptionCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  borderRadius: 8,
  border: `1px solid ${text_primary}`,
  marginTop: 12,
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
});

export const redemptionInfo = style({
  display: 'flex',
  flexDirection: 'column',
  // gap: '0.25rem',
  flex: 1,
});

export const redemptionCustomer = style({
  fontSize: 20,
  fontWeight: '600',
  color: text_primary,
});

export const redemptionReward = style({
  fontSize: 18,
  fontWeight: '500',
  color: '#0ea5e9',
});

export const redemptionPoints = style({
  fontSize: 16,
  color: text_secondary,
});

export const redemptionDate = style({
  fontSize: 14,
  color: text_secondary,
});

export const redemptionRightSide = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',

  '@media': {
    'screen and (min-width: 768px)': {
      alignItems: 'flex-end',
    },
  },
});

export const redemptionCodeDisplay = style({
  width: '80%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.625rem 1rem',
  backgroundColor: '#f0f9ff',
  border: '2px solid #0ea5e9',
  borderRadius: '0.375rem',
});

export const redemptionCode = style({
  fontSize: '1.125rem',
  fontWeight: '700',
  letterSpacing: '0.15em',
  color: '#0284c7',
  fontFamily: 'monospace',
});

export const redemptionActions = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '0.75rem',
  width: '100%',
});

export const confirmButton = style({
  padding: '0.5rem 1rem',
  fontSize: 16,
  fontWeight: '500',
  backgroundColor: 'transparent',
  color: button,
  border: `2px solid ${button}`,
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: darker_bg,
  },
});

export const rejectButton = style({
  padding: '0.5rem 1rem',
  fontSize: 16,
  fontWeight: '500',
  backgroundColor: 'transparent',
  color: '#ef4444',
  border: '2px solid #ef4444',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    borderColor: '#ef4444',
    color: '#ef4444',
    backgroundColor: darker_bg,
  },
});

// Rewards Management styles
export const rewardsBorder = style({
  marginTop: 24,
  paddingTop: 24,
  borderTop: '2px solid #e2e8f0',
});

export const selectWrapper = style({
  position: 'relative',
  width: '100%',
});

export const select = style({
  width: '100%',
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${text_muted}`,
  boxSizing: 'border-box',
  padding: '0.625rem',
  paddingRight: '2.5rem',
  borderRadius: 8,
  fontSize: '0.875rem',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  cursor: 'pointer',
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

export const selectIcon = style({
  position: 'absolute',
  right: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: text_primary,
});

// settings
export const logoGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1.5rem',
  marginTop: '1rem',
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem',
    },
  },
});

export const logoGridItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const logoLabel = style({
  fontSize: 16,
  fontWeight: 500,
  color: text_primary,
});
