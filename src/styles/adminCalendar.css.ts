import { style, globalStyle } from '@vanilla-extract/css';

const darker_bg = "#101214";
const dark_bg = "#222222";
const button =  "#96cfe0";
const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";
const border_hover = "rgba(255,255,255,0.18)";

export const container = style({
  backgroundColor: dark_bg,
  borderRadius: '0.5rem',
  border: '1px solid #e2e8f0',
  overflow: 'hidden',
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 16,
  borderBottom: '1px solid #e2e8f0',
  backgroundColor: darker_bg,
  alignItems: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
    },
  },
});

export const navigation = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const navButton = style({
  all: "unset",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  borderRadius: 6,
  color: "#fff",

  ":hover": {
    color: button,
  },

  ":disabled": {
    opacity: 0.35,
    cursor: "not-allowed",
  },
});

globalStyle(`${navButton} svg`, {
  width: 28,
  height: 28,
  strokeWidth: 3.5,
});

export const todayButton = style({
  fontSize: 22,
  fontWeight: '600',
  backgroundColor: 'transparent',
  color: text_primary,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  textAlign: 'center',
  ':hover': {
    color: button,
  },
  selectors: {
    '&[aria-pressed="true"]': {
      color: button,
    },
  },
});

export const dateTitle = style({
  fontSize: 22,
  fontWeight: '600',
  color: text_primary,
  textAlign: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 26,
    },
  },
});

export const controls = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
  justifyContent: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      gap: 16,
    },
  },
});

export const selectWrapper = style({
  position: 'relative',
  display: 'inline-block',
  margin: '0 auto',
});

globalStyle(`${selectWrapper}::after`, {
  content: '""',
  position: 'absolute',
  right: 16,
  top: '50%',
  transform: 'translateY(-50%)',

  width: 18,
  height: 18,

  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',

  pointerEvents: 'none',
  opacity: 0.9,
});

export const barberFilter = style({
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  minWidth: 240,

  padding: '8px 0px 8px 10px',
  fontSize: 18,
  fontWeight: 400,

  borderRadius: 8,
  backgroundColor: 'transparent',
  color: text_primary,
  border: '1px solid #f5f5f5',

  cursor: 'pointer',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '10px 48px 10px 16px',
    },
  },
});

export const viewToggle = style({
  display: 'flex',
  margin: '0 auto',
  borderRadius: 8,
  overflow: 'hidden',
  border: '1px solid #f5f5f5',
});

export const viewButton = style({
  padding: '10px 16px',
  fontSize: 16,
  fontWeight: '600',
  backgroundColor: 'transparent',
  color: text_primary,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  minWidth: 80,
  ':hover': {
    backgroundColor: button,
    color: '#1a1a1a',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '12px 16px',
    },
  },
});

export const viewButtonActive = style({
  backgroundColor: button,
  color: '#1a1a1a',
});

export const bookAppointmentButton = style({
  padding: '10px 16px',
  fontSize: 16,
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
      padding: '6px 12px',
      borderRadius: 32,
    },
  },
});

export const plusIcon = style({
  fontSize: 20,
  fontWeight: 600,
  lineHeight: 1,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 24,
    },
  },
});

export const mobileOnlyText = style({
  display: 'inline',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
});

// Day View Styles
export const dayView = style({
  overflow: 'auto',
});

export const dayHeader = style({
  display: 'grid',
  gridTemplateColumns: '50px 1fr',
  borderBottom: '1px solid #e2e8f0',
  position: 'sticky',
  top: 0,
  backgroundColor: dark_bg,
  zIndex: 10,
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: '80px 1fr',
    },
  },
});

export const dayHeaderToday = style({
  backgroundColor: button,
});

export const dayTimeColumnHeader = style({
  borderRight: '1px solid #e2e8f0',
  backgroundColor: dark_bg,
});

export const dayColumnHeader = style({
  padding: '4px 0px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '8px 0px',
    },
  },
});

export const dayColumnHeaderToday = style({
  backgroundColor: dark_bg,
});

export const dayColumnDayName = style({
  fontSize: 16,
  fontWeight: '500',
  color: text_primary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  selectors: {
    [`${dayHeaderToday} &`]: {
      color: darker_bg,
    },
  },
});

export const dayColumnDate = style({
  fontSize: 20,
  fontWeight: '600',
  color: text_primary,
  marginTop: 4,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 24,
    },
  },
  selectors: {
    [`${dayHeaderToday} &`]: {
      color: darker_bg,
    },
  },
});

export const timeGrid = style({
  display: 'flex',
  flexDirection: 'column',
});

export const timeRow = style({
  display: 'grid',
  gridTemplateColumns: '50px 1fr',
  minHeight: '60px',
  borderBottom: '1px solid #444',
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: '80px 1fr',
      minHeight: '80px',
    },
  },
});

export const hourCell = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
});

export const hourCellToday = style({
  backgroundColor: darker_bg,
});

export const quarterDropZones = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const quarterZone = style({
  flex: 1,
  transition: 'background-color 0.15s ease',
});

export const timeLabel = style({
  padding: '4px 2px',
  fontSize: 10,
  fontWeight: '400',
  color: text_secondary,
  borderRight: '1px solid #e2e8f0',
  backgroundColor: dark_bg,
  textAlign: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '4px 4px',
      fontSize: 12,
    },
  },
});

export const appointmentsColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: 2,
  alignItems: 'stretch',
});

export const appointmentCard = style({
  display: 'flex',
  flexDirection: 'column',
  padding: 8,
  paddingLeft: 12,
  borderRadius: 10,
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'all 0.2s',

  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
});

export const appointmentTime = style({
  fontSize: 12,
  fontWeight: '500',
  color: text_primary,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 14,
    },
  },
});

export const appointmentCustomer = style({
  fontSize: 12,
  fontWeight: '500',
  color: text_primary,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 14,
    },
  },
});

// Week View Styles
export const weekView = style({
  overflow: 'auto',
});

export const weekHeader = style({
  display: 'grid',
  gridTemplateColumns: '50px repeat(7, minmax(0, 1fr))',
  borderBottom: '1px solid #e2e8f0',
  position: 'sticky',
  top: 0,
  backgroundColor: dark_bg,
  zIndex: 10,
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: '70px repeat(7, minmax(0, 1fr))',
    },
  },
});

export const timeColumnHeader = style({
  borderRight: '1px solid #f1f5f9',
  backgroundColor: dark_bg,
});

export const weekDayHeader = style({
  padding: '8px 4px',
  textAlign: 'center',
  borderRight: '1px solid #f1f5f9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  ':last-child': {
    borderRight: 'none',
  },
});

export const todayHeader = style({
  backgroundColor: button,
});

export const weekDayNameShort = style({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: text_primary,
  textTransform: 'uppercase',
  selectors: {
    [`${todayHeader} &`]: {
      color: '#1a1a1a',
    },
  },
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
});

// Full day name (Sun, Mon, Tue...) - shown on desktop
export const weekDayNameFull = style({
  display: 'none',
  fontSize: 16,
  fontWeight: '500',
  color: text_primary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  selectors: {
    [`${todayHeader} &`]: {
      color: '#1a1a1a',
    },
  },
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'block',
    },
  },
});

export const weekDayDate = style({
  fontSize: 14,
  fontWeight: '600',
  color: text_primary,
  marginTop: 2,
  selectors: {
    [`${todayHeader} &`]: {
      color: '#1a1a1a',
    },
  },
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 24,
      marginTop: 4,
    },
  },
});

export const weekTimeGrid = style({
  display: 'flex',
  flexDirection: 'column',
});

export const weekTimeRow = style({
  display: 'grid',
  gridTemplateColumns: '50px repeat(7, minmax(0, 1fr))',
  minHeight: '60px',
  borderBottom: '1px solid #444',
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: '70px repeat(7, minmax(0, 1fr))',
      minHeight: '80px',
    },
  },
});

export const weekTimeLabel = style({
  padding: '4px 2px',
  fontSize: 10,
  fontWeight: '400',
  color: text_secondary,
  borderRight: '1px solid #e2e8f0',
  backgroundColor: dark_bg,
  textAlign: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '4px 4px',
      fontSize: 12,
    },
  },
});

export const weekTimeCell = style({
  minWidth: 0,
  position: 'relative',
  borderRight: '1px solid #333',
  ':last-child': {
    borderRight: 'none',
  },
});

export const todayCell = style({
  backgroundColor: darker_bg,
});

export const weekAppointment = style({
  minWidth: 0,
  padding: '0px 2px',
  paddingLeft: 8,
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.2s',
  overflow: 'hidden',
  ':hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '2px 10px',
    },
  },
});

export const weekAppointmentName = style({
  display: 'block',
  fontSize: 11,
  fontWeight: '500',
  color: text_primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 14,
    },
  },
});

export const appointmentMeta = style({
  fontSize: 12,
  color: text_secondary,
});

// Status Colors
export const statusIcon = style({
  position: 'absolute',
  top: 4,
  right: 4,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const appointmentTimeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const dayStatusIcon = style({
  display: 'flex',
  alignItems: 'center',
  opacity: 0.9,
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
  padding: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 20,
    },
  },
});

export const modalContent = style({
  backgroundColor: dark_bg,
  borderRadius: 16,
  border: `1px solid ${border_hover}`,
  maxWidth: '450px',
  width: '100%',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.16)",
});

export const modalHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 12,
  borderBottom: '1px solid #e2e8f0',
  "@media": {
    "screen and (min-width: 768px)": {
      paddingLeft: 20,
    },
  },
});

export const modalTitle = style({
  fontSize: 18,
  fontWeight: '500',
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 22,
    },
  },
});

export const closeButton = style({
  padding: '4px 8px',
  fontSize: 24,
  lineHeight: 1,
  backgroundColor: 'transparent',
  color: text_primary,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    color: '#ef4444',
  },
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 30,
    },
  },
});

export const modalBody = style({
  padding: 20,
});

export const detailRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '12px 0px',
  borderBottom: '1px solid #f1f5f9',
  ':last-child': {
    borderBottom: 'none',
  },
});

export const detailDateTime = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,

  marginLeft: 'auto',
  textAlign: 'right',

  '@media': {
    'screen and (min-width: 768px)': {
      gap: 6,
    },
  },
});

export const detailDate = style({
  fontSize: 14,
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const detailTime = style({
  fontSize: 14,
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const detailLabel = style({
  fontSize: 15,
  fontWeight: '500',
  color: text_secondary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 17,
    },
  },
});

export const detailLabelStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const detailValue = style({
  fontSize: 14,
  fontWeight: '500',
  color: text_primary,
  textAlign: 'right',
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const statusBadge = style({
  fontSize: 13,
  color: text_primary,
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const modalActions = style({
  padding: 12,
  borderTop: '1px solid #e2e8f0',
  backgroundColor: dark_bg,

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
});

export const actionButtons = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
});

const actionButtonBase = {
  padding: '8px 12px',
  fontSize: 16,
  fontWeight: '550',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  transition: 'all 0.2s',
};

export const actionConfirm = style({
  ...actionButtonBase,
  backgroundColor: '#0ea5e9',
  color: dark_bg,
  ':hover': {
    backgroundColor: '#0284c7',
  },
});

export const actionComplete = style({
  ...actionButtonBase,
  backgroundColor: '#10b981',
  color: dark_bg,
  ':hover': {
    backgroundColor: '#059669',
  },
});

export const actionNoShow = style({
  ...actionButtonBase,
  backgroundColor: text_muted,
  color: dark_bg,
  ':hover': {
    backgroundColor: '#6b7280',
  },
});

export const actionCancel = style({
  ...actionButtonBase,
  backgroundColor: '#ef4444',
  color: dark_bg,
  ':hover': {
    backgroundColor: '#dc2626',
  },
});

// Month View Styles
export const monthView = style({
  padding: 8,
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 16,
    },
  },
});

export const monthHeader = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
});

export const monthDayHeader = style({
  paddingBottom: 8,
  textAlign: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      paddingBottom: 16,
    },
  },
});

export const monthDayNameShort = style({
  display: 'block',
  fontSize: 16,
  fontWeight: '600',
  color: text_primary,
  textTransform: 'uppercase',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'none',
    },
  },
});

export const monthDayNameFull = style({
  display: 'none',
  fontSize: 16,
  fontWeight: '500',
  color: text_primary,
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
  minWidth: 0,
  borderRight: '1px solid #f1f5f9',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  backgroundColor: dark_bg,
  minHeight: '60px',
  padding: 4,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: darker_bg,
  },
  '@media': {
    'screen and (min-width: 768px)': {
      minHeight: '100px',
      padding: '0.5rem',
    },
  },
});

export const monthCellOther = style({
  opacity: 0.9,
  cursor: "default",
  pointerEvents: 'none',
  ':hover': {
    backgroundColor: dark_bg,
    opacity: 0.9,
  },
});

export const monthCellToday = style({
  backgroundColor: button,
  ':hover': {
    backgroundColor: button,
  },
});

export const monthCellDate = style({
  fontSize: 12,
  fontWeight: '600',
  color: text_primary,
  selectors: {
    [`${monthCellToday} &`]: {
      color: dark_bg,
    },
  },
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 16,
    },
  },
});

export const monthCellBookings = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const monthBookingDot = style({
  minWidth: 0,
  padding: '0px 2px',
  paddingLeft: 8,
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.2s',
  overflow: 'hidden',
  ':hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '2px 10px',
    },
  },
});

export const monthBookingText = style({
  display: 'block',
  fontSize: 10,
  fontWeight: '500',
  color: text_primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 13,
    },
  },
});

export const monthMoreBookings = style({
  fontSize: 8,
  color: text_primary,
  fontWeight: '500',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 13,
      paddingLeft: 8,
    },
  },
});

// Drag and Drop Styles
export const draggableAppointment = style({
  cursor: 'grab',
  touchAction: 'none',
  ':active': {
    cursor: 'grabbing',
  },
});

export const dragging = style({
  opacity: 0.5,
});

export const dragOverlay = style({
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  transform: 'scale(1.02)',
  opacity: 0.95,
  borderRadius: 10,
  cursor: 'grabbing',
});

export const droppableSlot = style({
  transition: 'background-color 0.15s ease',
});

export const droppableActive = style({
  backgroundColor: 'rgba(150, 207, 224, 0.15)',
});

export const droppableOver = style({
  backgroundColor: 'rgba(150, 207, 224, 0.3)',
  boxShadow: 'inset 0 0 0 2px #96cfe0',
});

export const droppableInvalid = style({
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  boxShadow: 'inset 0 0 0 2px #ef4444',
});

export const droppableInRange = style({
  backgroundColor: 'rgba(150, 207, 224, 0.25)',
});

// Reschedule Confirmation Modal
export const rescheduleModal = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1100,
  padding: 12,
});

export const rescheduleModalContent = style({
  backgroundColor: dark_bg,
  borderRadius: 16,
  maxWidth: '400px',
  width: '100%',
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
});

export const rescheduleModalHeader = style({
  padding: '16px 20px',
  borderBottom: '1px solid #333',
});

export const rescheduleModalTitle = style({
  fontSize: 20,
  fontWeight: '600',
  color: text_primary,
  margin: 0,
});

export const rescheduleModalBody = style({
  padding: 20,
});

export const rescheduleInfo = style({
  marginBottom: 16,
});

export const rescheduleLabel = style({
  fontSize: 13,
  fontWeight: '500',
  color: text_muted,
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const rescheduleValue = style({
  fontSize: 16,
  fontWeight: '500',
  color: text_primary,
});

export const rescheduleTimeChange = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 16,
  backgroundColor: darker_bg,
  borderRadius: 8,
  marginTop: 12,
});

export const rescheduleTimeBlock = style({
  flex: 1,
  textAlign: 'center',
});

export const rescheduleTimeLabel = style({
  fontSize: 11,
  fontWeight: '600',
  color: text_muted,
  textTransform: 'uppercase',
  marginBottom: 4,
});

export const rescheduleTimeValue = style({
  fontSize: 14,
  fontWeight: '500',
  color: text_primary,
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 15,
    },
  },
});

export const rescheduleArrow = style({
  fontSize: 20,
  color: button,
});

export const rescheduleNotice = style({
  fontSize: 13,
  color: text_secondary,
  marginTop: 16,
  padding: '10px 12px',
  backgroundColor: 'rgba(150, 207, 224, 0.1)',
  borderRadius: 6,
  borderLeft: `3px solid ${button}`,
});

export const rescheduleModalActions = style({
  display: 'flex',
  gap: 12,
  padding: '16px 20px',
  borderTop: '1px solid #333',
});

export const rescheduleCancel = style({
  flex: 1,
  padding: '12px 16px',
  fontSize: 15,
  fontWeight: '600',
  backgroundColor: 'transparent',
  color: text_primary,
  border: `1px solid ${text_primary}`,
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#333',
  },
});

export const rescheduleConfirm = style({
  flex: 1,
  padding: '12px 16px',
  fontSize: 15,
  fontWeight: '600',
  backgroundColor: button,
  color: dark_bg,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#7ab8cc',
  },
});

// Cancel Confirmation Modal Styles
export const cancelMessage = style({
  fontSize: 14,
  color: text_secondary,
  marginTop: 16,
  padding: '12px 14px',
  backgroundColor: 'rgba(239, 68, 68, 0.1)',
  borderRadius: 6,
  borderLeft: '3px solid #ef4444',
  lineHeight: 1.5,
});

export const cancelModalActions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: '16px 20px',
  borderTop: '1px solid #333',
});

export const cancelSingleButton = style({
  padding: '12px 16px',
  fontSize: 15,
  fontWeight: '600',
  backgroundColor: '#b45309',
  color: '#ffffff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: '#92400e',
  },
});

export const cancelAllButton = style({
  padding: '12px 16px',
  fontSize: 15,
  fontWeight: '600',
  backgroundColor: '#991b1b',  // deep red
  color: '#ffffff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: '#7f1d1d',
  },
});
