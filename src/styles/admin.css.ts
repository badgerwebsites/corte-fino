import { style } from '@vanilla-extract/css';

const darker_bg = "#101214";
const dark_bg = "#222222";
const button =  "#96cfe0";
const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";

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

// export const header = style({
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginBottom: '1.5rem',
//   flexWrap: 'wrap',
//   gap: '1rem',
//   '@media': {
//     'screen and (min-width: 768px)': {
//       marginBottom: '2rem',
//     },
//   },
// });

// export const title = style({
//   fontSize: '1.5rem',
//   fontWeight: 300,
//   color: '#1a1a1a',
//   letterSpacing: '-0.01em',
//   '@media': {
//     'screen and (min-width: 768px)': {
//       fontSize: '2rem',
//     },
//   },
// });

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
  // borderBottomColor: '#1a1a1a',
  fontWeight: 500,
  ':hover': {
    color: button,
  },
});

export const section = style({
  background: '#fff',
  borderRadius: '4px',
  padding: 24,
  border: '1px solid #e5e5e5',
  overflow: 'hidden',
});

export const sectionHeader = style({
  marginBottom: '1rem',
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: '1.5rem',
    },
  },
});

export const sectionTitle = style({
  fontSize: '1.25rem',
  fontWeight: 500,
  color: '#1a202c',
  marginBottom: '0.5rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '1.5rem',
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

export const form = style({
  marginBottom: '1.5rem',
  paddingBottom: '1.5rem',
  borderBottom: '2px solid #e2e8f0',
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: '2rem',
      paddingBottom: '2rem',
    },
  },
});

export const formGroup = style({
  marginBottom: '1rem',
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: '1.5rem',
    },
  },
});

export const formRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1rem',
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
});

export const label = style({
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
  color: '#2d3748',
  fontSize: '0.875rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '1rem',
    },
  },
});

export const input = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.625rem',
  border: '2px solid #e2e8f0',
  borderRadius: '0.25rem',
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
    borderColor: '#1a1a1a',
  },
});

export const textarea = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.625rem',
  border: '2px solid #e2e8f0',
  borderRadius: '0.25rem',
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
    borderColor: '#1a1a1a',
  },
});

export const formActions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      gap: '1rem',
    },
  },
});

export const submitButton = style({
  padding: '0.625rem 1.25rem',
  background: '#1a1a1a',
  color: '#ffffff',
  border: 'none',
  borderRadius: '2px',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  letterSpacing: '0.05em',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
    },
  },
  ':hover': {
    background: '#333',
  },
  ':active': {
    transform: 'scale(0.98)',
  },
});

export const cancelButton = style({
  padding: '0.625rem 1.25rem',
  background: '#718096',
  color: 'white',
  border: 'none',
  borderRadius: '2px',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
    },
  },
  ':hover': {
    background: '#4a5568',
  },
});

export const barbersList = style({
  marginTop: '2rem',
});

export const barberCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  background: '#f7fafc',
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
  color: '#1a202c',
  marginBottom: '0.5rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 20,
    },
  },
});

export const barberDetail = style({
  color: '#4a5568',
  fontSize: '0.8125rem',
  marginBottom: '0.25rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '0.9rem',
    },
  },
});

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

export const barberActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
});

export const editButton = style({
  padding: '0.5rem 0.875rem',
  background: 'transparent',
  color: '#0e7490',
  border: '1px solid #a5d8e6',
  borderRadius: '4px',
  fontSize: '0.8125rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.625rem 1.25rem',
      fontSize: '0.9375rem',
    },
  },
  ':hover': {
    background: '#c6ecf4',
    borderColor: '#c6ecf4',
    color: '#1a1a1a',
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

export const deleteButton = style({
  padding: '0.5rem 0.875rem',
  background: 'transparent',
  color: '#b91c1c',
  border: '1px solid #e5a3a3',
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
    background: '#fef2f2',
    borderColor: '#d4a3a3',
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

export const priceInput = style({
  width: '70px',
  padding: '0.375rem 0.5rem',
  border: '1px solid #e5e5e5',
  borderRadius: '4px',
  fontSize: '0.9rem',
  fontWeight: '500',
  textAlign: 'right',
  transition: 'border-color 0.2s',
  ':focus': {
    outline: 'none',
    borderColor: '#1a1a1a',
  },
});

export const serviceSection = style({
  marginBottom: '1rem',
  padding: '0.75rem',
  background: '#fafafa',
  borderRadius: '0.5rem',
  border: '1px solid #e5e5e5',
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: '1.25rem',
      padding: '1rem',
    },
  },
});

export const serviceSectionTitle = style({
  fontSize: '1rem',
  fontWeight: 600,
  color: '#1a1a1a',
  marginBottom: '0.75rem',
  paddingBottom: '0.5rem',
  borderBottom: '1px solid #e5e5e5',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '1.1rem',
    },
  },
});

export const pricingGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const pricingRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  padding: '0.75rem',
  background: 'white',
  borderRadius: '4px',
  border: '1px solid #e5e5e5',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '1rem',
      gap: '0.75rem',
    },
  },
});

export const barberNameCell = style({
  fontSize: '0.9rem',
  fontWeight: '500',
  color: '#1a1a1a',
});

export const barberTimeInfo = style({
  display: 'none',
});

export const priceInputCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const priceInputWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const priceInputLabel = style({
  fontSize: '0.7rem',
  fontWeight: '500',
  color: '#1a1a1a',
  letterSpacing: '0.02em',
});

export const priceTimeHint = style({
  fontWeight: '400',
  color: '#999',
});

export const dollarSign = style({
  fontSize: '0.85rem',
  fontWeight: '500',
  color: '#666',
});

export const timeSettingsGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
  marginTop: '1.5rem',
});

export const timeSettingCard = style({
  padding: '1.5rem',
  background: '#f7fafc',
  borderRadius: '0.75rem',
  border: '2px solid #e2e8f0',
});

export const timeSettingTitle = style({
  fontSize: '1.125rem',
  fontWeight: 'bold',
  color: '#1a202c',
  marginBottom: '1rem',
});

export const timeInputRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
});

export const timeInputGroup = style({
  display: 'flex',
  flexDirection: 'column',
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
  paddingTop: 16,
  paddingBottom: 8,
  color: text_primary,
  fontSize: 16,
  '@media': {
    'screen and (min-width: 768px)': {
      paddingBottom: 0,
      paddingTop: 20,
    },
  },
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
  height: '1.25rem',
  padding: '0 0.375rem',
  fontSize: '0.7rem',
  fontWeight: '600',
  backgroundColor: '#0ea5e9',
  color: '#ffffff',
  borderRadius: '9999px',
});

// Rewards tab styles
export const verifyCodeSection = style({
  marginBottom: '2rem',
  padding: '1.5rem',
  backgroundColor: '#f0f9ff',
  borderRadius: '0.5rem',
  border: '1px solid #bae6fd',
});

export const verifyCodeForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
});

export const verifyCodeInput = style({
  flex: 1,
  maxWidth: '200px',
  padding: '0.75rem 1rem',
  fontSize: '1.25rem',
  fontWeight: '600',
  fontFamily: 'monospace',
  letterSpacing: '0.2em',
  textAlign: 'center',
  textTransform: 'uppercase',
  border: '2px solid #0ea5e9',
  borderRadius: '0.5rem',
  backgroundColor: '#ffffff',
  ':focus': {
    outline: 'none',
    borderColor: '#0369a1',
  },
  '::placeholder': {
    fontSize: '0.875rem',
    fontWeight: '400',
    letterSpacing: '0',
    textTransform: 'none',
  },
});

export const verifyCodeButton = style({
  padding: '0.75rem 1.5rem',
  fontSize: '0.9375rem',
  fontWeight: '500',
  backgroundColor: '#0ea5e9',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
  ':hover': {
    backgroundColor: '#0284c7',
  },
});

export const pendingRedemptionsSection = style({
  marginTop: '1.5rem',
});

export const subsectionTitle = style({
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1a1a1a',
  marginBottom: '1rem',
});

export const emptyState = style({
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  borderRadius: '0.5rem',
  border: '1px solid #e2e8f0',
});

export const emptyStateText = style({
  fontSize: '0.9375rem',
  color: '#64748b',
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
  backgroundColor: '#ffffff',
  borderRadius: '0.5rem',
  border: '1px solid #e2e8f0',
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem',
    },
  },
});

export const redemptionInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  flex: 1,
});

export const redemptionCustomer = style({
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1a1a1a',
});

export const redemptionReward = style({
  fontSize: '0.9375rem',
  fontWeight: '500',
  color: '#0369a1',
});

export const redemptionPoints = style({
  fontSize: '0.8125rem',
  color: '#64748b',
});

export const redemptionDate = style({
  fontSize: '0.75rem',
  color: '#94a3b8',
});

export const redemptionCodeDisplay = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.625rem 1rem',
  backgroundColor: '#f0f9ff',
  border: '1px solid #0ea5e9',
  borderRadius: '0.375rem',
});

export const redemptionCode = style({
  fontSize: '1.125rem',
  fontWeight: '700',
  letterSpacing: '0.15em',
  color: '#0369a1',
  fontFamily: 'monospace',
});

export const redemptionActions = style({
  display: 'flex',
  gap: '0.5rem',
});

export const confirmButton = style({
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  backgroundColor: '#10b981',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#059669',
  },
});

export const rejectButton = style({
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  backgroundColor: 'transparent',
  color: '#64748b',
  border: '1px solid #e2e8f0',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    borderColor: '#ef4444',
    color: '#ef4444',
  },
});

// Rewards Management styles
export const rewardsManagementSection = style({
  marginTop: '2.5rem',
  paddingTop: '2rem',
  borderTop: '2px solid #e2e8f0',
});

export const select = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.625rem',
  border: '2px solid #e2e8f0',
  borderRadius: '0.25rem',
  fontSize: '0.875rem',
  backgroundColor: '#ffffff',
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
    borderColor: '#1a1a1a',
  },
});

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
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#4a5568',
});
