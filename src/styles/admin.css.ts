import { style } from '@vanilla-extract/css';

export const container = style({
  minHeight: '100vh',
  backgroundColor: '#fafafa',
  padding: '1rem',
  paddingTop: 'calc(1rem + 60px)',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '2rem',
      paddingTop: 'calc(2rem + 60px)',
    },
  },
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
  gap: '1rem',
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: '2rem',
    },
  },
});

export const title = style({
  fontSize: '1.5rem',
  fontWeight: 300,
  color: '#1a1a1a',
  letterSpacing: '-0.01em',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '2rem',
    },
  },
});

export const backLink = style({
  color: '#1a1a1a',
  textDecoration: 'none',
  padding: '0.5rem 0.75rem',
  background: '#ffffff',
  border: '1px solid #e5e5e5',
  borderRadius: '2px',
  transition: 'all 0.2s',
  fontSize: '0.875rem',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
    },
  },
  ':hover': {
    borderColor: '#1a1a1a',
  },
});

export const tabs = style({
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '1.5rem',
  borderBottom: '2px solid #e5e5e5',
  overflowX: 'auto',
  '@media': {
    'screen and (min-width: 768px)': {
      gap: '1rem',
      marginBottom: '2rem',
    },
  },
});

export const tab = style({
  padding: '0.75rem 1rem',
  background: 'none',
  border: 'none',
  color: '#666',
  fontSize: '0.875rem',
  fontWeight: '400',
  cursor: 'pointer',
  borderBottom: '3px solid transparent',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '1rem 1.5rem',
      fontSize: '1rem',
    },
  },
  ':hover': {
    color: '#1a1a1a',
  },
});

export const activeTab = style({
  color: '#1a1a1a',
  borderBottomColor: '#1a1a1a',
  fontWeight: 500,
});

export const section = style({
  background: '#ffffff',
  borderRadius: '4px',
  padding: '1rem',
  border: '1px solid #e5e5e5',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '2rem',
    },
  },
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
  color: '#718096',
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

export const checkboxLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
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
      borderRadius: '0.5rem',
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
  marginBottom: '1rem',
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
});

export const barberName = style({
  fontSize: '1.125rem',
  fontWeight: 600,
  color: '#1a202c',
  marginBottom: '0.5rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '1.25rem',
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

export const statusBadge = style({
  display: 'inline-block',
  marginTop: '0.5rem',
  padding: '0.25rem 0.75rem',
  background: '#c6f6d5',
  color: '#22543d',
  borderRadius: '1rem',
  fontSize: '0.875rem',
  fontWeight: '600',
});

export const barberActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
});

export const editButton = style({
  padding: '0.5rem 0.875rem',
  background: '#1a1a1a',
  color: '#ffffff',
  border: 'none',
  borderRadius: '2px',
  fontSize: '0.8125rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
    },
  },
  ':hover': {
    background: '#333',
  },
});

export const toggleButton = style({
  padding: '0.5rem 0.875rem',
  background: '#ecc94b',
  color: '#744210',
  border: 'none',
  borderRadius: '2px',
  fontSize: '0.8125rem',
  fontWeight: '500',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
    },
  },
  ':hover': {
    background: '#d69e2e',
  },
});

export const deleteButton = style({
  padding: '0.5rem 0.875rem',
  background: '#fc8181',
  color: '#742a2a',
  border: 'none',
  borderRadius: '2px',
  fontSize: '0.8125rem',
  fontWeight: '500',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
    },
  },
  ':hover': {
    background: '#f56565',
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

export const priceLabel = style({
  fontWeight: '600',
  color: '#2d3748',
});

export const priceInput = style({
  width: '120px',
  padding: '0.5rem',
  border: '2px solid #cbd5e0',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  fontWeight: '600',
  textAlign: 'right',
  ':focus': {
    outline: 'none',
    borderColor: '#667eea',
  },
});

export const serviceSection = style({
  marginBottom: '1.5rem',
  padding: '1rem',
  background: '#f7fafc',
  borderRadius: '0.5rem',
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: '2rem',
      padding: '1.5rem',
      borderRadius: '0.75rem',
    },
  },
});

export const serviceSectionTitle = style({
  fontSize: '1.125rem',
  fontWeight: 600,
  color: '#1a202c',
  marginBottom: '1rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '1.25rem',
    },
  },
});

export const pricingGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const pricingHeader = style({
  display: 'none',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '1rem',
      padding: '0.75rem 1rem',
      background: '#e2e8f0',
      borderRadius: '0.5rem',
      fontWeight: '600',
    },
  },
});

export const pricingHeaderCell = style({
  color: '#2d3748',
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const pricingRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  padding: '1rem',
  background: 'white',
  borderRadius: '0.5rem',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '1rem',
      padding: '0.75rem 1rem',
      alignItems: 'center',
    },
  },
});

export const barberNameCell = style({
  fontSize: '1rem',
  fontWeight: '500',
  color: '#1a202c',
});

export const barberTimeInfo = style({
  fontSize: '0.75rem',
  color: '#718096',
  marginTop: '0.25rem',
});

export const priceInputCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const dollarSign = style({
  fontSize: '1rem',
  fontWeight: '600',
  color: '#4a5568',
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
