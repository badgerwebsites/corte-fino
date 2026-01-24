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
  maxWidth: 800,
  margin: "0 auto 32px",
  flexWrap: "wrap",
  gap: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 40,
      gap: 16,
    },
  },
});

export const title = style({
  fontSize: 26,
  fontWeight: 600,
  color: "#1a1a1a",
  letterSpacing: "-0.01em",
  marginBottom: 8,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 32,
      marginBottom: 10,
    },
  },
});

export const subtitle = style({
  fontSize: 15,
  color: "#64748b",
  fontWeight: 400,
  lineHeight: 1.4,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const signOutButton = style({
  padding: "8px 16px",
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: "#64748b",
  border: "1px solid #e2e8f0",
  borderRadius: 4,
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
  maxWidth: 800,
  margin: "0 auto 32px",
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 20,
      marginBottom: 40,
    },
  },
});

export const statCard = style({
  padding: "24px 20px",
  backgroundColor: "#ffffff",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  borderTop: "3px solid #0ea5e9",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "28px 24px",
    },
  },
});

export const statValue = style({
  fontSize: 36,
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: 8,
  lineHeight: 1,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 44,
      marginBottom: 10,
    },
  },
});

export const statValueSmall = style({
  fontSize: 18,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 8,
  lineHeight: 1.2,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 20,
      marginBottom: 10,
    },
  },
});

export const statLabel = style({
  fontSize: 12,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  fontWeight: 500,
  marginTop: 4,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 13,
    },
  },
});

export const section = style({
  maxWidth: 800,
  margin: "0 auto 32px",
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 40,
    },
  },
});

export const sectionHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
  flexWrap: "wrap",
  gap: 16,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 24,
    },
  },
});

export const sectionTitle = style({
  fontSize: 20,
  fontWeight: 600,
  color: "#1a1a1a",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 22,
    },
  },
});

export const bookButton = style({
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
  transition: "all 0.2s ease",
  letterSpacing: "0.02em",
  ":hover": {
    backgroundColor: "#333",
  },
  ":active": {
    transform: "scale(0.98)",
  },
});

export const emptyState = style({
  padding: "56px 24px",
  textAlign: "center",
  backgroundColor: "#ffffff",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "72px 40px",
    },
  },
});

export const emptyStateIcon = style({
  width: 56,
  height: 56,
  marginBottom: 20,
  opacity: 0.5,
  "@media": {
    "screen and (min-width: 768px)": {
      width: 64,
      height: 64,
      marginBottom: 24,
    },
  },
});

export const emptyStateTitle = style({
  fontSize: 20,
  fontWeight: 600,
  color: "#1a1a1a",
  marginBottom: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 22,
      marginBottom: 14,
    },
  },
});

export const emptyStateText = style({
  fontSize: 15,
  color: "#64748b",
  marginBottom: 28,
  maxWidth: 320,
  marginLeft: "auto",
  marginRight: "auto",
  lineHeight: 1.6,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
      marginBottom: 32,
    },
  },
});

export const bookingsList = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const bookingCard = style({
  padding: 20,
  backgroundColor: "#ffffff",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  transition: "border-color 0.2s",
  ":hover": {
    borderColor: "#cbd5e1",
  },
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 24,
    },
  },
});

export const bookingHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 16,
  flexWrap: "wrap",
  gap: 12,
});

export const bookingDate = style({
  fontSize: 15,
  fontWeight: 600,
  color: "#1a1a1a",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const statusBadge = style({
  padding: "4px 10px",
  fontSize: 11,
  fontWeight: 500,
  borderRadius: 4,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const pending = style({
  backgroundColor: "#fef3c7",
  color: "#92400e",
});

export const confirmed = style({
  backgroundColor: "#e0f2fe",
  color: "#0369a1",
});

export const completed = style({
  backgroundColor: "#f0f9ff",
  color: "#0c4a6e",
});

export const cancelled = style({
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
});

export const no_show = style({
  backgroundColor: "#f1f5f9",
  color: "#475569",
});

export const bookingDetails = style({
  display: "flex",
  flexDirection: "column",
  gap: 6,
});

export const bookingTime = style({
  fontSize: 14,
  fontWeight: 500,
  color: "#0369a1",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 15,
    },
  },
});

export const bookingService = style({
  fontSize: 15,
  color: "#1a1a1a",
  fontWeight: 500,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const bookingBarber = style({
  fontSize: 13,
  color: "#64748b",
  fontWeight: 400,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 14,
    },
  },
});

export const bookingPrice = style({
  fontSize: 16,
  fontWeight: 600,
  color: "#1a1a1a",
  marginTop: 8,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 17,
    },
  },
});

// Rewards card styles
export const rewardsCard = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px 20px",
  backgroundColor: "#ffffff",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  gap: 20,
  flexWrap: "wrap",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "28px 24px",
    },
  },
});

export const rewardsInfo = style({
  display: "flex",
  alignItems: "center",
  gap: 16,
});

export const rewardsIcon = style({
  fontSize: 28,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 32,
    },
  },
});

export const rewardsText = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

export const rewardsTitle = style({
  fontSize: 16,
  fontWeight: 600,
  color: "#1a1a1a",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 17,
    },
  },
});

export const rewardsSubtitle = style({
  fontSize: 14,
  color: "#64748b",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 15,
    },
  },
});

export const rewardsLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 14,
  color: "#0369a1",
  textDecoration: "none",
  fontWeight: 500,
  padding: "8px 16px",
  borderRadius: 6,
  border: "1px solid #e0f2fe",
  backgroundColor: "#f0f9ff",
  transition: "all 0.2s",
  ":hover": {
    backgroundColor: "#e0f2fe",
    borderColor: "#bae6fd",
  },
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 14,
    },
  },
});

export const adminLink = style({
  display: "inline-block",
  fontSize: 14,
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 500,
  padding: "10px 20px",
  backgroundColor: "#1a1a1a",
  borderRadius: 6,
  transition: "all 0.2s ease",
  letterSpacing: "0.02em",
  ":hover": {
    backgroundColor: "#333",
  },
});
