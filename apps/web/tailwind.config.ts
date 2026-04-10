import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-bright": "#f8f9fa",
        "on-tertiary-fixed-variant": "#00504a",
        "on-error-container": "#93000a",
        "on-surface-variant": "#454652",
        "on-secondary-fixed-variant": "#004f53",
        "surface-container-high": "#e7e8e9",
        "outline-variant": "#c6c5d4",
        "tertiary-container": "#003733",
        "primary-fixed-dim": "#bcc2ff",
        "on-secondary-container": "#1b6d71",
        "on-surface": "#191c1d",
        "primary-fixed": "#dfe0ff",
        "on-tertiary-fixed": "#00201d",
        "secondary-container": "#a3ecf0",
        "tertiary-fixed-dim": "#71d7cd",
        "surface-tint": "#4955b3",
        "primary": "#000b60",
        "on-primary": "#ffffff",
        "on-tertiary": "#ffffff",
        "background": "#f8f9fa",
        "on-primary-fixed-variant": "#303c9a",
        "surface": "#f8f9fa",
        "surface-dim": "#d9dadb",
        "surface-container-highest": "#e1e3e4",
        "primary-container": "#142283",
        "surface-container": "#edeeef",
        "inverse-surface": "#2e3132",
        "inverse-on-surface": "#f0f1f2",
        "on-tertiary-container": "#3ca89e",
        "secondary-fixed": "#a6eff3",
        "tertiary-fixed": "#8ef4e9",
        "on-secondary": "#ffffff",
        "inverse-primary": "#bcc2ff",
        "surface-container-low": "#f3f4f5",
        "error": "#ba1a1a",
        "on-primary-fixed": "#000c62",
        "error-container": "#ffdad6",
        "on-secondary-fixed": "#002021",
        "outline": "#767683",
        "on-primary-container": "#8390f2",
        "on-error": "#ffffff",
        "on-background": "#191c1d",
        "secondary": "#14696d",
        "surface-container-lowest": "#ffffff",
        "tertiary": "#00201d",
        "secondary-fixed-dim": "#8ad3d7",
        "surface-variant": "#e1e3e4"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Manrope"],
        "body": ["Inter"],
        "label": ["Inter"]
      }
    },
  },
  plugins: [],
};
export default config;
