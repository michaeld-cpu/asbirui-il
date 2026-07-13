import * as React from "react";
import { cn } from "../../lib/cn";

/*
  ThemeToggle — the navbar-style light/dark switch: a segmented pill with
  sun and moon buttons, the active theme highlighted.

    <ThemeToggle />
    <ThemeToggle storageKey="my-app-theme" />

  Uncontrolled, it reads the initial theme from localStorage (falling back
  to the OS preference), flips the `dark` class on <html>, and persists the
  choice. Pass `theme`/`onThemeChange` to control it yourself (e.g. when
  the app already owns theme state).
*/

export type Theme = "light" | "dark";

export interface ThemeToggleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
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

const SunIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
  </svg>
);

const MoonIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const ThemeToggle = React.forwardRef<HTMLDivElement, ThemeToggleProps>(
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

    const setTheme = (next: Theme) => {
      if (next === theme) return;
      if (!themeProp) setInternal(next);
      onThemeChange?.(next);
    };

    const segment = (target: Theme, label: string, icon: React.ReactNode) => (
      <button
        type="button"
        aria-label={label}
        aria-pressed={theme === target}
        onClick={() => setTheme(target)}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
          theme === target ? "bg-overlay/[0.1] text-fg" : "text-fg/45 hover:text-fg"
        )}
      >
        {icon}
      </button>
    );

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Theme"
        className={cn(
          "inline-flex shrink-0 select-none items-center gap-0.5 rounded-full border border-border p-0.5",
          className
        )}
        {...props}
      >
        {segment("light", "Light theme", SunIcon)}
        {segment("dark", "Dark theme", MoonIcon)}
      </div>
    );
  }
);
ThemeToggle.displayName = "ThemeToggle";
