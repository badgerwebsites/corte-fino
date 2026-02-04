// styles/navigation.css.ts
import { style } from '@vanilla-extract/css';

export const nav = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: '#101214',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  padding: '12px 12px',
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

export const carouselContainer = style({
  width: 120,
  height: 36,
  overflow: 'hidden',
  position: 'relative',

  '@media': {
    'screen and (min-width: 768px)': {
      width: 150,
      height: 50,
    },
  },
});

export const carouselTrack = style({
  display: 'flex',
  height: '100%',
  transition: 'transform 0.5s ease-in-out',
});

export const carouselSlide = style({
  flex: '0 0 100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

export const logoImage = style({
  height: 36,
  width: 'auto',
  maxWidth: '100%',
  objectFit: 'contain',

  '@media': {
    'screen and (min-width: 768px)': {
      height: 50,
    },
  },
});

export const logoPlaceholder = style({
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 8px',
  fontSize: 12,
  fontWeight: 600,
  color: '#666',
  backgroundColor: '#333',
  border: '2px dashed #555',
  borderRadius: 4,

  '@media': {
    'screen and (min-width: 768px)': {
      height: 50,
      fontSize: 14,
    },
  },
});

export const navButtons = style({
  display: 'flex',
  alignItems: 'center',
});

const baseButton = {
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  padding: '4px 8px',
  fontSize: 15,
  fontWeight: 700,
  borderRadius: 6,
  cursor: 'pointer',
  textDecoration: 'none',
};

export const loginButton = style({
  ...baseButton,

  color: '#ffffff',
  backgroundColor: 'transparent',
  border: '3px solid #ffffff',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '4px 12px',
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
