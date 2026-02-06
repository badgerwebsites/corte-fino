import { style, globalStyle } from "@vanilla-extract/css";

const darker_bg = "#101214";
const dark_bg = "#222222";
const text_primary = "#f5f5f5";
const text_muted = "#8a8a8a";
const accent = "#96cfe0";
// const border_subtle = "rgba(255,255,255,0.08)";
const border_hover = "rgba(255,255,255,0.18)";

export const dateTimeLayout = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "@media": {
    "screen and (min-width: 768px)": {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 16,
    },
  },
});

export const dateColumn = style({
  position: "relative",
  width: "fit-content",
});

export const calendarContainer = style({
  // padding: 20,
  // backgroundColor: darker_bg,
  // borderRadius: 8,
  // border: `1px solid ${border_subtle}`,
  // boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
  marginTop: 12,
  "@media": {
    "screen and (min-width: 768px)": {
      padding: 24,
      marginTop: 0,
    },
  },
});

export const rdpRoot = style({
  color: text_primary,
  fontSize: 18,
  "@media": {
    "screen and (min-width: 768px)": {
      fontSize: 20,
    },
  },
});

export const captionLabel = style({
  textAlign: "center",
  fontSize: 24,
  fontWeight: 600,
  color: text_primary,
  "@media": {
    "screen and (min-width: 768px)": {
        fontSize: 24,
    },
  },
});

export const nav = style({
  position: "absolute",
  left: 4,
  right: 4,
  display: "flex",
  justifyContent: "space-between",
  pointerEvents: "none",
  "@media": {
    "screen and (min-width: 768px)": {
      left: 80,
      right: 80,    
    },
  },
});

globalStyle(`${nav} button`, {
  all: "unset",
  pointerEvents: "auto",
  cursor: "pointer",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

globalStyle(`${nav} button:disabled`, {
  opacity: 0.3,
  cursor: "not-allowed",
});

globalStyle(`${nav} button svg`, {
  width: 20,
  height: 20,
  stroke: text_primary,
  strokeWidth: 2.5,
  transition: "opacity 0.15s ease",
});

globalStyle(`${nav} button:hover svg`, {
  opacity: 0.6,
});

export const day = style({
  width: 34,
  height: 34,
  borderRadius: 6,
  backgroundColor: darker_bg,
  border: `1px solid ${text_muted}`,
  color: text_primary,
  fontSize: 16,
  fontWeight: 400,
  cursor: "pointer",
  transition: "all 0.15s ease",

  ":hover": {
    backgroundColor: dark_bg,
    borderColor: border_hover,
  },
  selectors: {
    /* SELECTED — highest priority */
    '&[aria-selected="true"]': {
      backgroundColor: accent,
      color: darker_bg,
      borderColor: accent,
      fontWeight: 600,
    },

    /* TODAY but NOT selected */
    '&[data-today="true"]:not([aria-selected="true"])': {
      borderColor: accent,
      color: accent,
      fontWeight: 700,
    },

    /* DISABLED */
    '&:disabled, &[aria-disabled="true"], &[data-disabled="true"]': {
      opacity: 0.35,
      color: text_muted,
      cursor: "not-allowed",
      pointerEvents: "none",
    },
  },
  "@media": {
    "screen and (min-width: 768px)": {
      width: 48,
      height: 48,  
      fontSize: 18, 
    },
  },
});

export const dayButton = style({
  all: "unset",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
});


