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
  padding: 16,
  paddingTop: 68,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 24,
      paddingTop: 88,
    },
  },
});

export const howItWorks = style({
  flex: 1,
  // padding: 16,
  marginBottom: 20,
});

export const stepsList = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 24,
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 24,
    },
  },
});

export const step = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: 12,
});

export const stepNumber = style({
  width: 48,
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: text_primary,
  color: "#1a1a1a",
  fontSize: 24,
  fontWeight: 500,
  borderRadius: "50%",
});

export const stepText = style({
  fontSize: 16,
  color: text_primary,
  fontWeight: 300,
});

// Redemption Code Modal
export const codeModal = style({
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
  padding: 16,
});

export const codeModalContent = style({
  backgroundColor: dark_bg,
  borderRadius: 16,
  padding: 20,
  maxWidth: 400,
  width: "100%",
  textAlign: "center",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
  border: `1px solid ${border_subtle}`,
});

export const codeModalTitle = style({
  fontSize: 24,
  fontWeight: 600,
  color: text_primary,
});

export const codeDisplay = style({
  backgroundColor: "#f0f9ff",
  border: "3px dashed #0ea5e9",
  borderRadius: 8,
  padding: "16px 20px",
  marginTop: 16,
  marginBottom: 12,
});

export const codeText = style({
  fontSize: 36,
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: "#0369a1",
  fontFamily: "monospace",
});

export const codeModalHint = style({
  fontSize: 16,
  color: text_secondary,
});

export const codeModalButton = style({
  padding: "12px 24px",
  fontSize: 18,
  fontWeight: 500,
  backgroundColor: button,
  color: "#1a1a1a",
  borderRadius: 8,
  border: `1px solid ${text_muted}`,
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginTop: 12,
  letterSpacing: "0.05em",
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
  ":active": {
    transform: "translateY(0)",
  },
});

// Pending Redemptions
export const pendingSection = style({
  maxWidth: 1200,
  margin: "0 auto 16px",
  padding: 20,
  backgroundColor: dark_bg,
  borderRadius: 8,
  border: `1px solid ${border_subtle}`,
  boxShadow: "0 12px 32px rgba(0,0,0,0.6)",  
  textAlign: 'center',
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
    borderColor: text_muted,
  },
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 24,
      padding: 20,
      textAlign: 'left',
    },
  },
});

export const pendingTitle = style({
  fontSize: 22,
  fontWeight: 500,
  color: button,
  flex: 1,
  letterSpacing: "-0.01em",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 28,
    },
  },
});

export const pendingList = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 12,
});

export const pendingCard = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  gap: 12,
  marginTop: 12,
  width: "100%",
  "@media": {
    "screen and (min-width: 768px)": {
      flexDirection: "row",
      textAlign: "left",
      gap: 40,
      marginTop: 16,
    },
  },
});

export const pendingInfo = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  "@media": {
    "screen and (min-width: 768px)": {
      alignItems: "flex-start",
    },
  },
});

export const pendingReward = style({
  fontSize: 20,
  fontWeight: 600,
  color: text_primary,
});

export const pendingPoints = style({
  fontSize: 18,
  color: text_secondary,
});

export const pendingCodeBox = style({
  backgroundColor: "#f0f9ff",
  border: "3px dashed #0ea5e9",
  borderRadius: 8,
  padding: "8px 16px",
});

export const pendingCode = style({
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: "0.15em",
  color: "#0369a1",
});

export const cancelButton = style({
  padding: "8px 16px",
  fontSize: 20,
  fontWeight: 700,
  backgroundColor: "transparent",
  color: "#dc2626",
  border: "3px solid #dc2626",
  borderRadius: 8,
  cursor: "pointer",
  ":hover": {
    borderColor: "#b91c1c",
    color: "#b91c1c",
  },
});

// Rewards Card
export const rewardsGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
  maxWidth: 1200,
  margin: "0 auto 12px",
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 24,
      marginBottom: 24,
    },
  },
});

export const rewardCard = style({
  padding: 20,
  backgroundColor: dark_bg,
  borderRadius: 8,
  border: `1px solid ${border_subtle}`,
  boxShadow: "0 12px 32px rgba(0,0,0,0.6)",  
  display: "flex",
  flexDirection: "column",
  gap: 14,
  transition: "all 0.3s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 24,
      gap: 16,
    },
  },
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
    borderColor: text_muted,
  },
});

export const rewardHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
});

export const rewardName = style({
  fontSize: 20,
  fontWeight: 500,
  color: text_primary,
  flex: 1,
});

export const pointsBadge = style({
  padding: "6px 12px",
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 500,
  borderRadius: 4,
  border: `1px solid ${text_muted}`,
  whiteSpace: "nowrap",
});

export const rewardDescription = style({
  fontSize: 16,
  color: text_secondary,
  fontWeight: 300,
});

export const progressBar = style({
  width: "100%",
  height: 8,
  backgroundColor: "#000",
  borderRadius: 4,
  overflow: "hidden",
});

export const progressFill = style({
  height: "100%",
  backgroundColor: "#f1f1f1",
  transition: "width 0.3s ease",
});

export const progressText = style({
  fontSize: 14,
  color: text_secondary,
  textAlign: "center",
  fontWeight: 400,
});

export const redeemButton = style({
  padding: "12px 24px",
  fontSize: 16,
  fontWeight: 500,
  backgroundColor: button,
  color: "#1a1a1a",
  borderRadius: 8,
  border: `1px solid ${text_muted}`,
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginTop: "auto",
  letterSpacing: "0.05em",
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
  ":active": {
    transform: "translateY(0)",
  },
});

export const disabled = style({
  opacity: 0.75,
  cursor: "not-allowed",
  backgroundColor: darker_bg,
  color: text_primary,
  ":hover": {
    transform: "none",
    boxShadow: "none",
  },
});

export const backLink = style({
  // maxWidth: 1200,
  margin: "0 auto",
  position: "fixed",
  // textAlign: "center",
});

export const link = style({
  color: text_primary,
  textDecoration: "none",
  fontSize: 20,
  fontWeight: 400,
  transition: "opacity 0.2s",
  ":hover": {
    opacity: 0.6,
  },
});