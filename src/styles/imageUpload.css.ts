import { style } from '@vanilla-extract/css';

export const container = style({
  marginBottom: '1rem',
});

export const label = style({
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
  color: '#2d3748',
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
  border: '2px dashed #e2e8f0',
  borderRadius: '0.5rem',
  backgroundColor: '#f8fafc',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    borderColor: '#cbd5e1',
    backgroundColor: '#f1f5f9',
  },
});

export const dropzoneDragging = style({
  borderColor: '#0ea5e9',
  backgroundColor: '#f0f9ff',
  borderStyle: 'solid',
  transform: 'scale(1.02)',
  boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.1)',
});

export const dropzoneIcon = style({
  color: '#94a3b8',
  marginBottom: '0.75rem',
});

export const dropzoneText = style({
  fontSize: '0.9375rem',
  fontWeight: '500',
  color: '#475569',
  marginBottom: '0.25rem',
});

export const dropzoneHint = style({
  fontSize: '0.8125rem',
  color: '#94a3b8',
});

export const previewContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '1rem',
  border: '2px solid #e2e8f0',
  borderRadius: '0.5rem',
  backgroundColor: '#f8fafc',
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
  fontSize: '0.875rem',
  fontWeight: '500',
  backgroundColor: '#ffffff',
  color: '#475569',
  border: '1px solid #e2e8f0',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const removeButton = style({
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: '500',
  backgroundColor: '#ffffff',
  color: '#ef4444',
  border: '1px solid #fecaca',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const hiddenInput = style({
  display: 'none',
});
