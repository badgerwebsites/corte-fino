import { style } from '@vanilla-extract/css';

const dark_bg = "#222222";
const button =  "#96cfe0";
const border_subtle = "rgba(255,255,255,0.08)";

export const container = style({
  height: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background:
    'linear-gradient(180deg, #cfeef4 0%, #96cfe0 100%)',
  boxSizing: 'border-box',
  padding: 24,
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 32,
    },
  },
});

export const formCard = style({
  width: '100%',
  maxWidth: 420,
  padding: 20,
  backgroundColor: dark_bg,
  borderColor: border_subtle,
  borderRadius: 12,
  boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 32,
    },
  },
});

export const logoWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 16,
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: 28,
    },
  },
});

export const logo = style({
  height: 50,
  width: 'auto',
  transition: 'opacity 0.2s ease',
  '@media': {
    'screen and (min-width: 768px)': {
      height: 72,
    },
  },
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  '@media': {
    'screen and (min-width: 768px)': {
      gap: 18,
    },
  },
});

export const inputRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 12,
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: '1fr 1fr',
      gap: 18,
    },
  },
});

export const inputGroup = style({
  display: 'flex',
  flexDirection: 'column',
});

export const input = style({
  padding: '10px 12px',
  fontSize: 15,
  borderRadius: 8,
  backgroundColor: '#f9f9f9',
  border: '1px solid #e5e5e5',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  '::placeholder': {
    color: '#9ca3af',
    fontWeight: 400,
  },
  ':focus': {
    borderColor: '#a8dce8',
    boxShadow: '0 0 0 2px rgba(168,220,232,0.35)',
  },
  '@media': {
    'screen and (min-width: 768px)': {
        padding: '12px 12px',
        fontSize: 16,
    },
  },
});

export const submitButton = style({
  marginTop: 4,
  minHeight: 52,
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  backgroundColor: button,
  color: '#1f1f1f',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  '@media': {
    'screen and (min-width: 768px)': {
        fontSize: 24,
    },
  },
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
  ':active': {
    transform: 'translateY(0)',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const error = style({
  padding: 12,
  borderRadius: 8,
  backgroundColor: '#fef2f2',
  color: '#991b1b',
  fontSize: 14,
  border: '1px solid #fecaca',
});

export const footer = style({
  marginTop: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
});

export const footerText = style({
  fontSize: 20,
  color: '#9ca3af',
  textAlign: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
        fontSize: 28,
    },
  },
});

export const link = style({
  fontSize: 22,
  fontWeight: 700,
  color: button,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  '@media': {
    'screen and (min-width: 768px)': {
        fontSize: 28,
    },
  },
  ':hover': {
    color: '#6faec6',
  },
});
