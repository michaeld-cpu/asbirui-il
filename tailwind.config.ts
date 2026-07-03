import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens driven by CSS variables (see src/styles/tokens.css)
        background: "hsl(var(--bd-background) / <alpha-value>)",
        foreground: "hsl(var(--bd-foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--bd-primary) / <alpha-value>)",
          foreground: "hsl(var(--bd-primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--bd-secondary) / <alpha-value>)",
          foreground: "hsl(var(--bd-secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--bd-destructive) / <alpha-value>)",
          foreground: "hsl(var(--bd-destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--bd-muted) / <alpha-value>)",
          foreground: "hsl(var(--bd-muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--bd-border) / <alpha-value>)",
        ring: "hsl(var(--bd-ring) / <alpha-value>)",
      },
      borderRadius: {
        bd: "var(--bd-radius)",
      },
    },
  },
  plugins: [],
};

export default config;
