import { style } from "@vanilla-extract/css";

export const container = style({
  minHeight: "100vh",
  backgroundColor: "#0e0e0e",
  color: "#ffffff",
  padding: 24,
});

export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: 1200,
  margin: "0 auto 48px",
  flexWrap: "wrap",
  gap: 16,
});

export const title = style({
  fontSize: 36,
  fontWeight: 700,
  color: "#ffffff",
  marginBottom: 8,
});

export const subtitle = style({
  fontSize: 18,
  color: "#888",
});

export const signOutButton = style({
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: "transparent",
  color: "#dc2626",
  border: "1px solid #dc2626",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.2s",
  ":hover": {
    backgroundColor: "#dc2626",
    color: "#ffffff",
  },
});

export const statsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 24,
  maxWidth: 1200,
  margin: "0 auto 48px",
});

export const statCard = style({
  padding: 32,
  backgroundColor: "#1a1a1a",
  borderRadius: 12,
  border: "1px solid #2a2a2a",
  textAlign: "center",
});

export const statValue = style({
  fontSize: 48,
  fontWeight: 700,
  color: "#dc2626",
  marginBottom: 8,
});

export const statLabel = style({
  fontSize: 14,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const section = style({
  maxWidth: 1200,
  margin: "0 auto 48px",
});

export const sectionHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
  flexWrap: "wrap",
  gap: 16,
});

export const sectionTitle = style({
  fontSize: 24,
  fontWeight: 700,
  color: "#ffffff",
});

export const bookButton = style({
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 600,
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "#b91c1c",
  },
});

export const emptyState = style({
  padding: 64,
  textAlign: "center",
  backgroundColor: "#1a1a1a",
  borderRadius: 12,
  border: "1px solid #2a2a2a",
});

export const bookingsList = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const bookingCard = style({
  padding: 24,
  backgroundColor: "#1a1a1a",
  borderRadius: 12,
  border: "1px solid #2a2a2a",
});

export const bookingHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
  flexWrap: "wrap",
  gap: 12,
});

export const bookingDate = style({
  fontSize: 18,
  fontWeight: 600,
  color: "#ffffff",
});

export const statusBadge = style({
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 6,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const pending = style({
  backgroundColor: "#713f12",
  color: "#fbbf24",
});

export const confirmed = style({
  backgroundColor: "#065f46",
  color: "#34d399",
});

export const completed = style({
  backgroundColor: "#1e3a8a",
  color: "#60a5fa",
});

export const cancelled = style({
  backgroundColor: "#7f1d1d",
  color: "#fca5a5",
});

export const no_show = style({
  backgroundColor: "#3f3f46",
  color: "#a1a1aa",
});

export const bookingDetails = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const bookingTime = style({
  fontSize: 16,
  fontWeight: 600,
  color: "#dc2626",
});

export const bookingService = style({
  fontSize: 16,
  color: "#e0e0e0",
});

export const bookingBarber = style({
  fontSize: 14,
  color: "#888",
});

export const bookingPrice = style({
  fontSize: 18,
  fontWeight: 700,
  color: "#ffffff",
  marginTop: 8,
});

export const rewardsLink = style({
  display: "inline-block",
  fontSize: 16,
  color: "#dc2626",
  textDecoration: "none",
  fontWeight: 500,
  ":hover": {
    textDecoration: "underline",
  },
});
