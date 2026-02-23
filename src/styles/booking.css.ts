import { style, keyframes } from "@vanilla-extract/css";

const darker_bg = "#101214";
const dark_bg = "#222222";
const button =  "#96cfe0";
const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";
const border_subtle = "rgba(255,255,255,0.08)";

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const slideInUp = keyframes({
  from: { opacity: 0, transform: "translateY(20px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const container = style({
  minHeight: "100vh",
  backgroundColor: darker_bg,
  // color: "#1a1a1a",
  padding: 8,
  paddingTop: 72,
  animation: `${fadeIn} 0.5s ease-out`,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 24,
      paddingTop: 84,
    },
  },
});

export const header = style({
  maxWidth: 1200,
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  animation: `${slideInUp} 0.6s ease-out`,
  marginBottom: 40,
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 16,
    },
  },
});

export const backLink = style({
  // margin: "0 auto",
  // position: "fixed",
  marginBottom: 12,
});

export const link = style({
  color: text_primary,
  textDecoration: "none",
  fontSize: 20,
  fontWeight: 400,
  transition: "opacity 0.2s",
  ":hover": {
    opacity: 0.6,
  },
});

export const rescheduleNoticeWrapper = style({
  display: "flex",
  justifyContent: "center",
  // marginBottom: 12,
});

// Reschedule notice
export const rescheduleNotice = style({
  // maxWidth: 850,
  display: "inline-block",
  margin: "0 auto 12px",
  padding: "8px 12px",
  backgroundColor: "#fef3c7",
  border: "1px solid #fcd34d",
  borderRadius: 8,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 32,
      padding: "12px 20px",
    },
  },
});

export const rescheduleNoticeText = style({
  fontSize: 14,
  color: "#92400e",
  lineHeight: 1.5,
  textAlign: "center",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

// Progress Bar Styles
export const progressBar = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: 800,
  margin: "0 auto",
  padding: "0 16px",
  animation: `${slideInUp} 0.7s ease-out`,
  "@media": {
    "screen and (min-width: 768px)": {
      // marginBottom: 48,
      // padding: "0 24px",
    },
  },
});

export const progressStep = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  transition: "all 0.3s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 8,
    },
  },
});

export const progressStepActive = style({
  opacity: 1,
});

export const progressNumber = style({
  width: 36,
  height: 36,
  borderRadius: "50%",
  backgroundColor: text_muted,
  // border: "2px solid #e5e5e5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  fontSize: 16,
  color: "#1a1a1a",
  transition: "all 0.3s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      width: 48,
      height: 48,
      fontSize: 18,
    },
  },
  selectors: {
    [`${progressStepActive} &`]: {
      borderColor: "#1a1a1a",
      backgroundColor: text_primary,
      color: "#1a1a1a",
    },
  },
});

export const progressLabel = style({
  fontSize: 10,
  color: text_muted,
  textAlign: "center",
  fontWeight: 400,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 12,
    },
  },
});

export const progressLine = style({
  width: 40,
  height: 2,
  backgroundColor: text_primary,
  margin: "0 4px",
  marginBottom: 18,
  transition: "background-color 0.3s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      width: 100,
      margin: "0 16px",
      marginBottom: 24,
    },
  },
});

// Step Container
export const stepContainer = style({
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0 16px",
  animation: `${slideInUp} 0.5s ease-out`,
  textAlign: 'center',
  marginTop: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      marginTop: 16,
    },
  },
});

export const stepTitle = style({
  fontSize: 24,
  fontWeight: 600,
  textAlign: "center",
  letterSpacing: "-0.01em",
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 28,
    },
  },
});

// Service Selection Styles
export const serviceGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
  marginTop: 16,
  marginBottom: 80,
  textAlign: 'left',
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 24,
      marginTop: 28,
    },
  },
});

export const serviceCard = style({
  padding: 0,
  backgroundColor: dark_bg,
  borderRadius: 8,
  border: `1px solid ${border_subtle}`,
  boxShadow: "0 12px 32px rgba(0,0,0,0.6)",  
  cursor: "pointer",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
    borderColor: text_muted,
  },
  ":active": {
    transform: "scale(0.98)",
  },
});

export const serviceImageWrapper = style({
  width: "100%",
  height: 180,
  overflow: "hidden",
  "@media": {
    "screen and (min-width: 768px)": {
      height: 200,
    },
  },
});

export const serviceImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.3s ease",
  selectors: {
    [`${serviceCard}:hover &`]: {
      transform: "scale(1.05)",
    },
  },
});

export const serviceCardContent = style({
  padding: 20,
  display: "flex",
  flexDirection: "column",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 24,
    },
  },
});

export const serviceName = style({
  fontSize: 20,
  fontWeight: 500,
  marginBottom: 4,
  color: text_primary,
});

export const serviceDescription = style({
  fontSize: 16,
  color: text_secondary,
  marginBottom: 8,
  lineHeight: 1.5,
  fontWeight: 300,
});

export const serviceDuration = style({
  fontSize: 16,
  color: text_primary,
  marginBottom: 8,
  fontWeight: 400,
});

export const servicePoints = style({
  fontSize: 14,
  color: button,
  fontWeight: 400,
});

// Barber Selection Styles
export const barberGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
  marginTop: 12,
  textAlign: 'left',
  marginBottom: 80,
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 24,
      marginTop: 20,
    },
  },
});

export const barberCard = style({
  padding: 16,
  backgroundColor: dark_bg,
  borderRadius: 8,
  border: `1px solid ${border_subtle}`,
  boxShadow: "0 12px 32px rgba(0,0,0,0.6)",  
  cursor: "pointer",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
    borderColor: text_muted,
  },
  ":active": {
    transform: "scale(0.98)",
  },
});

export const barberImageWrapper = style({
  width: 80,
  height: 80,
  borderRadius: "50%",
  overflow: "hidden",
  marginBottom: 16,
  border: "2px solid #e5e5e5",
  "@media": {
    "screen and (min-width: 768px)": {
      width: 100,
      height: 100,
    },
  },
});

export const barberImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const barberName = style({
  fontSize: 20,
  fontWeight: 500,
  marginBottom: 12,
  color: text_primary,
});

export const barberBio = style({
  fontSize: 14,
  color: text_secondary,
  marginBottom: 12,
  lineHeight: 1.5,
  fontWeight: 300,
});

export const barberSocial = style({
  fontSize: 14,
  color: button,
  fontWeight: 400,
});

// Date & Time Selection Styles
export const timeColumn = style({
  flex: "1 1 0",
  minWidth: 0,
});

export const timeLabel = style({
  fontSize: 20,
  fontWeight: 600,
  color: text_primary,
});

export const timeGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
  gap: 10,
  marginTop: 12,
  marginBottom: 80,
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
      gap: 12,
    },
  },
});

export const timeButton = style({
  padding: 10,
  backgroundColor: darker_bg,
  border: `2px solid ${text_muted}`,
  borderRadius: 4,
  color: text_primary,
  fontSize: 16,
  cursor: "pointer",
  textAlign: "center",
  transition: "all 0.2s ease",
  fontWeight: 500,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
  ":hover": {
    borderColor: button,
    color: button,
  },
  ":active": {
    transform: "scale(0.95)",
  },
});

export const timeButtonActive = style({
  borderColor: button,
  color: button,
});

export const noTimesMessage = style({
  padding: 20,
  textAlign: "center",
  // backgroundColor: dark_bg,
  borderRadius: 6,
  border: `1px solid ${border_subtle}`,
  color: text_secondary,
  fontSize: 14,
});

// Confirmation Styles
export const confirmContainer = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  alignItems: "center",
});

export const confirmCard = style({
  // marginTop: 12,
  marginBottom: 100,
  padding: 8,
  backgroundColor: dark_bg,
  borderRadius: 8,
  border: `1px solid ${border_subtle}`,
  boxShadow: "0 12px 32px rgba(0,0,0,0.6)",  
  maxWidth: 600,
  "@media": {
    "screen and (min-width: 768px)": {
      // marginTop: 24,
      padding: 20,
      // margin: "32px auto",
    },
  },
});

export const confirmSection = style({
  display: "flex",
  flexDirection: "column",
  // gap: 10,
  paddingBottom: 8,
  marginBottom: 8,
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  alignItems: 'center',

  "@media": {
    "screen and (min-width: 768px)": {
      gap: 14,
      paddingBottom: 16,
      marginBottom: 16,
      flexDirection: "row",
    },
  },
});

export const confirmLabel = style({
  fontSize: 14,
  color: "#999",
  // marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 600,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 14,
    },
  },
});

export const confirmValue = style({
  fontSize: 18,
  fontWeight: 500,
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 22,
    },
  },
});

export const confirmDetail = style({
  fontSize: 14,
  color: text_muted,
  fontWeight: 400,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 18,
    },
  },
});

export const priceAmount = style({
  fontSize: 20,
  fontWeight: 400,
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 24,
    },
  },
});

export const policySection = style({
  padding: 12,
  backgroundColor: "#fef3c7",
  borderRadius: 4,
  border: "1px solid #fcd34d",
  marginBottom: 12,
});

export const policyText = style({
  fontSize: 15,
  color: "#92400e",
  fontWeight: 400,
});

// Button Styles
export const buttonGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: 10,
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 12,
    },
  },
});

export const backButton = style({
  padding: "12px 16px",
  backgroundColor: "transparent",
  border: "2px solid #e5e5e5",
  borderRadius: 4,
  color: text_primary,
  fontSize: 16,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 18,
    },
  },
  ":hover": {
    borderColor: button,
    color: button,
  },
});

export const confirmButton = style({
  padding: "12px 24px",
  fontSize: 18,
  fontWeight: 500,
  backgroundColor: '#22c55e',
  color: "#1a1a1a",
  borderRadius: 8,
  border: `1px solid ${border_subtle}`,
  cursor: "pointer",
  transition: "all 0.3s ease",
  letterSpacing: "0.05em",
  ':hover': {
    backgroundColor: '#16a34a',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
  ":active": {
    transform: "translateY(0)",
  },
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "16px 32px",
      fontSize: 20,
    },
  },
});

// Booking Confirmation Screen Styles
export const confirmationOverlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 12,
  animation: `${fadeIn} 0.3s ease-out`,
});

export const confirmationModal = style({
  backgroundColor: dark_bg,
  borderRadius: 16,
  padding: 16,
  maxWidth: 350,
  width: "100%",
  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.16)",
  border: `1px solid ${border_subtle}`,
  textAlign: "center",
  animation: `${slideInUp} 0.4s ease-out`,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 32,
    },
  },
});

export const confirmationIcon = style({
  width: 60,
  height: 60,
  margin: "0 auto 8px",
  backgroundColor: "#dcfce7",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "@media": {
    "screen and (min-width: 768px)": {
      width: 80,
      height: 80,
    },
  },
});

export const confirmationCheckmark = style({
  width: 36,
  height: 36,
  color: "#166534",
  "@media": {
    "screen and (min-width: 768px)": {
      width: 48,
      height: 48,
    },
  },
});

export const confirmationTitle = style({
  fontSize: 24,
  fontWeight: 600,
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 28,
    },
  },
});

export const confirmationDetails = style({
  // backgroundColor: darker_bg,
  borderRadius: 12,
  border: `1px solid ${text_secondary}`,
  padding: 16,
  marginTop: 12,
  marginBottom: 12,
  textAlign: "left",
});

export const confirmationDetailRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: 12,
  paddingBottom: 12,
  borderBottom: `1px solid ${text_primary}`,
  selectors: {
    "&:first-child": {
      paddingTop: 0,
    },
    "&:last-child": {
      borderBottom: "none",
      paddingBottom: 0,
    },
  },
});

export const confirmationDetailLabel = style({
  fontSize: 16,
  color: text_secondary,
  fontWeight: 400,
});

export const confirmationDetailValue = style({
  fontSize: 16,
  color: text_primary,
  fontWeight: 500,
  textAlign: "right",
});

export const confirmationButtons = style({
  marginTop: 24,
  marginBottom: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      marginTop: 28,
      marginBottom: 0,
    },
  },
});

export const confirmationPrimaryButton = style({
  padding: "12px 16px",
  backgroundColor: "transparent",
  color: button,
  borderRadius: 8,
  fontSize: 18,
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s ease",
  textDecoration: "none",
  border: `3px solid ${button}`,
  ':hover': {
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 22,
    },
  },
});

// Guest Booking Styles
export const guestChoiceSection = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginTop: 20,
  padding: 20,
  backgroundColor: darker_bg,
  borderRadius: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 24,
      gap: 20,
    },
  },
});

export const loginButton = style({
  padding: "14px 24px",
  fontSize: 18,
  fontWeight: 600,
  backgroundColor: button,
  color: "#1a1a1a",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  letterSpacing: "0.03em",
  textTransform: "uppercase",
  ":hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(168,220,232,0.4)",
  },
  ":active": {
    transform: "translateY(0)",
  },
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "16px 32px",
      fontSize: 20,
    },
  },
});

export const orDivider = style({
  display: "flex",
  alignItems: "center",
  gap: 16,
  color: text_muted,
  fontSize: 14,
  fontWeight: 500,
  "::before": {
    content: '""',
    flex: 1,
    height: 1,
    backgroundColor: border_subtle,
  },
  "::after": {
    content: '""',
    flex: 1,
    height: 1,
    backgroundColor: border_subtle,
  },
});

export const guestButton = style({
  padding: "14px 24px",
  fontSize: 16,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: text_primary,
  borderRadius: 8,
  border: `2px solid ${text_muted}`,
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  ":hover": {
    borderColor: button,
    color: button,
  },
  ":active": {
    transform: "scale(0.98)",
  },
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "16px 32px",
      fontSize: 18,
    },
  },
});

export const guestButtonSubtext = style({
  fontSize: 12,
  color: text_muted,
  fontWeight: 400,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 13,
    },
  },
});

export const guestFormSection = style({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginTop: 20,
  padding: 20,
  backgroundColor: darker_bg,
  borderRadius: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 24,
      gap: 20,
    },
  },
});

export const guestFormTitle = style({
  fontSize: 18,
  fontWeight: 600,
  color: text_primary,
  textAlign: "center",
  marginBottom: 8,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 20,
    },
  },
});

export const guestInputGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: 6,
});

export const guestInputLabel = style({
  fontSize: 14,
  color: text_secondary,
  fontWeight: 500,
});

export const guestInput = style({
  padding: "12px 14px",
  fontSize: 16,
  borderRadius: 8,
  backgroundColor: dark_bg,
  border: `1px solid ${border_subtle}`,
  color: text_primary,
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "::placeholder": {
    color: text_muted,
  },
  ":focus": {
    borderColor: button,
    boxShadow: "0 0 0 2px rgba(150, 207, 224, 0.2)",
  },
});

export const guestFormButtons = style({
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginTop: 8,
});

export const guestBackLink = style({
  fontSize: 14,
  color: text_muted,
  textAlign: "center",
  cursor: "pointer",
  transition: "color 0.2s ease",
  ":hover": {
    color: button,
  },
});

// Recurring Appointment Styles
export const recurringSection = style({
  marginTop: 16,
  marginBottom: 16,
  padding: 4,
  textAlign: "left",
});

export const recurringCheckboxLabel = style({
  display: "flex",
  alignItems: "center",
  gap: 10,
  cursor: "pointer",
});

export const recurringCheckbox = style({
  width: 18,
  height: 18,
  accentColor: button,
  cursor: "pointer",
});

export const recurringCheckboxText = style({
  fontSize: 18,
  fontWeight: 500,
  color: text_primary,
});

export const recurringOptions = style({
  marginTop: 16,
  display: "flex",
  flexDirection: "column",
  gap: 16,
});

export const recurringOptionGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: 6,
});

export const recurringOptionLabel = style({
  fontSize: 16,
  color: text_secondary,
  fontWeight: 500,
});

export const selectWrapper = style({
  position: "relative",
  width: "100%",
});

export const recurringSelect = style({
  padding: "10px 40px 10px 14px",
  fontSize: 16,
  borderRadius: 6,
  backgroundColor: dark_bg,
  border: `1px solid ${text_secondary}`,
  color: text_primary,
  cursor: "pointer",
  outline: "none",
  transition: "border-color 0.2s ease",

  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",

  width: "100%",
});

export const selectIcon = style({
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  pointerEvents: "none",
  color: text_secondary,
});

export const recurringDateList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  maxHeight: 200,
  overflowY: "auto",
});

export const recurringDateItem = style({
  padding: "8px 10px",
  borderRadius: 4,
  fontSize: 14,
});

export const dateAvailable = style({
  backgroundColor: "rgba(34, 197, 94, 0.1)",
  border: "1px solid rgba(34, 197, 94, 0.3)",
});

export const dateUnavailable = style({
  backgroundColor: "rgba(239, 68, 68, 0.1)",
  border: "1px solid rgba(239, 68, 68, 0.3)",
});

export const recurringDateText = style({
  color: text_primary,
  fontWeight: 400,
});

export const recurringDateWarning = style({
  fontSize: 12,
  color: "#ef4444",
  marginTop: 4,
  fontWeight: 400,
});

export const recurringWarning = style({
  marginTop: 12,
  padding: 10,
  backgroundColor: "rgba(251, 191, 36, 0.1)",
  border: "1px solid rgba(251, 191, 36, 0.3)",
  borderRadius: 6,
  fontSize: 13,
  color: "#fbbf24",
  fontWeight: 400,
});
