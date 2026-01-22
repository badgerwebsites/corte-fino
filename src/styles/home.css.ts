import { style, keyframes } from "@vanilla-extract/css";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(20px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const fadeInUp = keyframes({
  from: { opacity: 0, transform: "translateY(30px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

export const container = style({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "#ffffff",
  color: "#1a1a1a",
  paddingTop: 60,
});

export const hero = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "85vh",
  padding: "40px 16px",
  textAlign: "center",
  position: "relative",
  animation: `${fadeIn} 0.8s ease-out`,
  background: "linear-gradient(to bottom, #fafafa 0%, #ffffff 100%)",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "80px 24px",
    },
  },
});

export const heroLogo = style({
  width: "100%",
  maxWidth: 500,
  height: 200,
  objectFit: "cover",
  objectPosition: "center",
  marginBottom: 32,
  "@media": {
    "screen and (min-width: 768px)": {
      maxWidth: 700,
      height: 250,
      marginBottom: 48,
    },
  },
});

export const heroImagePlaceholder = style({
  width: "100%",
  maxWidth: 600,
  height: 250,
  backgroundColor: "#f0f0f0",
  borderRadius: 4,
  marginBottom: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  color: "#999",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  border: "2px dashed #e5e5e5",
  transition: "all 0.3s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      height: 400,
      marginBottom: 48,
      fontSize: 14,
    },
  },
  ":hover": {
    borderColor: "#1a1a1a",
    backgroundColor: "#fafafa",
  },
});

export const title = style({
  fontSize: 36,
  fontWeight: 300,
  letterSpacing: "-0.02em",
  marginBottom: 12,
  color: "#1a1a1a",
  animation: `${fadeInUp} 0.8s ease-out 0.2s backwards`,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 72,
      marginBottom: 16,
    },
  },
});

export const subtitle = style({
  fontSize: 16,
  color: "#666",
  fontWeight: 300,
  letterSpacing: "0.05em",
  marginBottom: 32,
  animation: `${fadeInUp} 0.8s ease-out 0.3s backwards`,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 20,
      marginBottom: 48,
    },
  },
});

export const buttonGroup = style({
  display: "flex",
  gap: 12,
  flexDirection: "column",
  width: "100%",
  maxWidth: 400,
  animation: `${fadeInUp} 0.8s ease-out 0.4s backwards`,
  "@media": {
    "screen and (min-width: 768px)": {
      flexDirection: "row",
      gap: 16,
      width: "auto",
    },
  },
});

export const primaryButton = style({
  padding: "14px 32px",
  fontSize: 15,
  fontWeight: 500,
  backgroundColor: "#1a1a1a",
  color: "#ffffff",
  border: "none",
  borderRadius: 2,
  cursor: "pointer",
  transition: "all 0.3s ease",
  letterSpacing: "0.05em",
  position: "relative",
  overflow: "hidden",
  width: "100%",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "16px 48px",
      fontSize: 16,
      width: "auto",
    },
  },
  ":hover": {
    backgroundColor: "#333",
  },
  ":active": {
    transform: "scale(0.98)",
  },
});

export const secondaryButton = style({
  padding: "14px 32px",
  fontSize: 15,
  fontWeight: 500,
  backgroundColor: "transparent",
  color: "#1a1a1a",
  border: "1px solid #1a1a1a",
  borderRadius: 2,
  cursor: "pointer",
  transition: "all 0.3s ease",
  letterSpacing: "0.05em",
  width: "100%",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "16px 48px",
      fontSize: 16,
      width: "auto",
    },
  },
  ":hover": {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
  },
  ":active": {
    transform: "scale(0.98)",
  },
});

export const section = style({
  padding: "48px 16px",
  maxWidth: 1200,
  margin: "0 auto",
  width: "100%",
  borderTop: "1px solid #e5e5e5",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "80px 24px",
    },
  },
});

export const sectionTitle = style({
  fontSize: 28,
  fontWeight: 300,
  textAlign: "center",
  marginBottom: 32,
  letterSpacing: "-0.01em",
  color: "#1a1a1a",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 36,
      marginBottom: 48,
    },
  },
});

export const features = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 32,
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 48,
    },
  },
});

export const feature = style({
  padding: "24px 16px",
  textAlign: "center",
  transition: "all 0.3s ease",
  borderRadius: 4,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "32px 24px",
    },
  },
  ":hover": {
    transform: "translateY(-4px)",
  },
});

export const featureIcon = style({
  width: 64,
  height: 64,
  backgroundColor: "#f5f5f5",
  borderRadius: "50%",
  margin: "0 auto 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  color: "#999",
  fontWeight: 500,
  letterSpacing: "0.05em",
  border: "2px dashed #e5e5e5",
  transition: "all 0.3s ease",
  "@media": {
    "screen and (min-width: 768px)": {
      width: 80,
      height: 80,
      marginBottom: 24,
      fontSize: 14,
    },
  },
  selectors: {
    [`${feature}:hover &`]: {
      borderColor: "#1a1a1a",
      backgroundColor: "#fafafa",
    },
  },
});

export const featureTitle = style({
  fontSize: 18,
  fontWeight: 500,
  marginBottom: 12,
  color: "#1a1a1a",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 20,
      marginBottom: 16,
    },
  },
});

export const featureText = style({
  fontSize: 15,
  lineHeight: 1.6,
  color: "#666",
  fontWeight: 300,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const barbersSection = style({
  padding: "48px 16px",
  maxWidth: 1200,
  margin: "0 auto",
  width: "100%",
  backgroundColor: "#fafafa",
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "80px 24px",
    },
  },
});

export const barbersGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 24,
  marginTop: 32,
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 32,
      marginTop: 48,
    },
  },
});

export const barberCard = style({
  backgroundColor: "#ffffff",
  borderRadius: 4,
  overflow: "hidden",
  border: "1px solid #e5e5e5",
  transition: "all 0.3s ease",
  ":hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    borderColor: "#1a1a1a",
  },
});

export const barberImage = style({
  width: "100%",
  height: 200,
  objectFit: "cover",
  display: "block",
  "@media": {
    "screen and (min-width: 768px)": {
      height: 280,
    },
  },
});

export const barberImagePlaceholder = style({
  width: "100%",
  height: 200,
  backgroundColor: "#f5f5f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  color: "#999",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  border: "2px dashed #e5e5e5",
  "@media": {
    "screen and (min-width: 768px)": {
      height: 280,
      fontSize: 14,
    },
  },
});

export const barberInfo = style({
  padding: 20,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 24,
    },
  },
});

export const barberName = style({
  fontSize: 18,
  fontWeight: 500,
  marginBottom: 8,
  color: "#1a1a1a",
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 20,
    },
  },
});

export const barberBio = style({
  fontSize: 14,
  color: "#666",
  lineHeight: 1.6,
  marginBottom: 12,
  fontWeight: 300,
  "@media": {
    "screen and (min-width: 768px)": {
      marginBottom: 16,
    },
  },
});

export const barberSocial = style({
  fontSize: 13,
  color: "#999",
  fontWeight: 400,
});

export const contactInfo = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 8,
    },
  },
});

export const contactText = style({
  fontSize: 15,
  color: "#666",
  fontWeight: 300,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const footer = style({
  padding: 32,
  textAlign: "center",
  borderTop: "1px solid #e5e5e5",
  marginTop: 48,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 48,
      marginTop: 80,
    },
  },
});

export const footerText = style({
  fontSize: 13,
  color: "#999",
  fontWeight: 300,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 14,
    },
  },
});
