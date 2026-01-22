import { style } from '@vanilla-extract/css';

export const calendarContainer = style({
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: 4,
  border: '1px solid #e5e5e5',
  maxWidth: 600,
  margin: '0 auto',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '24px',
    },
  },
});

export const calendarWrapper = style({
  selectors: {
    '& .rdp': {
      fontSize: '14px',
      margin: 0,
    },
    '& .rdp-months': {
      justifyContent: 'center',
    },
    '& .rdp-month': {
      width: '100%',
    },
    '& .rdp-caption': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      padding: '0 8px',
    },
    '& .rdp-caption_label': {
      fontSize: '16px',
      fontWeight: 500,
      color: '#1a1a1a',
    },
    '& .rdp-nav': {
      display: 'flex',
      gap: '8px',
    },
    '& .rdp-nav_button': {
      width: '32px',
      height: '32px',
      padding: 0,
      border: '1px solid #e5e5e5',
      borderRadius: '4px',
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& .rdp-nav_button:hover:not([disabled])': {
      borderColor: '#1a1a1a',
      backgroundColor: '#f0f0f0',
    },
    '& .rdp-nav_button[disabled]': {
      opacity: 0.3,
      cursor: 'not-allowed',
    },
    '& .rdp-head_cell': {
      fontWeight: 500,
      fontSize: '12px',
      color: '#666',
      textTransform: 'uppercase',
      padding: '8px',
    },
    '& .rdp-cell': {
      padding: '2px',
    },
    '& .rdp-day': {
      width: '40px',
      height: '40px',
      border: '1px solid transparent',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 400,
      color: '#1a1a1a',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: '#ffffff',
    },
    '& .rdp-day:hover:not([disabled]):not(.rdp-day_selected)': {
      backgroundColor: '#f0f0f0',
      borderColor: '#d0d0d0',
    },
    '& .rdp-day_selected': {
      backgroundColor: '#1a1a1a !important',
      color: '#ffffff !important',
      fontWeight: 500,
      borderColor: '#1a1a1a !important',
    },
    '& .rdp-day_today': {
      borderColor: '#1a1a1a',
      fontWeight: 500,
    },
    '& .rdp-day_disabled': {
      opacity: 0.3,
      cursor: 'not-allowed',
      color: '#999',
    },
    '& .rdp-day_outside': {
      opacity: 0.3,
      color: '#999',
    },
    '& .rdp-day_unavailable': {
      opacity: 0.3,
      textDecoration: 'line-through',
      cursor: 'not-allowed',
    },
  },
});

export const timeSelectionWrapper = style({
  marginTop: '24px',
  paddingTop: '24px',
  borderTop: '2px solid #f0f0f0',
});

export const timeLabel = style({
  fontSize: '16px',
  fontWeight: 500,
  marginBottom: '12px',
  color: '#1a1a1a',
  display: 'block',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '18px',
      marginBottom: '16px',
    },
  },
});

export const noTimesMessage = style({
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#f0f0f0',
  borderRadius: '4px',
  color: '#666',
  fontSize: '14px',
});
