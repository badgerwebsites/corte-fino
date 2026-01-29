import { style } from "@vanilla-extract/css";

const darker_bg = "#101214";
const dark_bg = "#222222";
const button =  "#96cfe0";


const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";

const border_subtle = "rgba(255,255,255,0.08)";
// const border_hover = "rgba(255,255,255,0.18)";

export const container = style({
  minHeight: "100vh",
  backgroundColor: dark_bg,
  paddingTop: 72,
  paddingBottom: 32,

  "@media": {
    "screen and (min-width: 768px)": {
      paddingTop: 88,
    },
  },
});

export const content = style({
  margin: "0 auto",
  padding: "0 16px",

  "@media": {
    "screen and (min-width: 768px)": {
      maxWidth: 960,
      // padding: "0 24px",
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
  // gap: 12,
  // marginBottom: 16,

  "@media": {
    "screen and (min-width: 768px)": {
      flexDirection: "row",
      justifyContent: "space-between",
      // alignItems: "center",
    },
  },
});

export const greeting = style({
  fontSize: 24,
  fontWeight: 600,
  color: text_primary,
  letterSpacing: "-0.02em",
  marginBottom: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 28,
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
  color: '#f5f5f5',
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  textDecoration: "none",
  textAlign: "center",
  transition: "all 0.15s",
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

export const stat = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  border: "1px solid #f0f0f0",
});

export const statValue = style({
  fontSize: 28,
  fontWeight: 600,
  color: "#0a0a0a",
  letterSpacing: "-0.02em",
  lineHeight: 1,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 32,
    },
  },
});

export const statValueMuted = style({
  fontSize: 14,
  fontWeight: 500,
  color: "#a3a3a3",
  lineHeight: 1.3,
});

export const statLabel = style({
  fontSize: 13,
  color: "#737373",
  fontWeight: 400,
  marginTop: 4,
});

export const section = style({
  marginBottom: 24,
});

export const sectionHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
});

export const sectionTitle = style({
  fontSize: 15,
  fontWeight: 600,
  color: "#0a0a0a",
  letterSpacing: "-0.01em",
});

// export const emptyState = style({
//   padding: "48px 24px",
//   textAlign: "center",
//   backgroundColor: "#ffffff",
//   borderRadius: 16,
//   border: "1px solid #f0f0f0",
// });

export const emptyState = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",

  padding: "40px 20px",
  gap: 16,
  backgroundColor: darker_bg,
  borderRadius: 16,
  border: `1px solid ${border_subtle}`,
  boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
  margin: "0 auto",
  // maxWidth: 420,

  "@media": {
    "screen and (min-width: 768px)": {
      padding: "56px 32px",
      gap: 20,
      // maxWidth: 520,
    },
  },
});

// export const emptyStateIcon = style({
//   width: 56,
//   height: 56,
//   marginBottom: 20,
//   opacity: 0.3,
// });

export const emptyStateIcon = style({
  width: 48,
  height: 48,
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      width: 80,
      height: 80,
    },
  },
});

// export const emptyStateTitle = style({
//   fontSize: 17,
//   fontWeight: 600,
//   color: "#0a0a0a",
//   marginBottom: 8,
//   letterSpacing: "-0.01em",
// });

export const emptyStateTitle = style({
  fontSize: 20,
  fontWeight: 600,
  color: text_secondary,
  letterSpacing: "-0.01em",
});

// export const emptyStateText = style({
//   fontSize: 14,
//   color: "#737373",
//   marginBottom: 24,
//   maxWidth: 260,
//   marginLeft: "auto",
//   marginRight: "auto",
//   lineHeight: 1.5,
// });

export const emptyStateText = style({
  fontSize: 14,
  color: text_muted,
  lineHeight: 1.5,
  maxWidth: 280,

  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 15,
      maxWidth: 340,
    },
  },
});

// export const emptyStateButton = style({
//   display: "inline-block",
//   padding: "12px 28px",
//   fontSize: 14,
//   fontWeight: 500,
//   backgroundColor: "#0a0a0a",
//   color: "#ffffff",
//   border: "none",
//   borderRadius: 8,
//   cursor: "pointer",
//   textDecoration: "none",
//   transition: "all 0.15s",
//   ":hover": {
//     backgroundColor: "#262626",
//   },
// });

export const emptyStateButton = style({
  marginTop: 8,
  padding: "12px 28px",
  fontSize: 18,
  fontWeight: 700,  
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  backgroundColor: button,
  color: '#1f1f1f',
  borderRadius: 10,
  textDecoration: "none",
  transition: "all 0.15s",
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
  ":active": {
    transform: "translateY(0)",
  },
});

export const bookingsList = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});

export const bookingCard = style({
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: 12,
  border: "1px solid #f0f0f0",
  transition: "border-color 0.15s, box-shadow 0.15s",
  ":hover": {
    borderColor: "#e5e5e5",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
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
  fontSize: 16,
  fontWeight: 600,
  color: "#0a0a0a",
  marginBottom: 6,
  letterSpacing: "-0.01em",
});

export const bookingMeta = style({
  fontSize: 14,
  color: "#525252",
  lineHeight: 1.5,
  display: "flex",
  flexDirection: "column",
  gap: 2,
});

export const bookingTime = style({
  color: "#0a0a0a",
  fontWeight: 500,
});

export const bookingRight = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 8,
  flexShrink: 0,
});

export const bookingPrice = style({
  fontSize: 16,
  fontWeight: 600,
  color: "#0a0a0a",
  letterSpacing: "-0.01em",
});

export const statusBadge = style({
  padding: "4px 10px",
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 6,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
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
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: "#0a0a0a",
  border: "none",
  cursor: "pointer",
  transition: "color 0.15s",
  ":hover": {
    color: "#525252",
  },
});

export const actionLinkDanger = style({
  padding: 0,
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: "#a3a3a3",
  border: "none",
  cursor: "pointer",
  transition: "color 0.15s",
  ":hover": {
    color: "#dc2626",
  },
});

export const rewardsCard = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 12px",
  backgroundColor: darker_bg,
  borderRadius: 16,
  border: `1px solid ${border_subtle}`,
  boxShadow: "0 12px 32px rgba(0,0,0,0.6)",  
  gap: 16,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "16px 20px",
    },
  },
});

export const rewardsInfo = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

export const rewardsIcon = style({
  width: 30,
  height: 30,
  opacity: 0.6,
  color: text_primary,
});

export const rewardsText = style({
  fontSize: 18,
  color: text_secondary,
  fontWeight: 400,
});

export const rewardsPoints = style({
  fontWeight: 600,
  color: text_secondary,
});

export const rewardsLink = style({
  padding: "8px 16px",
  fontSize: 14,
  fontWeight: 600,  
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  backgroundColor: button,
  color: '#1f1f1f',
  borderRadius: 10,
  textDecoration: "none",
  transition: "all 0.15s",
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
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
  backgroundColor: "#ffffff",
  borderRadius: 16,
  padding: 24,
  maxWidth: 380,
  width: "100%",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.16)",
});

export const modalTitle = style({
  fontSize: 18,
  fontWeight: 600,
  color: "#0a0a0a",
  marginBottom: 20,
  letterSpacing: "-0.01em",
});

export const modalBookingInfo = style({
  padding: 16,
  backgroundColor: "#fafafa",
  borderRadius: 10,
  marginBottom: 20,
});

export const modalBookingDate = style({
  fontSize: 15,
  fontWeight: 600,
  color: "#0a0a0a",
  marginBottom: 4,
});

export const modalBookingTime = style({
  fontSize: 14,
  color: "#737373",
});

export const feeWarning = style({
  padding: 16,
  backgroundColor: "#fef3c7",
  borderRadius: 10,
  marginBottom: 24,
});

export const feeWarningTitle = style({
  fontSize: 14,
  fontWeight: 600,
  color: "#92400e",
  marginBottom: 4,
});

export const feeWarningText = style({
  fontSize: 13,
  color: "#a16207",
  lineHeight: 1.5,
});

export const nofeeText = style({
  fontSize: 14,
  color: "#737373",
  marginBottom: 24,
  lineHeight: 1.5,
});

export const modalActions = style({
  display: "flex",
  gap: 12,
});

export const modalCancelButton = style({
  flex: 1,
  padding: "14px 16px",
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: "#f5f5f5",
  color: "#525252",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.15s",
  ":hover": {
    backgroundColor: "#e5e5e5",
  },
  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

export const modalConfirmButton = style({
  flex: 1,
  padding: "14px 16px",
  fontSize: 14,
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

export const loadingText = style({
  color: "#737373",
  fontSize: 14,
  textAlign: "center",
  padding: "40px 0",
});
