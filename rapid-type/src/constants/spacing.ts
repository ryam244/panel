/**
 * Spacing & Layout System - Rapid Type
 * Consistent spacing scale, border radius, shadows.
 */

// Base spacing unit (4px)
const BASE = 4;

export const Spacing = {
  // Micro
  "0": 0,
  "0.5": BASE * 0.5,     // 2
  "1": BASE,             // 4
  "1.5": BASE * 1.5,     // 6

  // Small
  "2": BASE * 2,         // 8
  "2.5": BASE * 2.5,     // 10
  "3": BASE * 3,         // 12
  "3.5": BASE * 3.5,     // 14

  // Medium
  "4": BASE * 4,         // 16
  "5": BASE * 5,         // 20
  "6": BASE * 6,         // 24

  // Large
  "8": BASE * 8,         // 32
  "10": BASE * 10,       // 40
  "12": BASE * 12,       // 48

  // Extra Large
  "16": BASE * 16,       // 64
  "20": BASE * 20,       // 80
  "24": BASE * 24,       // 96
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  "4xl": 32,
  full: 9999,

  // Semantic
  button: 16,
  card: 20,
  panel: 16,
  tile: 16,
  ios: 20,
} as const;

export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  tactile: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  panel: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  primary: {
    shadowColor: "#1754CF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },

  // Japanese mode: 3D border effect
  japanese: {
    shadowColor: "#1A1C1E",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
} as const;

// Screen padding
export const ScreenPadding = {
  horizontal: Spacing["6"],  // 24
  vertical: Spacing["6"],    // 24
  top: Spacing["12"],        // 48 (for safe area)
  bottom: Spacing["10"],     // 40
} as const;

// Grid gap
export const GridGap = {
  tight: Spacing["2"],       // 8
  normal: Spacing["3.5"],    // 14
  loose: Spacing["4"],       // 16
} as const;

export type SpacingType = typeof Spacing;
export type BorderRadiusType = typeof BorderRadius;
export type ShadowsType = typeof Shadows;
