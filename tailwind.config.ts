import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: "#0b1326",
        "surface-deep": "#08090a",
        "surface-card": "#1e293b",
        "surface-container": "#171f33",
        "surface-container-high": "#222a3d",
        primary: "#c0c1ff",
        "primary-container": "#8083ff",
        "on-primary": "#1000a9",
        "on-primary-container": "#0d0096",
        "on-surface": "#dae2fd",
        "on-surface-variant": "#c7c4d7",
        tertiary: "#a7caf3",
        secondary: "#f5ff7d",
        outline: "#908fa0",
        "outline-variant": "#464554",
        background: "#0b1326",
        error: "#ffb4ab",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        "container-max": "1440px",
      },
      spacing: {
        "unit-sm": "8px",
        "unit-md": "16px",
        "unit-lg": "24px",
        "unit-xl": "48px",
        gutter: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
