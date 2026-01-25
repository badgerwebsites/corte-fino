import { style } from "@vanilla-extract/css";

// Layout
export const container = style({
  minHeight: "100vh",
  backgroundColor: "#ffffff",
  color: "#0a0a0a",
  paddingTop: 80,
  paddingBottom: 80,
});

export const content = style({
  maxWidth: 640,
  margin: "0 auto",
  padding: "0 20px",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "0 24px",
    },
  },
});

// Header
export const header = style({
  marginBottom: 48,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 56,
    },
  },
});

export const headerTop = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 32,
});

export const greeting = style({
  fontSize: 14,
  color: "#737373",
  fontWeight: 400,
  marginBottom: 4,
  letterSpacing: "-0.01em",
});

export const title = style({
  fontSize: 28,
  fontWeight: 600,
  color: "#0a0a0a",
  letterSpacing: "-0.02em",
  lineHeight: 1.2,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 32,
    },
  },
});

export const signOutButton = style({
  padding: 0,
  fontSize: 13,
  fontWeight: 400,
  backgroundColor: "transparent",
  color: "#a3a3a3",
  border: "none",
  cursor: "pointer",
  transition: "color 0.15s",
  ":hover": {
    color: "#525252",
  },
});

// Primary CTA
export const primaryCta = style({
  display: "block",
  width: "100%",
  padding: "16px 24px",
  fontSize: 15,
  fontWeight: 500,
  backgroundColor: "#0a0a0a",
  color: "#ffffff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  textDecoration: "none",
  textAlign: "center",
  transition: "all 0.15s",
  letterSpacing: "-0.01em",
  ":hover": {
    backgroundColor: "#262626",
  },
  ":active": {
    transform: "scale(0.99)",
  },
});

// Stats row
export const statsRow = style({
  display: "flex",
  gap: 32,
  marginBottom: 48,
  paddingBottom: 48,
  borderBottom: "1px solid #f5f5f5",
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 48,
      marginBottom: 56,
      paddingBottom: 56,
    },
  },
});

export const stat = style({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

export const statValue = style({
  fontSize: 24,
  fontWeight: 600,
  color: "#0a0a0a",
  letterSpacing: "-0.02em",
  lineHeight: 1,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 28,
    },
  },
});

export const statValueMuted = style({
  fontSize: 16,
  fontWeight: 500,
  color: "#a3a3a3",
  lineHeight: 1.3,
});

export const statLabel = style({
  fontSize: 13,
  color: "#737373",
  fontWeight: 400,
  letterSpacing: "-0.01em",
});

// Section
export const section = style({
  marginBottom: 48,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 56,
    },
  },
});

export const sectionHeader = style({
  marginBottom: 20,
});

export const sectionTitle = style({
  fontSize: 13,
  fontWeight: 500,
  color: "#737373",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
});

// Empty state
export const emptyState = style({
  padding: "48px 24px",
  textAlign: "center",
  backgroundColor: "#fafafa",
  borderRadius: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "64px 40px",
    },
  },
});

export const emptyStateIcon = style({
  width: 48,
  height: 48,
  marginBottom: 16,
  opacity: 0.4,
});

export const emptyStateTitle = style({
  fontSize: 16,
  fontWeight: 500,
  color: "#0a0a0a",
  marginBottom: 8,
});

export const emptyStateText = style({
  fontSize: 14,
  color: "#737373",
  marginBottom: 24,
  maxWidth: 280,
  marginLeft: "auto",
  marginRight: "auto",
  lineHeight: 1.5,
});

export const emptyStateButton = style({
  display: "inline-block",
  padding: "12px 24px",
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: "#0a0a0a",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  textDecoration: "none",
  transition: "all 0.15s",
  ":hover": {
    backgroundColor: "#262626",
  },
});

// Bookings list
export const bookingsList = style({
  display: "flex",
  flexDirection: "column",
  gap: 1,
  backgroundColor: "#f5f5f5",
  borderRadius: 12,
  overflow: "hidden",
});

export const bookingCard = style({
  padding: "20px 24px",
  backgroundColor: "#ffffff",
  transition: "background-color 0.15s",
  ":hover": {
    backgroundColor: "#fafafa",
  },
});

export const bookingMain = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
});

export const bookingInfo = style({
  flex: 1,
  minWidth: 0,
});

export const bookingDate = style({
  fontSize: 15,
  fontWeight: 500,
  color: "#0a0a0a",
  marginBottom: 4,
  letterSpacing: "-0.01em",
});

export const bookingMeta = style({
  fontSize: 14,
  color: "#737373",
  lineHeight: 1.4,
});

export const bookingTime = style({
  color: "#0ea5e9",
  fontWeight: 500,
});

export const bookingRight = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 8,
});

export const bookingPrice = style({
  fontSize: 15,
  fontWeight: 600,
  color: "#0a0a0a",
  letterSpacing: "-0.01em",
});

export const statusBadge = style({
  padding: "3px 8px",
  fontSize: 11,
  fontWeight: 500,
  borderRadius: 4,
  textTransform: "uppercase",
  letterSpacing: "0.02em",
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
  backgroundColor: "#f0fdf4",
  color: "#166534",
});

export const cancelled = style({
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
});

export const no_show = style({
  backgroundColor: "#f5f5f5",
  color: "#525252",
});

export const bookingActions = style({
  display: "flex",
  gap: 16,
  marginTop: 12,
  paddingTop: 12,
});

export const actionLink = style({
  padding: 0,
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: "#737373",
  border: "none",
  cursor: "pointer",
  transition: "color 0.15s",
  ":hover": {
    color: "#0a0a0a",
  },
});

export const actionLinkDanger = style({
  padding: 0,
  fontSize: 13,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: "#a3a3a3",
  border: "none",
  cursor: "pointer",
  transition: "color 0.15s",
  ":hover": {
    color: "#dc2626",
  },
});

// Rewards card - subtle, secondary
export const rewardsCard = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px",
  backgroundColor: "#fafafa",
  borderRadius: 8,
  gap: 16,
  flexWrap: "wrap",
});

export const rewardsInfo = style({
  display: "flex",
  alignItems: "center",
  gap: 12,
});

export const rewardsIcon = style({
  width: 20,
  height: 20,
  opacity: 0.5,
});

export const rewardsText = style({
  fontSize: 14,
  color: "#525252",
  fontWeight: 400,
});

export const rewardsPoints = style({
  fontWeight: 600,
  color: "#0a0a0a",
});

export const rewardsLink = style({
  fontSize: 13,
  color: "#0ea5e9",
  textDecoration: "none",
  fontWeight: 500,
  transition: "color 0.15s",
  ":hover": {
    color: "#0284c7",
  },
});

// Admin link
export const adminLink = style({
  display: "inline-block",
  fontSize: 13,
  color: "#737373",
  textDecoration: "none",
  fontWeight: 400,
  transition: "color 0.15s",
  ":hover": {
    color: "#0a0a0a",
  },
});

// Modal styles
export const modalOverlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 20,
});

export const modal = style({
  backgroundColor: "#ffffff",
  borderRadius: 12,
  padding: 24,
  maxWidth: 380,
  width: "100%",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.12)",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 28,
    },
  },
});

export const modalTitle = style({
  fontSize: 18,
  fontWeight: 600,
  color: "#0a0a0a",
  marginBottom: 16,
  letterSpacing: "-0.01em",
});

export const modalBookingInfo = style({
  padding: 16,
  backgroundColor: "#fafafa",
  borderRadius: 8,
  marginBottom: 16,
});

export const modalBookingDate = style({
  fontSize: 14,
  fontWeight: 500,
  color: "#0a0a0a",
  marginBottom: 4,
});

export const modalBookingTime = style({
  fontSize: 13,
  color: "#737373",
});

export const feeWarning = style({
  padding: 14,
  backgroundColor: "#fef3c7",
  borderRadius: 8,
  marginBottom: 20,
});

export const feeWarningTitle = style({
  fontSize: 13,
  fontWeight: 600,
  color: "#92400e",
  marginBottom: 4,
});

export const feeWarningText = style({
  fontSize: 13,
  color: "#a16207",
  lineHeight: 1.4,
});

export const nofeeText = style({
  fontSize: 13,
  color: "#737373",
  marginBottom: 20,
  lineHeight: 1.4,
});

export const modalActions = style({
  display: "flex",
  gap: 12,
});

export const modalCancelButton = style({
  flex: 1,
  padding: "12px 16px",
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: "#f5f5f5",
  color: "#525252",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  transition: "all 0.15s",
  ":hover": {
    backgroundColor: "#e5e5e5",
  },
  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

export const modalConfirmButton = style({
  flex: 1,
  padding: "12px 16px",
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  transition: "all 0.15s",
  ":hover": {
    backgroundColor: "#b91c1c",
  },
  ":disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

// Loading state
export const loadingText = style({
  color: "#737373",
  fontSize: 14,
});

// Legacy exports for compatibility (unused but kept to prevent errors)
export const subtitle = style({ display: "none" });
export const statsGrid = style({ display: "none" });
export const statCard = style({ display: "none" });
export const statValueSmall = style({ display: "none" });
export const bookButton = style({ display: "none" });
export const bookingHeader = style({ display: "none" });
export const bookingService = style({ display: "none" });
export const bookingBarber = style({ display: "none" });
export const bookingDetails = style({ display: "none" });
export const rewardsTitle = style({ display: "none" });
export const rewardsSubtitle = style({ display: "none" });
export const rescheduleButton = style({ display: "none" });
export const cancelButton = style({ display: "none" });
