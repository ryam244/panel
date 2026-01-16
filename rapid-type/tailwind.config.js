/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        "bg-light": "#FFFDF5",
        "bg-game": "#FDFBF7",
        "bg-paper": "#F2F0E9",
        "bg-result": "#F4F5F7",
        "bg-dark": "#111621",

        // Primary
        primary: {
          DEFAULT: "#1754CF",
          light: "#0D93F2",
          dark: "#0A3D8F",
        },

        // Semantic
        success: "#5A7269",
        warning: "#FF9500",
        teal: "#2DD4BF",

        // Neutrals
        navy: {
          DEFAULT: "#1A2332",
          deep: "#0A1A3F",
        },
        charcoal: "#1C1C1E",
        ink: "#2D3136",

        // Panels
        panel: {
          muted: "#E5E9F0",
          stone: "#E5E1D8",
        },

        // Borders
        "ui-border": "#CBD5E1",
        "accent-border": "#C4C0B5",
      },
      borderRadius: {
        ios: "1.25rem",
        panel: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};
