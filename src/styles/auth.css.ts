import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
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

export const formCard = style({
  width: "100%",
  maxWidth: 480,
  padding: 32,
  backgroundColor: "#ffffff",
  borderRadius: 2,
  border: "1px solid #e5e5e5",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 48,
    },
  },
});

export const title = style({
  fontSize: 32,
  fontWeight: 300,
  marginBottom: 8,
  textAlign: "center",
  letterSpacing: "-0.01em",
  color: "#1a1a1a",
});

export const subtitle = style({
  fontSize: 16,
  color: "#666",
  textAlign: "center",
  marginBottom: 32,
  fontWeight: 300,
});

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: 20,
});

export const inputRow = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
});

export const inputGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const label = style({
  fontSize: 14,
  fontWeight: 500,
  color: "#1a1a1a",
});

export const input = style({
  padding: "12px 16px",
  fontSize: 16,
  backgroundColor: "#ffffff",
  color: "#1a1a1a",
  border: "1px solid #e5e5e5",
  borderRadius: 2,
  outline: "none",
  transition: "border-color 0.2s",
  ":focus": {
    borderColor: "#1a1a1a",
  },
});

export const submitButton = style({
  padding: "14px 24px",
  fontSize: 16,
  fontWeight: 500,
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  border: "none",
  borderRadius: 2,
  cursor: "pointer",
  marginTop: 8,
  transition: "all 0.3s ease",
  letterSpacing: "0.05em",
  ":hover": {
    backgroundColor: "#333",
    transform: "translateY(-2px)",
  },
  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

export const error = style({
  padding: 12,
  backgroundColor: "#fef2f2",
  color: "#991b1b",
  borderRadius: 2,
  fontSize: 14,
  border: "1px solid #fecaca",
});

export const footer = style({
  marginTop: 24,
  textAlign: "center",
});

export const footerText = style({
  fontSize: 14,
  color: "#666",
  fontWeight: 300,
});

export const link = style({
  color: "#1a1a1a",
  textDecoration: "none",
  fontWeight: 500,
  ":hover": {
    opacity: 0.6,
  },
});

export const backLink = style({
  marginTop: 24,
  textAlign: "center",
});
