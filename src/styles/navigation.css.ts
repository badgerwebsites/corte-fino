// styles/navigation.css.ts
import { style } from '@vanilla-extract/css';

export const nav = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: '#222222',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  padding: '12px 8px',
  borderBottom: '1px solid #ffffff',

  '@media': {
    'screen and (min-width: 768px)': {
      padding: '12px 18px',
    },
  },
});

export const navContainer = style({
  maxWidth: 1200,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const logoLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
});

export const logoImage = style({
  height: 40,
  width: 'auto',

  '@media': {
    'screen and (min-width: 768px)': {
      height: 50,
    },
  },
});

export const navButtons = style({
  display: 'flex',
  alignItems: 'center',
});

const baseButton = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',

  padding: '4px 8px',
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: '0.05em',

  borderRadius: 6,
  cursor: 'pointer',
  textDecoration: 'none',

  transition: 'all 0.2s ease',
};

export const loginButton = style({
  ...baseButton,

  color: '#ffffff',
  backgroundColor: 'transparent',
  border: '3px solid #ffffff',

  '@media': {
    'screen and (min-width: 768px)': {
      padding: '6px 12px',
      fontSize: 18,
    },
  },

  ':hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  ':active': {
    transform: 'scale(0.97)',
  },

  ':focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(168,220,232,0.5)',
  },
});

export const logoutButton = style({
  ...baseButton,

  color: '#c24141',
  backgroundColor: 'transparent',
  border: '3px solid #c24141',

  '@media': {
    'screen and (min-width: 768px)': {
      padding: '6px 12px',
      fontSize: 18,
    },
  },

  ':hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  ':active': {
    transform: 'scale(0.97)',
  },

  ':focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(168,220,232,0.5)',
  },
});
