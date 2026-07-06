import type { Config } from "tailwindcss";

const config: Config = {
  // Library components theme via [data-theme]; the app shell themes via the
  // .dark / .light class on <html> (Orbit style). Both are wired as dark-mode
  // signals so per-theme variants work everywhere.
  darkMode: ["class", ".dark", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        // ---- library semantic tokens (Button etc.) ----
        background: "hsl(var(--as-background) / <alpha-value>)",
        foreground: "hsl(var(--as-foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--as-primary) / <alpha-value>)",
          foreground: "hsl(var(--as-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--as-secondary) / <alpha-value>)",
          foreground: "hsl(var(--as-secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--as-destructive) / <alpha-value>)",
          foreground: "hsl(var(--as-destructive-foreground) / <alpha-value>)",
        },
        muted: {
          // string form used by shell (text-muted); object keeps .foreground
          DEFAULT: "rgb(var(--muted-rgb) / <alpha-value>)",
          foreground: "hsl(var(--as-muted-foreground) / <alpha-value>)",
        },
        ring: "hsl(var(--as-ring) / <alpha-value>)",

        // ---- Orbit app-shell tokens (RGB vars) ----
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        border: "rgb(var(--border-rgb) / <alpha-value>)",
        fg: "rgb(var(--fg-rgb) / <alpha-value>)",
        "fg-invert": "rgb(var(--fg-invert) / <alpha-value>)",
        solid: "rgb(var(--solid) / <alpha-value>)",
        overlay: "rgb(var(--overlay) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          fg: "rgb(var(--accent-fg) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          // soft tint — pills, chips, badges, eyebrows
          "soft-bg": "rgb(var(--accent-soft-bg) / <alpha-value>)",
          "soft-border": "rgb(var(--accent-soft-border) / <alpha-value>)",
          "soft-fg": "rgb(var(--accent-soft-fg) / <alpha-value>)",
        },

        // Raw brand orange ramp — driven by the palette CSS vars (tokens.css)
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          200: "rgb(var(--brand-200) / <alpha-value>)",
          300: "rgb(var(--brand-300) / <alpha-value>)",
          400: "rgb(var(--brand-400) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
          800: "rgb(var(--brand-800) / <alpha-value>)",
          900: "rgb(var(--brand-900) / <alpha-value>)",
          950: "rgb(var(--brand-950) / <alpha-value>)",
        },
      },
      borderRadius: {
        asbir: "var(--as-radius)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
