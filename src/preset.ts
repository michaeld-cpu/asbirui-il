import type { Config } from "tailwindcss";

/*
  AsbirUI Tailwind preset — the shareable design system.

  This is the SINGLE SOURCE OF TRUTH for AsbirTech's tokens: colors (mapped to
  the CSS vars in tokens.css), radius, fonts, and the shared keyframes/animations.
  Both this repo's own tailwind.config.ts AND every consuming app extend it, so
  nothing drifts.

  Consume it in an app:

    // tailwind.config.ts
    import asbirPreset from "@asbirtech/asbir-ui/preset";
    export default {
      presets: [asbirPreset],
      content: ["./src/…your source glob…"],
    };

    // once, at the app entry — supplies the TOKEN VALUES (--accent, --panel, …)
    import "@asbirtech/asbir-ui/styles.css";

  The preset gives you the class NAMES (bg-panel, text-fg, rounded-asbir, …);
  styles.css gives those classes real VALUES and the light/dark switching. You
  need both. To re-theme, override the CSS vars in your own stylesheet — every
  AsbirUI class and component follows automatically.
*/

export const asbirPreset = {
  // Library components theme via [data-theme]; the app shell themes via the
  // .dark / .light class on <html>. Both are wired as dark-mode signals so
  // per-theme variants (dark:…) work everywhere.
  darkMode: ["class", ".dark", '[data-theme="dark"]'] as unknown as Config["darkMode"],
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
        // "Asbir Sans" is our own variable typeface (self-hosted woff2, see
        // the @font-face in tokens.css); Inter/system fonts are fallbacks.
        sans: [
          "Asbir Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        asbir: ["Asbir Sans", "Inter", "sans-serif"],
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
        // dropdown/menu entrance — fade + slight scale from the transform origin
        // (content sets origin-top / origin-bottom) with a small directional lift
        "menu-in": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(-4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        // dropdown/menu exit — hold opacity through the first half so the
        // element stays visible while it slides, THEN fade.
        "menu-out": {
          "0%": { opacity: "1", transform: "scale(1) translateY(0)" },
          "50%": { opacity: "0.9", transform: "scale(0.98) translateY(-3px)" },
          "100%": { opacity: "0", transform: "scale(0.95) translateY(-8px)" },
        },
        // "copied" badge — springy pop-in for the color-swatch copy confirmation
        "copied-pop": {
          "0%": { opacity: "0", transform: "scale(0.4)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // floating promo card — soft fade + gentle rise into place, no overshoot
        "promo-in": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "promo-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(24px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "menu-in": "menu-in 0.18s cubic-bezier(0.16,1,0.3,1) both",
        "menu-out": "menu-out 0.2s cubic-bezier(0.3,0,0.6,1) both",
        "copied-pop": "copied-pop 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        "promo-in": "promo-in 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "promo-out": "promo-out 0.25s ease-in both",
      },
    },
  },
} satisfies Partial<Config>;

export default asbirPreset;
