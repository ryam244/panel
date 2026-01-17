/**
 * Typography System - Mojic
 * High-visibility, rounded sans-serif fonts for eye comfort
 *
 * Design Principles:
 * - Rounded, thick sans-serif for high visibility
 * - Clear information hierarchy
 * - Comfortable reading for extended play sessions
 * - Japanese font with good readability
 */

export const FontFamily = {
  // Primary display font - rounded, bold, highly visible
  // Nunito: Rounded terminals, excellent for numbers
  display: "Nunito",

  // Body text - rounded, readable
  body: "Nunito",

  // Japanese text - rounded Gothic for readability
  // Zen Maru Gothic: Rounded Japanese font
  japanese: "Noto Sans JP",

  // Monospace for timers (tabular numbers)
  mono: "Lexend",

  // System fallback
  system: "System",
} as const;

export const FontSize = {
  // Extra Small - labels, hints
  xs: 10,

  // Small - secondary info
  sm: 12,

  // Base - body text
  base: 14,

  // Large - emphasized body
  lg: 16,
  xl: 18,

  // Headings
  "2xl": 20,
  "3xl": 24,
  "4xl": 32,

  // Display sizes
  "5xl": 44,
  "6xl": 56,
  "7xl": 72,

  // Extra large for tiles
  tile: 36,
  tileLarge: 48,
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
  tracking: 0.15,  // UPPERCASE tracking
} as const;

// Pre-defined text styles for consistency
export const TextStyles = {
  // Timer display - large, clear, monospace (視認性向上のため大きめに)
  timer: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize["4xl"],
    fontWeight: FontWeight.black,
    letterSpacing: LetterSpacing.tight,
  },

  // Large timer (result screen)
  timerLarge: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize["6xl"],
    fontWeight: FontWeight.black,
    letterSpacing: LetterSpacing.tighter,
  },

  // App title
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize["5xl"],
    fontWeight: FontWeight.black,
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
    fontFamily: FontFamily.display,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },

  // Body text
  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    lineHeight: LineHeight.normal,
  },

  // Small label (uppercase)
  label: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    letterSpacing: LetterSpacing.tracking,
    textTransform: "uppercase" as const,
  },

  // Tile number - large, bold, highly visible
  tileNumber: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.tile,
    fontWeight: FontWeight.black,
  },

  // Large tile number
  tileNumberLarge: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.tileLarge,
    fontWeight: FontWeight.black,
  },

  // Japanese character
  japaneseChar: {
    fontFamily: FontFamily.japanese,
    fontSize: FontSize["4xl"],
    fontWeight: FontWeight.black,
  },

  // Button text
  button: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    letterSpacing: LetterSpacing.wide,
  },

  // Stats value (result screen)
  statsValue: {
    fontFamily: FontFamily.display,
    fontSize: FontSize["2xl"],
    fontWeight: FontWeight.extrabold,
  },

  // Stats label
  statsLabel: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    letterSpacing: LetterSpacing.wide,
  },

  // Penalty text (floating +1.0s)
  penalty: {
    fontFamily: FontFamily.mono,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },

  // Rank display (S, A, B, C)
  rank: {
    fontFamily: FontFamily.display,
    fontSize: FontSize["4xl"],
    fontWeight: FontWeight.black,
  },
} as const;

export type FontFamilyType = typeof FontFamily;
export type FontSizeType = typeof FontSize;
export type FontWeightType = typeof FontWeight;
