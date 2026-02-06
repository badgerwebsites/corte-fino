import { style, keyframes } from "@vanilla-extract/css";

const darker_bg = "#101214";
const dark_bg = "#222222";

const text_primary = "#f5f5f5";
const text_secondary = "#b0b0b0";
const text_muted = "#8a8a8a";

const border_subtle = "rgba(255,255,255,0.08)";
const border_hover = "rgba(255,255,255,0.18)";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(20px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const fadeInUp = keyframes({
  from: { opacity: 0, transform: "translateY(30px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const bounce = keyframes({
  "0%, 100%": { transform: "translateY(0)" },
  "50%": { transform: "translateY(10px)" },
});

export const heroBackground = style({
  width: "100%",
  display: "flex",
  backgroundColor: darker_bg,
  justifyContent: "center",
});

export const heroFullScreen = style({
  position: "relative",
  width: "100%",
  height: "100dvh",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: darker_bg,
  "@media": {
    "screen and (min-width: 768px)": {
      width: "50%",
    },
  },
});

export const heroOverlay = style({
  position: "absolute",
  inset: 0,
  zIndex: 1,

  background: `
    linear-gradient(
      180deg,
      rgba(20, 22, 24, 0.75) 0%,
      rgba(15, 17, 19, 0.85) 100%
    )
  `,
});

export const heroContent = style({
  position: "relative",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "24px",
  animation: `${fadeIn} 1s ease-out`,
});

export const heroLogoLarge = style({
  width: "100%",
  height: "auto",
  marginBottom: 60,
  animation: `${fadeInUp} 1s ease-out 0.2s backwards`,
  "@media": {
    "screen and (min-width: 768px)": {
      maxWidth: 600,
      marginBottom: 80,
    },
  },
});

export const heroLogoWhite = style({
  filter: "brightness(0) invert(1)",
});

export const heroCarouselContainer = style({
  width: "100%",
  maxWidth: 400,
  overflow: "hidden",
  position: "relative",
  marginBottom: 60,
  animation: `${fadeInUp} 1s ease-out 0.2s backwards`,
  "@media": {
    "screen and (min-width: 768px)": {
      maxWidth: 600,
      marginBottom: 80,
    },
  },
});

export const heroCarouselTrack = style({
  display: "flex",
  transition: "transform 0.6s ease-in-out",
});

export const heroCarouselSlide = style({
  flex: "0 0 100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const heroCarouselImage = style({
  width: "100%",
  height: "auto",
  objectFit: "contain",
});

export const heroBookButton = style({
  padding: "18px 20px",
  fontSize: 18,
  fontWeight: 700,  
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  backgroundColor: '#96cfe0',
  color: '#1f1f1f',
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  transition: "all 0.3s ease",
  animation: `${fadeInUp} 1s ease-out 0.6s backwards`,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: "20px 64px",
      fontSize: 20,
    },
  },
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(168,220,232,0.4)',
  },
  ":active": {
    transform: "translateY(0)",
  },
});

export const scrollIndicator = style({
  position: "absolute",
  bottom: 36,
  left: 0,
  right: 0,
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  color: text_primary,
  animation: `${fadeIn} 1s ease-out 1s backwards`,
});

export const scrollText = style({
  fontSize: 14,
  color: text_primary,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  fontWeight: 300,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 18,
    },
  },
});

export const scrollArrow = style({
  fontSize: 24,
  color: text_primary,
  animation: `${bounce} 2s ease-in-out infinite`,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 28,
    },
  },
});

export const sectionDark = style({
  backgroundColor: dark_bg,
  padding: '40px 20px',

  '@media': {
    'screen and (min-width: 768px)': {
      padding: '60px 20px',
    },
  },
});

export const sectionDarker = style({
  backgroundColor: darker_bg,
  padding: '40px 20px',

  '@media': {
    'screen and (min-width: 768px)': {
      padding: '60px 20px',
    },
  },
});

export const barbersGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 24,
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 32,
    },
  },
});

export const barberCard = style({
  backgroundColor: darker_bg,
  borderRadius: 8,
  overflow: "hidden",
  border: `1px solid ${border_subtle}`,
  transition: "all 0.3s ease",

  ":hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
    borderColor: border_hover,
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
  backgroundColor: darker_bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  color: text_muted,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  border: `1px dashed ${border_subtle}`,
});

export const barberInfo = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
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
  color: text_primary,
});

export const barberBio = style({
  fontSize: 14,
  color: text_secondary,
  lineHeight: 1.6,
  marginBottom: 12,
});

export const barberSocial = style({
  fontSize: 14,
  color: text_secondary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const barberSocialLink = style({
  textDecoration: "none",
  transition: "opacity 0.2s ease",
  ":hover": {
    opacity: 0.7,
  },
});

export const barberSocialRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
});

export const barberSocialIcon = style({
  width: 16,
  height: 16,
  color: text_secondary,
  "@media": {
    "screen and (min-width: 768px)": {
      width: 20,
      height: 20,
    },
  },
});

export const barberPhoneLink = style({
  textDecoration: "none",
  transition: "opacity 0.2s ease",
  marginTop: 8,
  ":hover": {
    opacity: 0.7,
  },
});

export const barberPhoneRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
});

export const barberPhoneIcon = style({
  width: 16,
  height: 16,
  color: text_secondary,
  "@media": {
    "screen and (min-width: 768px)": {
      width: 20,
      height: 20,
    },
  },
});

export const barberPhone = style({
  fontSize: 14,
  color: text_secondary,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 16,
    },
  },
});

export const features = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 16,
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    },
  },
});

export const feature = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
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
  backgroundColor: text_secondary,
  borderRadius: "50%",
  margin: "0 auto 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${border_subtle}`,
  transition: "all 0.3s ease",

  "@media": {
    "screen and (min-width: 768px)": {
      width: 80,
      height: 80,
      marginBottom: 24,
    },
  },

  selectors: {
    [`${feature}:hover &`]: {
      borderColor: border_hover,
      backgroundColor: text_primary,
    },
  },
});

export const featureIconImg = style({
  width: 32,
  height: 32,
  "@media": {
    "screen and (min-width: 768px)": {
      width: 40,
      height: 40,
    },
  },
});

export const featureTitle = style({
  fontSize: 22,
  fontWeight: 500,
  marginBottom: 12,
  color: text_primary,
});

export const featureText = style({
  fontSize: 16,
  lineHeight: 1.6,
  color: text_secondary,
  fontWeight: 300,
});

export const contactInfo = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
  marginBottom: 24,
  "@media": {
    "screen and (min-width: 768px)": {
      gap: 20,
    },
  },
});

export const contactText = style({
  fontSize: 13,
  color: '#7fb8ff',
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 20,
    },
  },
});

export const contactIcon = style({
  width: 18,
  height: 18,
  color: '#7fb8ff',
  "@media": {
    "screen and (min-width: 768px)": {
      width: 24,
      height: 24,    },
  },
});

export const contactLink = style({
  textDecoration: "none",
  transition: "opacity 0.2s ease",
  color: '#4da3ff',
  ":hover": {
    opacity: 0.7,
  },
});

export const contactRow = style({
  display: "flex",
  alignItems: "center",
  gap: 6,
  justifyContent: "center",
});

export const footer = style({
  paddingTop: 24,
  paddingBottom: 24,
  textAlign: "center",
  backgroundColor: darker_bg,
  borderTop: '1px solid #ffffff',
});

export const footerText = style({
  fontSize: 14,
  color: text_muted,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 18,
    },
  },
});
