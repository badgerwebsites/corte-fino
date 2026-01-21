import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  backgroundColor: "#0e0e0e",
  color: "#ffffff",
  padding: 24
});

export const title = style({
  fontSize: 48,
  letterSpacing: "0.08em",
  marginBottom: 8
});

export const subtitle = style({
  fontSize: 18,
  opacity: 0.85
});
