/**
 * Typography System - Rapid Type
 * Font families, sizes, weights, and line heights.
 */

export const FontFamily = {
  display: "Lexend",           // Headings, numbers, timers
  body: "Plus Jakarta Sans",   // Body text, UI elements
  japanese: "Noto Sans JP",    // Japanese text (Sentence mode)
  system: "System",            // Fallback
} as const;

export const FontSize = {
  // Extra Small
  xs: 10,

  // Small
  sm: 12,

  // Base
  base: 14,

  // Large
  lg: 16,
  xl: 18,

  // Headings
  "2xl": 20,
  "3xl": 24,
  "4xl": 32,
  "5xl": 44,
  "6xl": 56,
  "7xl": 72,
} as const;

export const FontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

export const LineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const LetterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
  tracking: 0.2,  // UPPERCASE tracking
} as const;

// Pre-defined text styles
export const TextStyles = {
  // Timer display
  timer: {
    fontFamily: FontFamily.display,
    fontSize: FontSize["3xl"],
    fontWeight: FontWeight.extrabold,
    letterSpacing: LetterSpacing.tight,
  },

  // Large timer (result screen)
  timerLarge: {
    fontFamily: FontFamily.display,
    fontSize: FontSize["7xl"],
    fontWeight: FontWeight.extrabold,
    letterSpacing: LetterSpacing.tighter,
  },

  // Page title
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize["5xl"],
    fontWeight: FontWeight.bold,
    letterSpacing: LetterSpacing.tight,
  },

  // Section heading
  heading: {
    fontFamily: FontFamily.display,
    fontSize: FontSize["2xl"],
    fontWeight: FontWeight.bold,
  },

  // Card title
  cardTitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },

  // Body text
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    fontWeight: FontWeight.normal,
    lineHeight: LineHeight.normal,
  },

  // Small label
  label: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: LetterSpacing.tracking,
    textTransform: "uppercase" as const,
  },

  // Tile number
  tileNumber: {
    fontFamily: FontFamily.display,
    fontSize: FontSize["4xl"],
    fontWeight: FontWeight.extrabold,
  },

  // Japanese character
  japaneseChar: {
    fontFamily: FontFamily.japanese,
    fontSize: FontSize["5xl"],
    fontWeight: FontWeight.black,
  },

  // Button text
  button: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    letterSpacing: LetterSpacing.wide,
  },
} as const;

export type FontFamilyType = typeof FontFamily;
export type FontSizeType = typeof FontSize;
export type FontWeightType = typeof FontWeight;
