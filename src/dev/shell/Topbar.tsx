import { useSidebar } from "./sidebar-context";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-canvas/80 px-3 backdrop-blur">
      <button
        type="button"
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-overlay/[0.06] hover:text-fg"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="9" y1="4" x2="9" y2="20" />
        </svg>
      </button>

      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
