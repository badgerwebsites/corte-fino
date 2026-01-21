import { style } from "@vanilla-extract/css";

export const container = style({
  minHeight: "100vh",
  backgroundColor: "#0e0e0e",
  color: "#ffffff",
  padding: 24,
});

export const header = style({
  maxWidth: 1200,
  margin: "0 auto 48px",
  textAlign: "center",
});

export const title = style({
  fontSize: 48,
  fontWeight: 700,
  marginBottom: 16,
  color: "#ffffff",
});

export const subtitle = style({
  fontSize: 18,
  color: "#888",
  marginBottom: 32,
});

export const pointsDisplay = style({
  display: "inline-block",
  padding: "24px 48px",
  backgroundColor: "#1a1a1a",
  borderRadius: 12,
  border: "2px solid #dc2626",
  marginTop: 24,
});

export const pointsValue = style({
  fontSize: 64,
  fontWeight: 700,
  color: "#dc2626",
  textAlign: "center",
  marginBottom: 8,
});

export const pointsLabel = style({
  fontSize: 14,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  textAlign: "center",
});

export const howItWorks = style({
  maxWidth: 1200,
  margin: "0 auto 64px",
  padding: 32,
  backgroundColor: "#1a1a1a",
  borderRadius: 12,
  border: "1px solid #2a2a2a",
});

export const sectionTitle = style({
  fontSize: 24,
  fontWeight: 700,
  marginBottom: 24,
  textAlign: "center",
  color: "#ffffff",
});

export const stepsList = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 24,
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
  backgroundColor: "#dc2626",
  color: "#ffffff",
  fontSize: 24,
  fontWeight: 700,
  borderRadius: "50%",
});

export const stepText = style({
  fontSize: 16,
  color: "#e0e0e0",
});

export const rewardsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: 24,
  maxWidth: 1200,
  margin: "0 auto 48px",
});

export const rewardCard = style({
  padding: 24,
  backgroundColor: "#1a1a1a",
  borderRadius: 12,
  border: "1px solid #2a2a2a",
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const rewardHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
});

export const rewardName = style({
  fontSize: 20,
  fontWeight: 700,
  color: "#ffffff",
  flex: 1,
});

export const pointsBadge = style({
  padding: "6px 12px",
  backgroundColor: "#dc2626",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 6,
  whiteSpace: "nowrap",
});

export const rewardDescription = style({
  fontSize: 14,
  color: "#888",
  lineHeight: 1.5,
});

export const progressBar = style({
  width: "100%",
  height: 8,
  backgroundColor: "#2a2a2a",
  borderRadius: 4,
  overflow: "hidden",
});

export const progressFill = style({
  height: "100%",
  backgroundColor: "#dc2626",
  transition: "width 0.3s ease",
});

export const progressText = style({
  fontSize: 12,
  color: "#888",
  textAlign: "center",
});

export const redeemButton = style({
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  transition: "background-color 0.2s",
  marginTop: "auto",
  ":hover": {
    backgroundColor: "#b91c1c",
  },
});

export const disabled = style({
  opacity: 0.5,
  cursor: "not-allowed",
  ":hover": {
    backgroundColor: "#dc2626",
  },
});

export const signInPrompt = style({
  maxWidth: 600,
  margin: "48px auto",
  padding: 32,
  backgroundColor: "#1a1a1a",
  borderRadius: 12,
  border: "1px solid #2a2a2a",
  textAlign: "center",
});

export const signInButton = style({
  display: "inline-block",
  marginTop: 16,
  padding: "12px 32px",
  fontSize: 16,
  fontWeight: 600,
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  textDecoration: "none",
  cursor: "pointer",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "#b91c1c",
  },
});

export const backLink = style({
  maxWidth: 1200,
  margin: "0 auto",
  textAlign: "center",
});

export const link = style({
  color: "#dc2626",
  textDecoration: "none",
  fontSize: 16,
  fontWeight: 500,
  ":hover": {
    textDecoration: "underline",
  },
});
