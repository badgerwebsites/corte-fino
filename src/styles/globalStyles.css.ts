// styles/globalStyles.css.ts
import { style } from '@vanilla-extract/css';

export const darker_bg     = "#101214";
export const dark_bg       = "#222222";
export const button        = "#96cfe0";
export const text_primary  = "#f5f5f5";
export const text_secondary = "#b0b0b0";
export const text_muted    = "#8a8a8a";
export const border_subtle = "rgba(255,255,255,0.08)";
export const border_hover  = "rgba(255,255,255,0.18)";

// Primary action button — button-color background, dark text, uppercase
export const primaryButton = style({
  backgroundColor: button,
  color: '#1f1f1f',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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

// Outlined button — transparent bg, button-color border & text
export const outlineButton = style({
  backgroundColor: 'transparent',
  color: button,
  border: `2px solid ${button}`,
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  transition: 'all 0.2s',
  ':hover': {
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
});

// Danger button — transparent bg, red border & text
export const dangerButton = style({
  backgroundColor: 'transparent',
  color: '#ef4444',
  border: '1px solid #e5a3a3',
  borderRadius: 4,
  cursor: 'pointer',
  fontWeight: 500,
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: dark_bg,
  },
});

// Cancel / destructive button — red-filled
export const cancelButton = style({
  backgroundColor: '#fecaca',
  color: '#dc2626',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  transition: 'all 0.2s',
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
});

// Standard text input field
export const baseInput = style({
  width: '100%',
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${text_muted}`,
  boxSizing: 'border-box',
  padding: '0.625rem',
  borderRadius: 8,
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
    border: `1px solid ${button}`,
  },
  '::placeholder': {
    color: text_muted,
  },
});

// Standard textarea field
export const baseTextarea = style({
  width: '100%',
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${text_muted}`,
  boxSizing: 'border-box',
  padding: '0.625rem',
  borderRadius: 8,
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
    border: `1px solid ${button}`,
  },
  '::placeholder': {
    color: text_muted,
  },
});

// Standard select field (pair with selectWrapper + selectIcon for the chevron)
export const baseSelect = style({
  width: '100%',
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${text_muted}`,
  boxSizing: 'border-box',
  padding: '0.625rem',
  paddingRight: '2.5rem',
  borderRadius: 8,
  fontSize: '0.875rem',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
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
    border: `1px solid ${button}`,
  },
  '::placeholder': {
    color: text_muted,
  },
});

// Form field label
export const baseLabel = style({
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
  color: text_secondary,
  fontSize: '0.875rem',
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '1rem',
    },
  },
});

// Modal / dialog backdrop overlay
export const modalOverlay = style({
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
  padding: 20,
});

// Modal content card
export const modalCard = style({
  backgroundColor: dark_bg,
  borderRadius: 16,
  padding: 20,
  width: '100%',
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
  border: `1px solid ${border_subtle}`,
});

// Dark card / section container
export const sectionCard = style({
  backgroundColor: dark_bg,
  borderRadius: 8,
  padding: 12,
  border: `1px solid ${border_subtle}`,
  overflow: 'hidden',
  ':hover': {
    boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
    borderColor: border_hover,
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: 24,
    },
  },
});

// Base page container (minHeight + bg — extend per page for specific padding)
export const pageContainer = style({
  minHeight: '100vh',
  backgroundColor: darker_bg,
});
