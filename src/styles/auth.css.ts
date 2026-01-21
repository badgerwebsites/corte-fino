import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "#0e0e0e",
  color: "#ffffff",
  padding: 24,
});

export const formCard = style({
  width: "100%",
  maxWidth: 480,
  padding: 48,
  backgroundColor: "#1a1a1a",
  borderRadius: 12,
  border: "1px solid #2a2a2a",
});

export const title = style({
  fontSize: 32,
  fontWeight: 700,
  marginBottom: 8,
  textAlign: "center",
  color: "#ffffff",
});

export const subtitle = style({
  fontSize: 16,
  color: "#888",
  textAlign: "center",
  marginBottom: 32,
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
  color: "#e0e0e0",
});

export const input = style({
  padding: "12px 16px",
  fontSize: 16,
  backgroundColor: "#0e0e0e",
  color: "#ffffff",
  border: "1px solid #2a2a2a",
  borderRadius: 8,
  outline: "none",
  transition: "border-color 0.2s",
  ":focus": {
    borderColor: "#dc2626",
  },
});

export const submitButton = style({
  padding: "14px 24px",
  fontSize: 16,
  fontWeight: 600,
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  marginTop: 8,
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "#b91c1c",
  },
  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

export const error = style({
  padding: 12,
  backgroundColor: "#7f1d1d",
  color: "#fca5a5",
  borderRadius: 8,
  fontSize: 14,
});

export const footer = style({
  marginTop: 24,
  textAlign: "center",
});

export const footerText = style({
  fontSize: 14,
  color: "#888",
});

export const link = style({
  color: "#dc2626",
  textDecoration: "none",
  fontWeight: 500,
  ":hover": {
    textDecoration: "underline",
  },
});

export const backLink = style({
  marginTop: 24,
  textAlign: "center",
});
