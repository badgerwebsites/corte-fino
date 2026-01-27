import { style } from '@vanilla-extract/css';

export const container = style({
  backgroundColor: '#ffffff',
  borderRadius: '0.5rem',
  border: '1px solid #e2e8f0',
  overflow: 'hidden',
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem',
    },
  },
});

export const navigation = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

export const navButton = style({
  padding: '0.5rem 0.75rem',
  fontSize: '1rem',
  backgroundColor: '#ffffff',
  color: '#1a1a1a',
  border: '1px solid #e2e8f0',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
});

export const todayButton = style({
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#333',
  },
});

export const backButton = style({
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: '1px solid #e2e8f0',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  marginRight: '0.5rem',
  ':hover': {
    backgroundColor: '#e2e8f0',
    color: '#1a1a1a',
  },
});

export const dateTitle = style({
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#1a1a1a',
  textAlign: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '1.25rem',
    },
  },
});

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flexWrap: 'wrap',
});

export const barberFilter = style({
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  border: '1px solid #e2e8f0',
  borderRadius: '0.375rem',
  backgroundColor: '#ffffff',
  minWidth: '140px',
  cursor: 'pointer',
  ':focus': {
    outline: 'none',
    borderColor: '#0ea5e9',
  },
});

export const viewToggle = style({
  display: 'flex',
  borderRadius: '0.375rem',
  overflow: 'hidden',
  border: '1px solid #e2e8f0',
});

export const viewButton = style({
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  backgroundColor: '#ffffff',
  color: '#64748b',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#f1f5f9',
  },
});

export const viewButtonActive = style({
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  ':hover': {
    backgroundColor: '#333',
  },
});

export const loadingContainer = style({
  padding: '3rem',
  textAlign: 'center',
  color: '#64748b',
});

export const emptyState = style({
  padding: '3rem 1.5rem',
  textAlign: 'center',
  backgroundColor: '#f8fafc',
});

export const emptyStateText = style({
  fontSize: '0.9375rem',
  color: '#64748b',
});

// Day View Styles
export const dayView = style({
  padding: '1rem',
});

export const timeGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const timeRow = style({
  display: 'flex',
  minHeight: '60px',
  borderBottom: '1px solid #f1f5f9',
});

export const timeLabel = style({
  width: '80px',
  flexShrink: 0,
  padding: '0.5rem',
  fontSize: '0.75rem',
  fontWeight: '500',
  color: '#64748b',
  textAlign: 'right',
  paddingRight: '1rem',
});

export const appointmentsColumn = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: '0.25rem 0',
});

export const appointmentCard = style({
  padding: '0.75rem',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  border: '1px solid transparent',
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
});

export const appointmentTime = style({
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#1a1a1a',
  marginBottom: '0.25rem',
});

export const appointmentCustomer = style({
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#1a1a1a',
});

export const appointmentService = style({
  fontSize: '0.8125rem',
  color: '#475569',
});

export const appointmentBarber = style({
  fontSize: '0.75rem',
  color: '#64748b',
  marginTop: '0.25rem',
});

// Week View Styles
export const weekView = style({
  overflow: 'auto',
});

export const weekHeader = style({
  display: 'grid',
  gridTemplateColumns: '50px repeat(7, 1fr)',
  borderBottom: '1px solid #e2e8f0',
  position: 'sticky',
  top: 0,
  backgroundColor: '#ffffff',
  zIndex: 10,
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: '70px repeat(7, 1fr)',
    },
  },
});

export const timeColumnHeader = style({
  borderRight: '1px solid #f1f5f9',
  backgroundColor: '#f8fafc',
});

export const weekDayHeader = style({
  padding: '0.5rem 0.25rem',
  textAlign: 'center',
  borderRight: '1px solid #f1f5f9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  ':last-child': {
    borderRight: 'none',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.75rem 0.5rem',
    },
  },
});

export const todayHeader = style({
  backgroundColor: '#f0f9ff',
});

export const weekDayName = style({
  fontSize: '0.75rem',
  fontWeight: '500',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

// Short day name (S, M, T, W...) - shown on mobile
export const weekDayNameShort = style({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#64748b',
  textTransform: 'uppercase',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
});

// Full day name (Sun, Mon, Tue...) - shown on desktop
export const weekDayNameFull = style({
  display: 'none',
  fontSize: '0.75rem',
  fontWeight: '500',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
});

export const weekDayDate = style({
  fontSize: '1rem',
  fontWeight: '600',
  color: '#1a1a1a',
  marginTop: '0.125rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '1.25rem',
      marginTop: '0.25rem',
    },
  },
});

export const weekTimeGrid = style({
  display: 'flex',
  flexDirection: 'column',
});

export const weekTimeRow = style({
  display: 'grid',
  gridTemplateColumns: '50px repeat(7, 1fr)',
  minHeight: '50px',
  borderBottom: '1px solid #f1f5f9',
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: '70px repeat(7, 1fr)',
      minHeight: '60px',
    },
  },
});

export const weekTimeLabel = style({
  padding: '0.25rem',
  fontSize: '0.625rem',
  fontWeight: '500',
  color: '#64748b',
  textAlign: 'right',
  paddingRight: '0.375rem',
  borderRight: '1px solid #f1f5f9',
  backgroundColor: '#f8fafc',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.5rem',
      fontSize: '0.75rem',
      paddingRight: '0.75rem',
    },
  },
});

export const weekTimeCell = style({
  padding: '0.25rem',
  borderRight: '1px solid #f1f5f9',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  ':last-child': {
    borderRight: 'none',
  },
});

export const todayCell = style({
  backgroundColor: '#f0f9ff',
});

export const weekBody = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  minHeight: '400px',
});

export const weekDayColumn = style({
  padding: '0.5rem',
  borderRight: '1px solid #f1f5f9',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  ':last-child': {
    borderRight: 'none',
  },
});

export const todayColumn = style({
  backgroundColor: '#f0f9ff',
});

export const noAppointments = style({
  fontSize: '0.875rem',
  color: '#cbd5e1',
  textAlign: 'center',
  padding: '1rem 0',
});

export const weekAppointment = style({
  padding: '0.125rem 0.25rem',
  borderRadius: '0.125rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  overflow: 'hidden',
  ':hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.25rem 0.375rem',
      borderRadius: '0.25rem',
    },
  },
});

export const weekAppointmentName = style({
  fontSize: '0.625rem',
  fontWeight: '600',
  color: '#1a1a1a',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: '1.2',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '0.75rem',
    },
  },
});

export const weekAppointmentTime = style({
  fontSize: '0.6875rem',
  fontWeight: '600',
  color: '#1a1a1a',
});

export const weekAppointmentCustomer = style({
  fontSize: '0.75rem',
  color: '#475569',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

// Status Colors
export const statusPending = style({
  backgroundColor: '#fef3c7',
  borderColor: '#fcd34d',
});

export const statusConfirmed = style({
  backgroundColor: '#dbeafe',
  borderColor: '#93c5fd',
});

export const statusCompleted = style({
  backgroundColor: '#dcfce7',
  borderColor: '#86efac',
});

export const statusCancelled = style({
  backgroundColor: '#fee2e2',
  borderColor: '#fca5a5',
});

export const statusNoShow = style({
  backgroundColor: '#f1f5f9',
  borderColor: '#cbd5e1',
});

// Modal Styles
export const modal = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '1rem',
});

export const modalContent = style({
  backgroundColor: '#ffffff',
  borderRadius: '0.5rem',
  maxWidth: '500px',
  width: '100%',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
});

export const modalHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.25rem',
  borderBottom: '1px solid #e2e8f0',
});

export const modalTitle = style({
  fontSize: '1.25rem',
  fontWeight: '600',
  color: '#1a1a1a',
});

export const closeButton = style({
  padding: '0.25rem 0.5rem',
  fontSize: '1.5rem',
  lineHeight: 1,
  backgroundColor: 'transparent',
  color: '#64748b',
  border: 'none',
  borderRadius: '0.25rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#f1f5f9',
    color: '#1a1a1a',
  },
});

export const modalBody = style({
  padding: '1.25rem',
});

export const detailRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '0.75rem 0',
  borderBottom: '1px solid #f1f5f9',
  ':last-child': {
    borderBottom: 'none',
  },
});

export const detailLabel = style({
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#64748b',
});

export const detailValue = style({
  fontSize: '0.9375rem',
  fontWeight: '500',
  color: '#1a1a1a',
  textAlign: 'right',
});

export const statusBadge = style({
  display: 'inline-block',
  padding: '0.25rem 0.75rem',
  borderRadius: '9999px',
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const modalActions = style({
  padding: '1.25rem',
  borderTop: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
});

export const actionsLabel = style({
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#64748b',
  marginBottom: '0.75rem',
});

export const actionButtons = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
});

const actionButtonBase = {
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

export const actionConfirm = style({
  ...actionButtonBase,
  backgroundColor: '#0ea5e9',
  color: '#ffffff',
  ':hover': {
    backgroundColor: '#0284c7',
  },
});

export const actionComplete = style({
  ...actionButtonBase,
  backgroundColor: '#10b981',
  color: '#ffffff',
  ':hover': {
    backgroundColor: '#059669',
  },
});

export const actionNoShow = style({
  ...actionButtonBase,
  backgroundColor: '#6b7280',
  color: '#ffffff',
  ':hover': {
    backgroundColor: '#4b5563',
  },
});

export const actionCancel = style({
  ...actionButtonBase,
  backgroundColor: '#ef4444',
  color: '#ffffff',
  ':hover': {
    backgroundColor: '#dc2626',
  },
});

// Month View Styles
export const monthView = style({
  padding: '0.5rem',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '1rem',
    },
  },
});

export const monthHeader = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  borderBottom: '1px solid #e2e8f0',
  marginBottom: '0.5rem',
});

export const monthDayHeader = style({
  padding: '0.5rem 0.25rem',
  textAlign: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.75rem 0.5rem',
    },
  },
});

export const monthDayNameShort = style({
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#64748b',
  textTransform: 'uppercase',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
});

export const monthDayNameFull = style({
  display: 'none',
  fontSize: '0.75rem',
  fontWeight: '500',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
});

export const monthGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '1px',
  backgroundColor: '#e2e8f0',
  border: '1px solid #e2e8f0',
  borderRadius: '0.375rem',
  overflow: 'hidden',
});

export const monthCell = style({
  backgroundColor: '#ffffff',
  minHeight: '60px',
  padding: '0.25rem',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#f8fafc',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      minHeight: '100px',
      padding: '0.5rem',
    },
  },
});

export const monthCellOther = style({
  backgroundColor: '#f8fafc',
  ':hover': {
    backgroundColor: '#f1f5f9',
  },
});

export const monthCellToday = style({
  backgroundColor: '#f0f9ff',
  ':hover': {
    backgroundColor: '#e0f2fe',
  },
});

export const monthCellDate = style({
  fontSize: '0.75rem',
  fontWeight: '600',
  color: '#1a1a1a',
  marginBottom: '0.25rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '0.875rem',
    },
  },
});

export const monthCellBookings = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
});

export const monthBookingDot = style({
  padding: '0.125rem 0.25rem',
  borderRadius: '0.125rem',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  ':hover': {
    transform: 'scale(1.02)',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '0.25rem 0.375rem',
      borderRadius: '0.25rem',
    },
  },
});

export const monthBookingText = style({
  fontSize: '0.625rem',
  fontWeight: '500',
  color: '#1a1a1a',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '0.75rem',
    },
  },
});

export const monthMoreBookings = style({
  fontSize: '0.625rem',
  color: '#64748b',
  fontWeight: '500',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '0.75rem',
    },
  },
});
