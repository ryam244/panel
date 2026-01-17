/**
 * Color Palette - Mojic
 * Eye-friendly, high-visibility design system
 *
 * Design Principles:
 * - Avoid pure black (#000) for reduced eye strain
 * - Deep slate backgrounds for number mode (eye-friendly dark)
 * - Soft stone backgrounds for sentence mode
 * - Neumorphic soft shadows for depth
 * - High contrast text for readability
 * - Muted, brick-like red for errors (not harsh)
 * - Long play sessions without fatigue
 */

export const Colors = {
  // ===================
  // BACKGROUNDS
  // ===================
  background: {
    // Primary app background - warm cream (light mode)
    light: "#F8F6F1",
    // Deep slate - eye-friendly dark (number mode / dark mode)
    dark: "#1E2A38",
    // Soft stone - sentence mode, Japanese mode
    stone: "#E8E4DC",
    // Paper - warm white for panels
    paper: "#FDFBF7",
    // Result screen background - soft dark, not pure black
    result: "#2A3441",
    // Muted panel background
    panel: "#E5E9F0",
    // Game background (numbers)
    game: "#1E2A38",
    // Game background (sentence/japanese)
    gameSentence: "#F2F0E9",
    // Dark mode panel
    darkPanel: "#2A3441",
  },

  // ===================
  // PRIMARY BRAND
  // ===================
  primary: {
    default: "#3B7DD8",      // Softer blue, easier on eyes
    light: "#5A9AE8",
    dark: "#2A5FA8",
    muted: "#7BA3D4",
  },

  // ===================
  // TEXT COLORS
  // ===================
  text: {
    // Primary text - charcoal, NOT pure black
    primary: "#2D3340",
    // Secondary text
    secondary: "#5A6478",
    // Muted/disabled text
    muted: "#8A94A8",
    // For dark backgrounds
    inverse: "#F5F5F5",
    // Dark mode text
    dark: "#E8EAF0",
    darkSecondary: "#A8B0C0",
  },

  // ===================
  // SEMANTIC COLORS
  // ===================
  semantic: {
    // Success - sage green (calming, not harsh)
    success: "#5A8F7B",
    successLight: "#7AB89D",
    successMuted: "#A8D4BE",

    // Error - brick red (muted, not harsh neon)
    error: "#B85450",
    errorLight: "#D47A75",
    errorMuted: "#E8A8A5",
    errorBrick: "#A45A52",    // Brick-like for panels

    // Warning - soft amber
    warning: "#D4954A",
    warningLight: "#E8B06A",

    // Info - teal
    teal: "#4A9D9A",
    tealLight: "#6ABFBC",
  },

  // ===================
  // NEUTRALS
  // ===================
  neutral: {
    navyDeep: "#0A1A3F",
    navy: "#1A2332",
    charcoal: "#2D3340",       // Softer than pure black
    ink: "#3D4450",
    slate: "#64748B",
    gray: "#9CA3AF",
    lightGray: "#E5E7EB",
    white: "#FDFBF7",          // Warm white
  },

  // ===================
  // NEUMORPHIC SHADOWS (soft, non-harsh)
  // ===================
  neumorphic: {
    light: {
      shadowLight: "#FFFFFF",
      shadowDark: "#D1CCC4",
      background: "#E8E4DC",
    },
    dark: {
      shadowLight: "#2A3A4D",
      shadowDark: "#141C26",
      background: "#1E2A38",
    },
  },

  // ===================
  // PANEL COLORS
  // ===================
  panel: {
    // Default panel - cream white
    default: "#FDFBF7",
    // Muted background
    muted: "#E5E9F0",
    // Stone (Japanese mode)
    stone: "#E5E1D8",
    // Panel cleared
    cleared: "transparent",
    // Target highlight
    highlight: "#E8F0FA",
    // Pressed state
    pressed: "#D8E4F0",
    // Error state - brick red
    error: "#C4645F",
    // Correct state - sage green
    correct: "#6B9F8A",
  },

  // ===================
  // BORDERS
  // ===================
  border: {
    light: "#D8D4CC",
    default: "#C4C0B8",
    dark: "#A8A4A0",
    ui: "#CBD5E1",
    accent: "#C4C0B5",
    primary: "rgba(59, 125, 216, 0.2)",
    error: "#B85450",
  },

  // ===================
  // OVERLAYS
  // ===================
  overlay: {
    // Error vignette (peripheral darkening on mistake)
    errorVignette: "rgba(184, 84, 80, 0.12)",
    errorVignetteStrong: "rgba(184, 84, 80, 0.22)",
    // Standard overlays
    light: "rgba(255, 255, 255, 0.7)",
    dark: "rgba(30, 42, 56, 0.7)",
    backdrop: "rgba(30, 42, 56, 0.5)",
  },

  // ===================
  // TIMER COLORS
  // ===================
  timer: {
    default: "#2D3340",
    defaultDark: "#E8EAF0",
    running: "#3B7DD8",
    error: "#B85450",
    success: "#5A8F7B",
  },

  // ===================
  // RANK COLORS
  // ===================
  rank: {
    S: "#E8B44A",   // Gold
    A: "#7AB89D",   // Green
    B: "#5A9AE8",   // Blue
    C: "#A8B0C0",   // Gray
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
    primary: Colors.text.inverse,
    secondary: "#A8B0C0",
    muted: "#6B7280",
  },
  panel: {
    muted: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.1)",
  },
} as const;

export type ColorTheme = typeof Colors;
export type DarkColorTheme = typeof DarkColors;
