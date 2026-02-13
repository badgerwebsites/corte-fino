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
  marginBottom: 16,
});

export const label = style({
  display: 'block',
  marginBottom: 12,
  fontWeight: '500',
  color: text_primary,
  fontSize: 16,
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
  position: 'relative',
  display: 'inline-block',
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

export const removeOverlay = style({
  position: 'absolute',
  top: 8,
  right: 8,
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: '#dc2626',
  color: darker_bg,
  border: 'none',
  fontSize: 16,
  fontWeight: 1000,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',

  ':hover': {
    backgroundColor: '#b91c1c',
    transform: 'scale(1.05)',
  },
});

export const changeButtonOverlay = style({
  position: 'absolute',
  bottom: 8,
  left: 8,
  padding: '0.35rem 0.75rem',
  backgroundColor: button,
  color: darker_bg,
  border: `none`,
  borderRadius: 4,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'all 0.2s',

  ':hover': {
    backgroundColor: '#7fbccd',
  },
});

export const hiddenInput = style({
  display: 'none',
});
