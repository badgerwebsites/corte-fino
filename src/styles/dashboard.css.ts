import { style } from "@vanilla-extract/css";

const darker_bg = "#101214";
const dark_bg = "#222222";
const button =  "#96cfe0";
const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";
const border_subtle = "rgba(255,255,255,0.08)";

export const container = style({
  minHeight: "100vh",
  backgroundColor: darker_bg,
  paddingTop: 60,
  paddingBottom: 100,
  gap: 20,
  "@media": {
    "screen and (min-width: 768px)": {
      paddingTop: 78,
    },
  },
});

export const content = style({
  margin: "0 auto",
  padding: "0 16px",

  "@media": {
    "screen and (min-width: 768px)": {
      maxWidth: 960,
    },
    "screen and (min-width: 1200px)": {
      maxWidth: 1000,
    },
  },
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 8,
  marginBottom: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  },
});

export const greeting = style({
  fontSize: 24,
  fontWeight: 600,
  color: text_primary,
  letterSpacing: "-0.02em",
  marginBottom: 8,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 28,
      marginBottom: 0,
    },
  },
});

export const primaryCta = style({
  display: "block",
  maxWidth: 300,
  padding: "12px 16px",
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  backgroundColor: button,
  color: '#1f1f1f',
  border: `1px solid ${border_subtle}`,
  borderRadius: 10,
  cursor: "pointer",
  textDecoration: "none",
  textAlign: "center",
  transition: "all 0.15s",
  // marginTop: 12,
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
  ':active': {
    transform: 'translateY(0)',
  },
});

export const statsRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginBottom: 24,
});

export const section = style({
  marginBottom: 16,
  // marginTop: 8,
});

export const sectionHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const emptyState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: "8px",
  gap: 16,
  // backgroundColor: dark_bg,
  // borderRadius: 16,
  // border: `1px solid ${border_subtle}`,
  // boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
  margin: "0 auto",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "20px",
      gap: 20,
    },
  },
});

export const emptyStateIcon = style({
  width: 68,
  height: 68,
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      width: 80,
      height: 80,
    },
  },
});

export const emptyStateTitle = style({
  fontSize: 20,
  fontWeight: 600,
  color: text_primary,
  letterSpacing: "-0.01em",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 28,
    },
  },
});

export const emptyStateText = style({
  fontSize: 16,
  color: text_secondary,
  lineHeight: 1.5,
  maxWidth: 280,

  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 18,
      maxWidth: 340,
    },
  },
});

export const emptyStateButton = style({
  marginTop: 8,
  padding: "12px",
  fontSize: 16,
  fontWeight: 700,  
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  backgroundColor: button,
  color: '#1f1f1f',
  borderRadius: 10,
  border: `1px solid ${border_subtle}`,
  textDecoration: "none",
  transition: "all 0.15s",
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
  ":active": {
    transform: "translateY(0)",
  },
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "16px",
      fontSize: 20,
    },
  },
});

export const bookingsList = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const bookingCard = style({
  padding: "20px",
  // backgroundColor: dark_bg,
  borderRadius: 16,
  border: `1px solid ${text_secondary}`,
  boxShadow: "0 12px 32px rgba(0,0,0,0.6)",  
  transition: "border-color 0.15s, box-shadow 0.15s",
  ":hover": {
    border: `1px solid ${text_primary}`,
  },
});

export const bookingMain = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
});

export const bookingInfo = style({
  flex: 1,
  minWidth: 0,
});

export const bookingDate = style({
  fontSize: 20,
  fontWeight: 600,
  color: text_primary,
  marginBottom: 6,
  letterSpacing: "-0.01em",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 22,
    },
  },
});

export const bookingMeta = style({
  fontSize: 18,
  color: text_secondary,
  lineHeight: 1.5,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 18,
    },
  },
});

export const bookingTime = style({
  color: text_primary,
  fontWeight: 500,
  fontSize: 20,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 22,
    },
  },
});

export const bookingRight = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 8,
  flexShrink: 0,
});

export const bookingPrice = style({
  fontSize: 20,
  fontWeight: 600,
  color: text_primary,
  letterSpacing: "-0.01em",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 22,
    },
  },
});

export const statusBadge = style({
  padding: "4px 8px",
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 6,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const pending = style({
  backgroundColor: "#fef3c7",
  color: "#92400e",
});

export const confirmed = style({
  backgroundColor: "#dcfce7",
  color: "#166534",
});

export const completed = style({
  backgroundColor: "#f0fdf4",
  color: "#166534",
});

export const cancelled = style({
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
});

export const no_show = style({
  backgroundColor: "#f5f5f5",
  color: "#525252",
});

export const bookingActions = style({
  display: "flex",
  gap: 20,
  marginTop: 16,
  paddingTop: 16,
  borderTop: "1px solid #f5f5f5",
});

export const actionLink = style({
  padding: 0,
  fontSize: 20,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: button,
  border: "none",
  cursor: "pointer",
  transition: "color 0.15s",
  ":hover": {
    color: "#6bb8cf",
  },
});

export const actionLinkDanger = style({
  padding: 0,
  fontSize: 20,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: "#ef4444",
  border: "none",
  cursor: "pointer",
  transition: "color 0.15s",
  ":hover": {
    color: "#dc2626",
  },
});

export const rewardsCard = style({
  display: "flex",
  gap: 20,
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  marginTop: 16,
  marginBottom: 4,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "8px 0px",
      margin: 0,
    },
  },
});

export const rewardsInfo = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

export const rewardsIcon = style({
  width: 28,
  height: 28,
  color: text_primary,
  marginBottom: 4,
});

export const rewardsText = style({
  fontSize: 20,
  color: text_primary,
  fontWeight: 400,
});

export const rewardsPoints = style({
  fontWeight: 600,
  color: text_primary,
});

export const rewardsLink = style({
  padding: "8px 16px",
  fontSize: 14,
  fontWeight: 600,  
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: text_primary,
  borderRadius: 10,
  border: `2px solid ${text_primary}`,
  textDecoration: "none",
  transition: "all 0.15s",
  ':hover': {
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
    color: button,
    borderRadius: 10,
    border: `2px solid ${button}`,
  },
  ":active": {
    transform: "translateY(0)",
  },
});

export const adminLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 13,
  color: "#737373",
  textDecoration: "none",
  fontWeight: 500,
  padding: "12px 16px",
  backgroundColor: "#ffffff",
  borderRadius: 8,
  border: "1px solid #f0f0f0",
  transition: "all 0.15s",
  ":hover": {
    backgroundColor: "#fafafa",
    borderColor: "#e5e5e5",
    color: "#0a0a0a",
  },
});

export const modalOverlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 20,
});

export const modal = style({
  backgroundColor: dark_bg,
  borderRadius: 16,
  padding: 20,
  maxWidth: 380,
  width: "100%",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.16)",
  border: `1px solid ${border_subtle}`,
});

export const modalTitleRow = style({
  width: "100%",
  display: "flex",
  justifyContent: "center",
});

export const modalTitle = style({
  fontSize: 22,
  fontWeight: 600,
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 24,
    },
  },
});

export const modalBookingInfo = style({
  display: "flex",
  flexDirection: "column",
  gap: 6,                
  padding: 16,
  border: `1px solid ${text_primary}`,
  borderRadius: 12,
  marginTop: 12,
  marginBottom: 12,
});

export const modalBookingDate = style({
  fontSize: 18,
  fontWeight: 600,
  color: text_primary,
  marginBottom: 4,
});

export const modalBookingTime = style({
  fontSize: 16,
  color: text_secondary,
});

export const nofeeWarning = style({
  flexDirection: "column",
  textAlign: 'center',
});

export const feeWarning = style({
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: "14px 16px",
  backgroundColor: "#fee2e2",
  borderRadius: 10,
  marginBottom: 16,
});

export const feeWarningTitle = style({
  fontSize: 14,
  fontWeight: 600,
  color: "#991b1b",
});

export const feeWarningText = style({
  fontSize: 13,
  color: "#7f1d1d",
  lineHeight: 1.5,
});

export const nofeeText = style({
  fontSize: 16,
  color: text_muted,
});

export const modalActions = style({
  display: "flex",
  gap: 12,
  marginTop: 16,
});

export const modalKeepButton = style({
  flex: 1,
  padding: "12px 16px",
  fontSize: 16,
  fontWeight: 500,
  backgroundColor: button,
  color: '#1f1f1f',
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.15s",
  ":hover": {
    backgroundColor: "#6bb8cf",
  },
  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

export const modalCancelButton = style({
  flex: 1,
  padding: "12px 16px",
  fontSize: 16,
  fontWeight: 500,
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.15s",
  ":hover": {
    backgroundColor: "#b91c1c",
  },
  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

// Recurring booking styles
export const recurringBadge = style({
  display: "inline-block",
  marginTop: 8,
  padding: "8px 10px",
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: 'rgba(34, 197, 94, 0.18)',
  color: '#22c55e',
  borderRadius: 6,
  letterSpacing: "0.02em",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 15,
    },
  },
});

export const remainingText = style({
  '@media': {
    'screen and (max-width: 767px)': {
      display: 'block',
      marginTop: 2,
    },
  },
});

export const recurringList = style({
  marginTop: 4,
  maxHeight: 200,
  overflowY: "auto",
});

export const recurringItem = style({
  padding: "8px 0",
  borderBottom: `1px solid ${border_subtle}`,
  ":last-child": {
    borderBottom: "none",
  },
});

export const recurringItemDate = style({
  fontSize: 14,
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 15,
    },
  },
});

// Cancel modal options for recurring
export const cancelOptions = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 12,
  marginBottom: 12,
});

export const cancelOptionButton = style({
  padding: "14px 16px",
  fontSize: 15,
  fontWeight: 500,
  backgroundColor: 'transparent',
  color: text_primary,
  border: `1px solid ${text_secondary}`,
  borderRadius: 8,
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.15s",
  ":hover": {
    borderColor: button,
    backgroundColor: "rgba(150, 207, 224, 0.1)",
  },
});

export const cancelOptionButtonDanger = style({
  padding: "14px 16px",
  fontSize: 15,
  fontWeight: 500,
  backgroundColor: 'transparent',
  color: "#ef4444",
  border: "1px solid #ef4444",
  borderRadius: 8,
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.15s",
  ":hover": {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
});

export const cancelOptionLabel = style({
  display: "block",
  fontWeight: 600,
  marginBottom: 2,
});

export const cancelOptionDesc = style({
  display: "block",
  fontSize: 13,
  color: text_muted,
  fontWeight: 400,
});

