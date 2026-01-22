import { style } from '@vanilla-extract/css';

export const container = style({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fafafa',
  padding: 8,
  // paddingTop: 80,

  '@media': {
    'screen and (min-width: 768px)': {
      padding: 24,
      // paddingTop: 96,
    },
  },
});

export const formCard = style({
  width: '100%',
  maxWidth: 400,
  padding: 16,
  backgroundColor: '#ffffff',
  borderRadius: 8,
  border: '1px solid #e5e5e5',
  boxShadow: '0 10px 40px rgba(72, 34, 34, 0.04)',

  '@media': {
    'screen and (min-width: 768px)': {
      padding: 28,
    },
  },
});

export const logoWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 12,
  '@media': {
    'screen and (min-width: 768px)': {
      marginBottom: 24,
    },
  },
});

export const logo = style({
  height: 60,
  width: 'auto',
  '@media': {
    'screen and (min-width: 768px)': {
      height: 80,
    },
  },
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,

  '@media': {
    'screen and (min-width: 768px)': {
      gap: 16,
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
    },
  },
});

export const inputGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const label = style({
  fontSize: 13,
  fontWeight: 500,
  color: '#222',
});

export const input = style({
  padding: '8px 12px',
  fontSize: 14,
  borderRadius: 6,
  border: '1px solid #ddd',
  outline: 'none',
  transition: 'all 0.2s ease',

  '::placeholder': {
    color: '#aaa',
    fontWeight: 300,
  },

  ':focus': {
    borderColor: '#111',
    boxShadow: '0 0 0 1px #111',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '12px 12px',
    },
  },
});

export const submitButton = style({
  marginTop: 4,
  minHeight: 48,
  padding: '14px 24px',
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  backgroundColor: '#111',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  transition: 'all 0.25s ease',

  ':hover': {
    backgroundColor: '#000',
    transform: 'translateY(-1px)',
  },

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const error = style({
  padding: 12,
  backgroundColor: '#fef2f2',
  color: '#991b1b',
  borderRadius: 6,
  fontSize: 14,
  border: '1px solid #fecaca',
});

export const footer = style({
  marginTop: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  '@media': {
    'screen and (min-width: 768px)': {
      marginTop: 16,
      gap: 4,
    },
  },
});

export const footerText = style({
  fontSize: 20,
  color: '#666',
  textAlign: 'center',

  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 24,
    },
  },
});

export const link = style({
  color: '#2e78b7',
  fontWeight: 700,
  fontSize: 20,
  textDecoration: 'none',
  transition: 'color 0.2s ease',

  ':hover': {
    color: '#245f93',
  },

  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: 24,
    },
  },
});
