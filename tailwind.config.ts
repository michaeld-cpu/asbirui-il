import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens driven by CSS variables (see src/styles/tokens.css)
        background: "hsl(var(--gr-background) / <alpha-value>)",
        foreground: "hsl(var(--gr-foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--gr-primary) / <alpha-value>)",
          foreground: "hsl(var(--gr-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--gr-secondary) / <alpha-value>)",
          foreground: "hsl(var(--gr-secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--gr-destructive) / <alpha-value>)",
          foreground: "hsl(var(--gr-destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--gr-muted) / <alpha-value>)",
          foreground: "hsl(var(--gr-muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--gr-border) / <alpha-value>)",
        ring: "hsl(var(--gr-ring) / <alpha-value>)",
      },
      borderRadius: {
        granite: "var(--gr-radius)",
      },
    },
  },
  plugins: [],
};

export default config;
