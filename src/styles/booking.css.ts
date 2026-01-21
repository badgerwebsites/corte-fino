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
});

export const comingSoon = style({
  maxWidth: 800,
  margin: "0 auto",
  padding: 48,
  backgroundColor: "#1a1a1a",
  borderRadius: 12,
  border: "1px solid #2a2a2a",
  textAlign: "center",
});

export const comingSoonText = style({
  fontSize: 24,
  fontWeight: 700,
  color: "#dc2626",
  marginBottom: 24,
});

export const featureList = style({
  textAlign: "left",
  display: "inline-block",
  fontSize: 16,
  lineHeight: 2,
  color: "#e0e0e0",
  marginTop: 24,
});

export const backLink = style({
  maxWidth: 1200,
  margin: "48px auto 0",
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
