import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens driven by CSS variables (see src/styles/tokens.css)
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
          DEFAULT: "hsl(var(--as-muted) / <alpha-value>)",
          foreground: "hsl(var(--as-muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--as-border) / <alpha-value>)",
        ring: "hsl(var(--as-ring) / <alpha-value>)",
      },
      borderRadius: {
        asbir: "var(--as-radius)",
      },
    },
  },
  plugins: [],
};

export default config;
