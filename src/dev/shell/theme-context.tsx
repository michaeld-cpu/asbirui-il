import * as React from "react";

type Theme = "light" | "dark";

type ThemeContextValue = { theme: Theme; toggle: () => void };

const ThemeContext = React.createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "asbir-theme";
let themeTransitionTimer = 0;

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  // keep the library's [data-theme] contract in sync so shipped components
  // (Button etc.) re-theme alongside the shell
  root.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("dark");

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial: Theme =
      stored ??
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = React.useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      const root = document.documentElement;
      window.clearTimeout(themeTransitionTimer);
      root.classList.add("theme-transition");
      requestAnimationFrame(() => applyTheme(next));
      themeTransitionTimer = window.setTimeout(
        () => root.classList.remove("theme-transition"),
        300
      );
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

/** Inline no-flash script — set theme class + data-theme before first paint. */
export const themeNoFlashScript = `
(function(){
  try {
    var t = localStorage.getItem('${STORAGE_KEY}');
    if (!t) t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.classList.remove('light','dark');
    document.documentElement.classList.add(t);
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme','dark');
  }
})();
`;
