/**
 * Color Palette - Rapid Type
 * All colors are extracted from UI design references.
 * NEVER hardcode colors in components - always import from here.
 */

export const Colors = {
  // ===================
  // BACKGROUNDS
  // ===================
  background: {
    light: "#FFFDF5",      // Soft cream (menu screen)
    game: "#FDFBF7",       // Cream (gameplay)
    paper: "#F2F0E9",      // Japanese mode
    result: "#F4F5F7",     // Result screen
    dark: "#111621",       // Dark mode
  },

  // ===================
  // PRIMARY BRAND
  // ===================
  primary: {
    default: "#1754CF",    // Main blue
    light: "#0D93F2",      // Lighter blue (game accent)
    dark: "#0A3D8F",       // Darker blue
    muted: "#E7EBF3",      // Muted blue bg
  },

  // ===================
  // SEMANTIC
  // ===================
  semantic: {
    success: "#5A7269",    // Sage green (correct)
    warning: "#FF9500",    // Orange (clear/alert)
    error: "#FF3B30",      // Red (mistake)
    teal: "#2DD4BF",       // Teal accent
  },

  // ===================
  // NEUTRALS
  // ===================
  neutral: {
    navyDeep: "#0A1A3F",   // Deep navy
    navy: "#1A2332",       // Navy
    charcoal: "#1C1C1E",   // Deep charcoal
    ink: "#2D3136",        // Ink (text secondary)
    slate: "#64748B",      // Slate
    gray: "#9CA3AF",       // Gray
    lightGray: "#E5E7EB",  // Light gray
    white: "#FFFFFF",      // White
  },

  // ===================
  // PANELS & SURFACES
  // ===================
  panel: {
    muted: "#E5E9F0",      // Muted panel bg
    stone: "#E5E1D8",      // Japanese stone bg
    silver: "#E5E7EB",     // Soft silver
  },

  // ===================
  // BORDERS
  // ===================
  border: {
    ui: "#CBD5E1",         // UI border
    accent: "#C4C0B5",     // Japanese accent border
    light: "#F3F4F6",      // Light border
    primary: "rgba(23, 84, 207, 0.1)", // Primary tint border
  },

  // ===================
  // OVERLAYS
  // ===================
  overlay: {
    light: "rgba(255, 255, 255, 0.7)",
    dark: "rgba(0, 0, 0, 0.5)",
    backdrop: "rgba(0, 0, 0, 0.3)",
  },
} as const;

// Dark mode color overrides
export const DarkColors = {
  background: {
    primary: Colors.background.dark,
    secondary: "#1A2332",
    tertiary: "#243044",
  },
  text: {
    primary: Colors.neutral.white,
    secondary: "#9CA3AF",
    muted: "#6B7280",
  },
  panel: {
    muted: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.1)",
  },
} as const;

export type ColorTheme = typeof Colors;
export type DarkColorTheme = typeof DarkColors;
