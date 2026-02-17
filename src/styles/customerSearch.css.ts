
import { style } from '@vanilla-extract/css';

const darker_bg = "#101214";
const dark_bg = "#222222";
const button = "#96cfe0";
const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";
const border_subtle = "rgba(255,255,255,0.08)";

export const searchContainer = style({
  position: 'relative',
  width: '100%',
  maxWidth: 450,
  margin: '0 auto',
});

export const searchInput = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 14px',
  fontSize: 16,
  backgroundColor: darker_bg,
  color: text_primary,
  border: `1px solid ${text_secondary}`,
  borderRadius: 8,
  outline: 'none',
  transition: 'border-color 0.2s',
  marginTop: 12,
  ':focus': {
    borderColor: button,
  },
  '::placeholder': {
    color: text_muted,
  },
});

export const searchDropdown = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: darker_bg,
  border: `1px solid ${text_muted}`,
  borderRadius: 8,
  marginTop: 4,
  maxHeight: 350,
  overflowY: 'auto',
  zIndex: 10,
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
});

export const searchResultItem = style({
  padding: '12px 14px',
  cursor: 'pointer',
  borderBottom: `1px solid ${border_subtle}`,
  transition: 'background-color 0.15s',
  ':hover': {
    backgroundColor: dark_bg,
  },
  ':last-child': {
    borderBottom: 'none',
  },
});

export const searchResultName = style({
  fontSize: 14,
  fontWeight: 500,
  color: text_primary,
  marginBottom: 2,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const searchResultDetail = style({
  fontSize: 12,
  color: text_secondary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 14,
    },
  },
});

export const searchLoading = style({
  padding: '16px 14px',
  textAlign: 'center',
  color: text_muted,
  fontSize: 14,
});

export const searchNoResults = style({
  padding: '16px 12px',
  textAlign: 'center',
  color: text_muted,
  fontSize: 16,
});

export const selectedCustomer = style({
  display: 'flex',
  alignItems: 'left',
  justifyContent: 'space-between',
  padding: '12px 14px',
  backgroundColor: darker_bg,
  borderRadius: 8,
  border: `1px solid ${button}`,
  marginTop: 12,
});

export const selectedCustomerInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  alignItems: 'flex-start',
  textAlign: 'left',
});

export const selectedCustomerName = style({
  fontSize: 16,
  fontWeight: 500,
  color: text_primary,
});

export const selectedCustomerDetail = style({
  fontSize: 14,
  color: text_secondary,
});

export const clearButton = style({
  background: 'transparent',
  border: 'none',
  color: text_muted,
  fontSize: 28,
  cursor: 'pointer',
  padding: 4,
  transition: 'color 0.2s',
  ':hover': {
    color: '#ef4444',
  },
});