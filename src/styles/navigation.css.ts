import { style } from "@vanilla-extract/css";

export const nav = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #e5e5e5",
  padding: "12px 16px",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "16px 24px",
    },
  },
});

export const navContainer = style({
  maxWidth: 1200,
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 24,
    },
  },
});

export const logo = style({
  fontSize: 18,
  fontWeight: 300,
  letterSpacing: "-0.01em",
  color: "#1a1a1a",
  textDecoration: "none",
  transition: "opacity 0.2s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 24,
    },
  },
  ":hover": {
    opacity: 0.7,
  },
});

export const navButtons = style({
  display: "flex",
  gap: 8,
  alignItems: "center",
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 12,
    },
  },
});

export const signInButton = style({
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: "#1a1a1a",
  border: "1px solid #e5e5e5",
  borderRadius: 2,
  cursor: "pointer",
  textDecoration: "none",
  transition: "all 0.2s ease",
  letterSpacing: "0.02em",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "10px 24px",
      fontSize: 14,
      letterSpacing: "0.05em",
    },
  },
  ":hover": {
    borderColor: "#1a1a1a",
    backgroundColor: "#fafafa",
  },
});

export const bookNowButton = style({
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  border: "none",
  borderRadius: 2,
  cursor: "pointer",
  textDecoration: "none",
  transition: "all 0.3s ease",
  letterSpacing: "0.02em",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "10px 24px",
      fontSize: 14,
      letterSpacing: "0.05em",
    },
  },
  ":hover": {
    backgroundColor: "#333",
  },
  ":active": {
    transform: "scale(0.98)",
  },
});

export const dashboardButton = style({
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: "#666",
  border: "1px solid #e5e5e5",
  borderRadius: 2,
  cursor: "pointer",
  textDecoration: "none",
  transition: "all 0.2s ease",
  letterSpacing: "0.02em",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "10px 24px",
      fontSize: 14,
      letterSpacing: "0.05em",
    },
  },
  ":hover": {
    borderColor: "#1a1a1a",
    color: "#1a1a1a",
  },
});
