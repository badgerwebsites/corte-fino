import { style, keyframes } from "@vanilla-extract/css";

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideInUp = keyframes({
  from: { opacity: 0, transform: "translateY(20px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const container = style({
  minHeight: "100vh",
  backgroundColor: "#fafafa",
  color: "#1a1a1a",
  padding: 16,
  paddingTop: 72,
  animation: `${fadeIn} 0.5s ease-out`,
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
  display: "flex",
  flexDirection: "column",
  gap: 12,
  animation: `${slideInUp} 0.6s ease-out`,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 48,
      gap: 16,
    },
  },
});

export const title = style({
  fontSize: 32,
  fontWeight: 300,
  letterSpacing: "-0.01em",
  color: "#1a1a1a",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 48,
    },
  },
});

export const subtitle = style({
  fontSize: 16,
  color: "#666",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 18,
    },
  },
});

export const comingSoon = style({
  maxWidth: 800,
  margin: "0 auto",
  padding: 48,
  backgroundColor: "#ffffff",
  borderRadius: 2,
  border: "1px solid #e5e5e5",
  textAlign: "center",
});

export const comingSoonText = style({
  fontSize: 24,
  fontWeight: 500,
  color: "#1a1a1a",
  marginBottom: 24,
});

export const featureList = style({
  textAlign: "left",
  display: "inline-block",
  fontSize: 16,
  lineHeight: 2,
  color: "#666",
  marginTop: 24,
});

export const backLink = style({
  maxWidth: 1200,
  margin: "48px auto 0",
  textAlign: "center",
  color: "#1a1a1a",
  textDecoration: "none",
  fontSize: 16,
  fontWeight: 400,
  transition: "opacity 0.2s",
  ":hover": {
    opacity: 0.6,
  },
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

// Progress Bar Styles
export const progressBar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: 800,
  margin: "0 auto 32px",
  padding: "0 16px",
  animation: `${slideInUp} 0.7s ease-out`,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 48,
      padding: "0 24px",
    },
  },
});

export const progressStep = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  opacity: 0.3,
  transition: "all 0.3s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 8,
    },
  },
});

export const progressStepActive = style({
  opacity: 1,
});

export const progressNumber = style({
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: "#ffffff",
  border: "2px solid #e5e5e5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  fontSize: 14,
  color: "#1a1a1a",
  transition: "all 0.3s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      width: 40,
      height: 40,
      fontSize: 16,
    },
  },
  selectors: {
    [`${progressStepActive} &`]: {
      borderColor: "#1a1a1a",
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
    },
  },
});

export const progressLabel = style({
  fontSize: 10,
  color: "#666",
  textAlign: "center",
  fontWeight: 400,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 12,
    },
  },
});

export const progressLine = style({
  width: 40,
  height: 2,
  backgroundColor: "#e5e5e5",
  margin: "0 4px",
  marginBottom: 18,
  transition: "background-color 0.3s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      width: 80,
      margin: "0 8px",
      marginBottom: 24,
    },
  },
});

// Step Container
export const stepContainer = style({
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 16px",
  animation: `${slideInUp} 0.5s ease-out`,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "0 24px",
    },
  },
});

export const stepTitle = style({
  fontSize: 24,
  fontWeight: 300,
  marginBottom: 10,
  textAlign: "center",
  letterSpacing: "-0.01em",
  color: "#1a1a1a",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 32,
      marginBottom: 12,
    },
  },
});

export const stepSubtitle = style({
  fontSize: 14,
  color: "#666",
  textAlign: "center",
  marginBottom: 24,
  fontWeight: 300,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
      marginBottom: 32,
    },
  },
});

// Service Selection Styles
export const serviceGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
  marginTop: 24,
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 24,
      marginTop: 32,
    },
  },
});

export const serviceCard = style({
  padding: 24,
  backgroundColor: "#ffffff",
  borderRadius: 4,
  border: "1px solid #e5e5e5",
  cursor: "pointer",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 32,
    },
  },
  ":hover": {
    borderColor: "#1a1a1a",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
  },
  ":active": {
    transform: "scale(0.98)",
  },
});

export const serviceName = style({
  fontSize: 20,
  fontWeight: 500,
  marginBottom: 12,
  color: "#1a1a1a",
});

export const serviceDescription = style({
  fontSize: 14,
  color: "#666",
  marginBottom: 16,
  lineHeight: 1.5,
  fontWeight: 300,
});

export const serviceDuration = style({
  fontSize: 14,
  color: "#1a1a1a",
  marginBottom: 8,
  fontWeight: 400,
});

export const servicePoints = style({
  fontSize: 14,
  color: "#666",
  fontWeight: 400,
});

// Barber Selection Styles
export const barberGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
  marginTop: 24,
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 24,
      marginTop: 32,
    },
  },
});

export const barberCard = style({
  padding: 24,
  backgroundColor: "#ffffff",
  borderRadius: 4,
  border: "1px solid #e5e5e5",
  cursor: "pointer",
  transition: "all 0.3s ease",
  position: "relative",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 32,
    },
  },
  ":hover": {
    borderColor: "#1a1a1a",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
  },
  ":active": {
    transform: "scale(0.98)",
  },
});

export const barberName = style({
  fontSize: 18,
  fontWeight: 500,
  marginBottom: 12,
  color: "#1a1a1a",
});

export const barberBio = style({
  fontSize: 14,
  color: "#666",
  marginBottom: 12,
  lineHeight: 1.5,
  fontWeight: 300,
});

export const barberSocial = style({
  fontSize: 14,
  color: "#1a1a1a",
  fontWeight: 400,
});

// Date & Time Selection Styles
export const dateTimeContainer = style({
  marginTop: 24,
  "@media": {
    "screen and (min-width: 768px)": {
      marginTop: 32,
    },
  },
});

export const dateSection = style({
  marginBottom: 24,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 32,
    },
  },
});

export const timeSection = style({
  marginBottom: 24,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 32,
    },
  },
});

export const sectionLabel = style({
  fontSize: 16,
  fontWeight: 500,
  marginBottom: 12,
  color: "#1a1a1a",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 18,
      marginBottom: 16,
    },
  },
});

export const dateGrid = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  maxHeight: 400,
  overflowY: "auto",
});

export const dateButton = style({
  padding: 16,
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  borderRadius: 4,
  color: "#1a1a1a",
  fontSize: 16,
  cursor: "pointer",
  textAlign: "left",
  transition: "all 0.2s ease",
  fontWeight: 400,
  ":hover": {
    borderColor: "#1a1a1a",
    transform: "translateX(4px)",
  },
});

export const dateButtonActive = style({
  borderColor: "#1a1a1a",
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  ":hover": {
    transform: "translateX(0)",
  },
});

export const timeGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
  gap: 10,
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
      gap: 12,
    },
  },
});

export const timeButton = style({
  padding: 10,
  backgroundColor: "#ffffff",
  border: "1px solid #e5e5e5",
  borderRadius: 4,
  color: "#1a1a1a",
  fontSize: 13,
  cursor: "pointer",
  textAlign: "center",
  transition: "all 0.2s ease",
  fontWeight: 400,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 12,
      fontSize: 14,
    },
  },
  ":hover": {
    borderColor: "#1a1a1a",
  },
  ":active": {
    transform: "scale(0.95)",
  },
});

export const timeButtonActive = style({
  borderColor: "#1a1a1a",
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
});

// Confirmation Styles
export const confirmCard = style({
  marginTop: 24,
  padding: 24,
  backgroundColor: "#ffffff",
  borderRadius: 4,
  border: "1px solid #e5e5e5",
  maxWidth: 600,
  margin: "24px auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  "@media": {
    "screen and (min-width: 768px)": {
      marginTop: 32,
      padding: 40,
      margin: "32px auto",
    },
  },
});

export const confirmSection = style({
  marginBottom: 24,
  paddingBottom: 24,
  borderBottom: "1px solid #f0f0f0",
});

export const confirmLabel = style({
  fontSize: 11,
  color: "#999",
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 600,
});

export const confirmValue = style({
  fontSize: 20,
  fontWeight: 500,
  color: "#1a1a1a",
  marginBottom: 4,
});

export const confirmDetail = style({
  fontSize: 14,
  color: "#666",
  fontWeight: 300,
});

export const priceAmount = style({
  fontSize: 36,
  fontWeight: 300,
  color: "#1a1a1a",
  marginBottom: 8,
});

export const policySection = style({
  padding: 20,
  backgroundColor: "#fafafa",
  borderRadius: 4,
  border: "1px solid #e5e5e5",
  marginBottom: 24,
});

export const policyTitle = style({
  fontSize: 14,
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: 12,
});

export const policyText = style({
  fontSize: 13,
  color: "#666",
  lineHeight: 1.6,
  fontWeight: 300,
});

// Button Styles
export const buttonGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 12,
    },
  },
});

export const backButton = style({
  padding: "12px 20px",
  backgroundColor: "transparent",
  border: "1px solid #e5e5e5",
  borderRadius: 4,
  color: "#666",
  fontSize: 15,
  fontWeight: 400,
  cursor: "pointer",
  transition: "all 0.2s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "12px 24px",
      fontSize: 16,
    },
  },
  ":hover": {
    borderColor: "#1a1a1a",
    color: "#1a1a1a",
  },
});

export const confirmButton = style({
  padding: "14px 28px",
  backgroundColor: "#1a1a1a",
  border: "none",
  borderRadius: 4,
  color: "#ffffff",
  fontSize: 15,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.3s ease",
  letterSpacing: "0.05em",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "16px 32px",
      fontSize: 16,
    },
  },
  ":hover": {
    backgroundColor: "#333",
  },
  ":active": {
    transform: "scale(0.98)",
  },
});

export const cancelButton = style({
  padding: "12px 20px",
  backgroundColor: "transparent",
  border: "1px solid #e5e5e5",
  borderRadius: 4,
  color: "#666",
  fontSize: 15,
  fontWeight: 400,
  cursor: "pointer",
  transition: "all 0.2s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "12px 24px",
      fontSize: 16,
    },
  },
  ":hover": {
    borderColor: "#999",
    color: "#999",
  },
});
