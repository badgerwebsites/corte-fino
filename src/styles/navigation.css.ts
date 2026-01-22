import { style } from '@vanilla-extract/css';

export const nav = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,

  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e5e5',

  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',

  padding: '12px 12px',

  '@media': {
    'screen and (min-width: 768px)': {
      padding: '16px 24px',
    },
  },
});

export const navContainer = style({
  maxWidth: 1200,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
});

export const logoLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
});

export const logoImage = style({
  height: 14,
  width: 'auto',
  transition: 'opacity 0.2s ease',

  '@media': {
    'screen and (min-width: 768px)': {
      height: 32,
    },
  },

  ':hover': {
    opacity: 0.7,
  },
});

export const navButtons = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 8,
  flexWrap: 'wrap',

  '@media': {
    'screen and (min-width: 768px)': {
      flexWrap: 'nowrap',
      gap: 12,
    },
  },
});

const baseButton = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  fontWeight: 500,
  // borderRadius: 4,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

export const loginButton = style({
  ...baseButton,
  padding: '4px 8px',
  fontSize: 13,
  fontWeight: 500,
  color: '#1a1a1a',

  backgroundColor: 'transparent',

  // ✅ BLACK OUTLINE ALWAYS
  border: '1px solid #1a1a1a',
  borderWidth: 2,
  borderRadius: 6,

  '@media': {
    'screen and (min-width: 768px)': {
      padding: '6px 12px',
      fontSize: 16,
      letterSpacing: '0.05em',
    },
  },

  ':hover': {
    backgroundColor: '#fafafa',
  },

  ':focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(46,120,183,0.4)',
  },
});

export const dashboardButton = style({
  ...baseButton,
  padding: '4px 8px',
  fontSize: 12,
  fontWeight: 500,
  color: '#1a1a1a',

  backgroundColor: 'transparent',

  // ✅ BLACK OUTLINE ALWAYS
  border: '1px solid #1a1a1a',
  borderWidth: 2,
  borderRadius: 6,

  '@media': {
    'screen and (min-width: 768px)': {
      padding: '6px 12px',
      fontSize: 16,
      letterSpacing: '0.05em',
    },
  },

  ':hover': {
    backgroundColor: '#fafafa',
  },

  ':focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 2px rgba(46,120,183,0.35)',
  },
});

export const bookNowButton = style({
  ...baseButton,
  padding: '6px 8px',
  fontSize: 12,
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  border: 'none',
  borderRadius: 6,


  '@media': {
    'screen and (min-width: 768px)': {
      padding: '8px 12px',
      fontSize: 16,
      letterSpacing: '0.05em',
    },
  },

  ':hover': {
    backgroundColor: '#333',
  },

  ':active': {
    transform: 'scale(0.97)',
  },
});
