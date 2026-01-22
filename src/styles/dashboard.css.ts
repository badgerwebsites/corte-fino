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
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: 1200,
  margin: "0 auto 32px",
  flexWrap: "wrap",
  gap: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 48,
      gap: 16,
    },
  },
});

export const title = style({
  fontSize: 28,
  fontWeight: 300,
  color: "#1a1a1a",
  letterSpacing: "-0.01em",
  marginBottom: 6,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 36,
      marginBottom: 8,
    },
  },
});

export const subtitle = style({
  fontSize: 16,
  color: "#666",
  fontWeight: 300,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 18,
    },
  },
});

export const signOutButton = style({
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 400,
  backgroundColor: "transparent",
  color: "#666",
  border: "1px solid #e5e5e5",
  borderRadius: 2,
  cursor: "pointer",
  transition: "all 0.2s",
  ":hover": {
    borderColor: "#1a1a1a",
    color: "#1a1a1a",
  },
});

export const statsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 16,
  maxWidth: 1200,
  margin: "0 auto 32px",
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 24,
      marginBottom: 48,
    },
  },
});

export const statCard = style({
  padding: 24,
  backgroundColor: "#ffffff",
  borderRadius: 2,
  border: "1px solid #e5e5e5",
  textAlign: "center",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 32,
    },
  },
});

export const statValue = style({
  fontSize: 36,
  fontWeight: 300,
  color: "#1a1a1a",
  marginBottom: 6,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 48,
      marginBottom: 8,
    },
  },
});

export const statLabel = style({
  fontSize: 10,
  color: "#999",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 500,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 12,
    },
  },
});

export const section = style({
  maxWidth: 1200,
  margin: "0 auto 32px",
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 48,
    },
  },
});

export const sectionHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
  flexWrap: "wrap",
  gap: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 24,
      gap: 16,
    },
  },
});

export const sectionTitle = style({
  fontSize: 20,
  fontWeight: 300,
  color: "#1a1a1a",
  letterSpacing: "-0.01em",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 24,
    },
  },
});

export const bookButton = style({
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  border: "none",
  borderRadius: 2,
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
  transition: "all 0.3s ease",
  letterSpacing: "0.05em",
  ":hover": {
    backgroundColor: "#333",
    transform: "translateY(-2px)",
  },
});

export const emptyState = style({
  padding: 64,
  textAlign: "center",
  backgroundColor: "#ffffff",
  borderRadius: 2,
  border: "1px solid #e5e5e5",
});

export const bookingsList = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const bookingCard = style({
  padding: 24,
  backgroundColor: "#ffffff",
  borderRadius: 2,
  border: "1px solid #e5e5e5",
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
  fontWeight: 500,
  color: "#1a1a1a",
});

export const statusBadge = style({
  padding: "6px 12px",
  fontSize: 11,
  fontWeight: 500,
  borderRadius: 2,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
});

export const pending = style({
  backgroundColor: "#fef3c7",
  color: "#92400e",
});

export const confirmed = style({
  backgroundColor: "#d1fae5",
  color: "#065f46",
});

export const completed = style({
  backgroundColor: "#dbeafe",
  color: "#1e3a8a",
});

export const cancelled = style({
  backgroundColor: "#fee2e2",
  color: "#991b1b",
});

export const no_show = style({
  backgroundColor: "#f4f4f5",
  color: "#52525b",
});

export const bookingDetails = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
});

export const bookingTime = style({
  fontSize: 16,
  fontWeight: 500,
  color: "#1a1a1a",
});

export const bookingService = style({
  fontSize: 16,
  color: "#666",
  fontWeight: 300,
});

export const bookingBarber = style({
  fontSize: 14,
  color: "#999",
  fontWeight: 300,
});

export const bookingPrice = style({
  fontSize: 18,
  fontWeight: 500,
  color: "#1a1a1a",
  marginTop: 8,
});

export const rewardsLink = style({
  display: "inline-block",
  fontSize: 16,
  color: "#1a1a1a",
  textDecoration: "none",
  fontWeight: 500,
  ":hover": {
    opacity: 0.6,
  },
});

export const adminLink = style({
  display: "inline-block",
  fontSize: 14,
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 500,
  padding: "12px 24px",
  backgroundColor: "#1a1a1a",
  borderRadius: 2,
  transition: "all 0.3s ease",
  letterSpacing: "0.05em",
  ":hover": {
    backgroundColor: "#333",
    transform: "translateY(-2px)",
  },
});
