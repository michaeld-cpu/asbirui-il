import { useTheme } from "./theme-context";

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

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border p-0.5">
      <button
        type="button"
        onClick={() => theme !== "light" && toggle()}
        aria-label="Light mode"
        aria-pressed={theme === "light"}
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
          theme === "light" ? "bg-overlay/[0.1] text-fg" : "text-muted hover:text-fg"
        }`}
      >
        {SunIcon}
      </button>
      <button
        type="button"
        onClick={() => theme !== "dark" && toggle()}
        aria-label="Dark mode"
        aria-pressed={theme === "dark"}
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
          theme === "dark" ? "bg-overlay/[0.1] text-fg" : "text-muted hover:text-fg"
        }`}
      >
        {MoonIcon}
      </button>
    </div>
  );
}
