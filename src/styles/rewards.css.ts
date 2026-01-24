import { style } from "@vanilla-extract/css";

export const container = style({
  minHeight: "100vh",
  backgroundColor: "#fafafa",
  color: "#1a1a1a",
  padding: 16,
  paddingTop: 72,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 24,
      paddingTop: 84,
    },
  },
});

export const header = style({
  maxWidth: 1200,
  margin: "0 auto 32px",
  textAlign: "center",
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 48,
    },
  },
});

export const title = style({
  fontSize: 32,
  fontWeight: 300,
  marginBottom: 12,
  color: "#1a1a1a",
  letterSpacing: "-0.01em",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 48,
      marginBottom: 16,
    },
  },
});

export const subtitle = style({
  fontSize: 16,
  color: "#666",
  marginBottom: 24,
  fontWeight: 300,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 18,
      marginBottom: 32,
    },
  },
});

export const pointsDisplay = style({
  display: "inline-block",
  padding: "20px 32px",
  backgroundColor: "#ffffff",
  borderRadius: 4,
  border: "2px solid #1a1a1a",
  marginTop: 20,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "24px 48px",
      marginTop: 24,
    },
  },
});

export const pointsValue = style({
  fontSize: 48,
  fontWeight: 300,
  color: "#1a1a1a",
  textAlign: "center",
  marginBottom: 6,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 64,
      marginBottom: 8,
    },
  },
});

export const pointsLabel = style({
  fontSize: 12,
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  textAlign: "center",
  fontWeight: 500,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 14,
    },
  },
});

export const howItWorks = style({
  maxWidth: 1200,
  margin: "0 auto 48px",
  padding: 24,
  backgroundColor: "#ffffff",
  borderRadius: 4,
  border: "1px solid #e5e5e5",
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 64,
      padding: 32,
    },
  },
});

export const sectionTitle = style({
  fontSize: 20,
  fontWeight: 300,
  marginBottom: 20,
  textAlign: "center",
  color: "#1a1a1a",
  letterSpacing: "-0.01em",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 24,
      marginBottom: 24,
    },
  },
});

export const stepsList = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 20,
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
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  fontSize: 24,
  fontWeight: 500,
  borderRadius: "50%",
});

export const stepText = style({
  fontSize: 16,
  color: "#666",
  fontWeight: 300,
});

export const rewardsGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
  maxWidth: 1200,
  margin: "0 auto 32px",
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: 24,
      marginBottom: 48,
    },
  },
});

export const rewardCard = style({
  padding: 20,
  backgroundColor: "#ffffff",
  borderRadius: 4,
  border: "1px solid #e5e5e5",
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
    borderColor: "#1a1a1a",
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
  color: "#1a1a1a",
  flex: 1,
});

export const pointsBadge = style({
  padding: "6px 12px",
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 500,
  borderRadius: 2,
  whiteSpace: "nowrap",
});

export const rewardDescription = style({
  fontSize: 14,
  color: "#666",
  lineHeight: 1.5,
  fontWeight: 300,
});

export const progressBar = style({
  width: "100%",
  height: 8,
  backgroundColor: "#f0f0f0",
  borderRadius: 4,
  overflow: "hidden",
});

export const progressFill = style({
  height: "100%",
  backgroundColor: "#1a1a1a",
  transition: "width 0.3s ease",
});

export const progressText = style({
  fontSize: 12,
  color: "#666",
  textAlign: "center",
  fontWeight: 400,
});

export const redeemButton = style({
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  border: "none",
  borderRadius: 2,
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginTop: "auto",
  letterSpacing: "0.05em",
  ":hover": {
    backgroundColor: "#333",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },
  ":active": {
    transform: "translateY(0)",
  },
});

export const disabled = style({
  opacity: 0.5,
  cursor: "not-allowed",
  ":hover": {
    backgroundColor: "#1a1a1a",
    transform: "none",
    boxShadow: "none",
  },
});

export const signInPrompt = style({
  maxWidth: 600,
  margin: "48px auto",
  padding: 32,
  backgroundColor: "#ffffff",
  borderRadius: 4,
  border: "1px solid #e5e5e5",
  textAlign: "center",
});

export const signInButton = style({
  display: "inline-block",
  marginTop: 16,
  padding: "12px 32px",
  fontSize: 16,
  fontWeight: 500,
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  border: "none",
  borderRadius: 2,
  textDecoration: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  letterSpacing: "0.05em",
  ":hover": {
    backgroundColor: "#333",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },
  ":active": {
    transform: "translateY(0)",
  },
});

export const backLink = style({
  maxWidth: 1200,
  margin: "0 auto",
  textAlign: "center",
});

export const link = style({
  color: "#1a1a1a",
  textDecoration: "none",
  fontSize: 16,
  fontWeight: 400,
  transition: "opacity 0.2s",
  ":hover": {
    opacity: 0.6,
  },
});

// Redemption Code Modal
export const codeModal = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 16,
});

export const codeModalContent = style({
  backgroundColor: "#ffffff",
  borderRadius: 8,
  padding: 32,
  maxWidth: 400,
  width: "100%",
  textAlign: "center",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
});

export const codeModalTitle = style({
  fontSize: 24,
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: 8,
});

export const codeModalSubtitle = style({
  fontSize: 14,
  color: "#666",
  marginBottom: 24,
});

export const codeDisplay = style({
  backgroundColor: "#f0f9ff",
  border: "2px dashed #0ea5e9",
  borderRadius: 8,
  padding: "20px 24px",
  marginBottom: 16,
});

export const codeText = style({
  fontSize: 36,
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: "#0369a1",
  fontFamily: "monospace",
});

export const codeModalHint = style({
  fontSize: 13,
  color: "#64748b",
  marginBottom: 24,
});

export const codeModalButton = style({
  padding: "12px 32px",
  fontSize: 16,
  fontWeight: 500,
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  transition: "all 0.2s ease",
  ":hover": {
    backgroundColor: "#333",
  },
});

// Pending Redemptions Section
export const pendingSection = style({
  maxWidth: 1200,
  margin: "0 auto 32px",
  padding: 24,
  backgroundColor: "#f0f9ff",
  borderRadius: 8,
  border: "1px solid #bae6fd",
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 48,
      padding: 32,
    },
  },
});

export const pendingHint = style({
  fontSize: 14,
  color: "#0369a1",
  textAlign: "center",
  marginBottom: 20,
});

export const pendingList = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
});

export const pendingCard = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 12,
  padding: 16,
  backgroundColor: "#ffffff",
  borderRadius: 6,
  border: "1px solid #e2e8f0",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 20,
    },
  },
});

export const pendingInfo = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

export const pendingReward = style({
  fontSize: 16,
  fontWeight: 600,
  color: "#1a1a1a",
});

export const pendingPoints = style({
  fontSize: 13,
  color: "#64748b",
});

export const pendingCodeBox = style({
  backgroundColor: "#f0f9ff",
  border: "1px solid #0ea5e9",
  borderRadius: 4,
  padding: "8px 16px",
});

export const pendingCode = style({
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: "0.15em",
  color: "#0369a1",
  fontFamily: "monospace",
});

export const cancelButton = style({
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: "#64748b",
  border: "1px solid #e2e8f0",
  borderRadius: 4,
  cursor: "pointer",
  transition: "all 0.2s",
  ":hover": {
    borderColor: "#ef4444",
    color: "#ef4444",
  },
});
