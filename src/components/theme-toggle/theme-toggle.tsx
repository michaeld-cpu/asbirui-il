import * as React from "react";
import { cn } from "../../lib/cn";

/*
  ThemeToggle — light/dark switch that drives the `dark` class on <html>.

    <ThemeToggle />
    <ThemeToggle storageKey="my-app-theme" />

  Reads the initial theme from localStorage, falling back to the OS
  preference. Toggling flips document.documentElement.classList "dark"
  and persists the choice. Pass `theme`/`onThemeChange` to control it
  yourself (e.g. when the app already owns theme state).
*/

export type Theme = "light" | "dark";

export interface ThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Controlled theme; omit to let the toggle manage <html class="dark">. */
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
  /** localStorage key for the uncontrolled mode. */
  storageKey?: string;
}

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ theme: themeProp, onThemeChange, storageKey = "asbir-theme", className, ...props }, ref) => {
    const [internal, setInternal] = React.useState<Theme>(() => {
      if (themeProp) return themeProp;
      if (typeof window === "undefined") return "light";
      const stored = window.localStorage.getItem(storageKey);
      return stored === "dark" || stored === "light" ? stored : systemTheme();
    });
    const theme = themeProp ?? internal;

    // uncontrolled mode owns the html class + persistence
    React.useEffect(() => {
      if (themeProp) return;
      document.documentElement.classList.toggle("dark", theme === "dark");
      window.localStorage.setItem(storageKey, theme);
    }, [theme, themeProp, storageKey]);

    const toggle = () => {
      const next: Theme = theme === "dark" ? "light" : "dark";
      if (!themeProp) setInternal(next);
      onThemeChange?.(next);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={theme === "dark"}
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        onClick={toggle}
        className={cn(
          "inline-flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-asbir border border-border bg-panel text-fg/70 outline-none transition-colors hover:bg-overlay/[0.05] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...props}
      >
        {theme === "dark" ? (
          /* moon */
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ) : (
          /* sun */
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        )}
      </button>
    );
  }
);
ThemeToggle.displayName = "ThemeToggle";
