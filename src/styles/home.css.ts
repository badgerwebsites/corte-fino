import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#0e0e0e",
  color: "#ffffff",
});

export const hero = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "70vh",
  padding: 24,
  textAlign: "center",
});

export const title = style({
  fontSize: 72,
  fontWeight: 700,
  letterSpacing: "0.08em",
  marginBottom: 16,
  color: "#ffffff",
});

export const subtitle = style({
  fontSize: 24,
  opacity: 0.85,
  marginBottom: 48,
  color: "#e0e0e0",
});

export const buttonGroup = style({
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
  justifyContent: "center",
});

export const primaryButton = style({
  padding: "16px 32px",
  fontSize: 18,
  fontWeight: 600,
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.2s",
  ":hover": {
    backgroundColor: "#b91c1c",
    transform: "translateY(-2px)",
  },
});

export const secondaryButton = style({
  padding: "16px 32px",
  fontSize: 18,
  fontWeight: 600,
  backgroundColor: "transparent",
  color: "#ffffff",
  border: "2px solid #ffffff",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.2s",
  ":hover": {
    backgroundColor: "#ffffff",
    color: "#0e0e0e",
  },
});

export const section = style({
  padding: "80px 24px",
  maxWidth: 1200,
  margin: "0 auto",
  width: "100%",
});

export const sectionTitle = style({
  fontSize: 36,
  fontWeight: 700,
  textAlign: "center",
  marginBottom: 48,
  color: "#ffffff",
});

export const features = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 32,
});

export const feature = style({
  padding: 32,
  backgroundColor: "#1a1a1a",
  borderRadius: 12,
  border: "1px solid #2a2a2a",
});

export const featureTitle = style({
  fontSize: 24,
  fontWeight: 600,
  marginBottom: 12,
  color: "#dc2626",
});

export const featureText = style({
  fontSize: 16,
  lineHeight: 1.6,
  color: "#e0e0e0",
});

export const contactInfo = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
});

export const contactText = style({
  fontSize: 18,
  color: "#e0e0e0",
});

export const footer = style({
  padding: 32,
  textAlign: "center",
  borderTop: "1px solid #2a2a2a",
  marginTop: 80,
});

export const footerText = style({
  fontSize: 14,
  color: "#888",
});
