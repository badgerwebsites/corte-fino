import { style } from '@vanilla-extract/css';

const darker_bg = "#101214";
// const dark_bg = "#222222";
const button =  "#96cfe0";
const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
// const text_muted = "#8a8a8a";
// const border_subtle = "rgba(255,255,255,0.08)";
// const border_hover = "rgba(255,255,255,0.18)";

export const container = style({
  marginBottom: '1rem',
});

export const label = style({
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

export const uploadArea = style({
  width: '100%',
});

export const dropzone = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1rem',
  border: '2px dashed #96cfe0',
  borderRadius: '0.5rem',
  backgroundColor: darker_bg,
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    borderColor: '#7fbccd',
    backgroundColor: "#000",
  },
});

export const dropzoneDragging = style({
  borderColor: '#7fbccd',
  backgroundColor: darker_bg,
  borderStyle: 'solid',
  transform: 'scale(1.02)',
  boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.1)',
});

export const dropzoneIcon = style({
  color: text_primary,
  marginBottom: 8,
});

export const dropzoneText = style({
  fontSize: '0.9375rem',
  fontWeight: '500',
  color: text_primary,
  marginBottom: 8,
});

export const dropzoneHint = style({
  fontSize: '0.8125rem',
  color: text_secondary,
});

export const previewContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '1rem',
  border: `1px solid ${text_secondary}`,
  borderRadius: '0.5rem',
  backgroundColor: darker_bg,
});

export const preview = style({
  maxWidth: '200px',
  maxHeight: '200px',
  width: 'auto',
  height: 'auto',
  objectFit: 'cover',
  borderRadius: '0.375rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
});

export const previewActions = style({
  display: 'flex',
  gap: '0.5rem',
});

export const changeButton = style({
  padding: '0.5rem 1rem',
  fontSize: 16,
  fontWeight: '500',
  backgroundColor: button,
  color: darker_bg,
  border: "none",
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.2s',
  letterSpacing: '0.02em',
  ':hover': {
    backgroundColor: '#7fbccd',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const removeButton = style({
  padding: '0.5rem 1rem',
  fontSize: 16,
  fontWeight: '500',
  backgroundColor: '#fecaca',
  color: '#dc2626',
  border: "none",
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.2s',
  letterSpacing: '0.02em',
  ':hover': {
    backgroundColor: '#fcb3b3',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const hiddenInput = style({
  display: 'none',
});
