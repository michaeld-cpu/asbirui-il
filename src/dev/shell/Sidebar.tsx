import * as React from "react";
import { useSidebar } from "./sidebar-context";
import asbirLogo from "@/assets/logo/asbirlogo-white.svg";

type NavItem = { label: string; href: string; icon: React.ReactNode };

const ComponentsIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const DocsIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4Z" />
    <path d="M14 2v6h6M8 13h8M8 17h5" />
  </svg>
);

const TokensIcon = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="4" />
    <path d="M14 12h6v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-6ZM4 14h6v6H6a2 2 0 0 1-2-2v-4Z" />
  </svg>
);

// Primary in-app navigation. Home lives on the logomark (top-left) — no need
// for a redundant nav item once you're inside the sidebar shell.
const topNav: NavItem[] = [
  { label: "Components", href: "#components", icon: ComponentsIcon },
  { label: "Docs", href: "#docs", icon: DocsIcon },
  { label: "Tokens", href: "#tokens", icon: TokensIcon },
];

export function Sidebar({ active }: { active: string }) {
  const { collapsed } = useSidebar();

  return (
    <aside
      className="sticky top-0 hidden h-screen shrink-0 flex-col overflow-hidden border-r border-border bg-panel transition-[width,opacity] duration-300 ease-out md:flex"
      style={{ width: collapsed ? 0 : 200, opacity: collapsed ? 0 : 1 }}
    >
      <div className="flex h-screen w-[200px] flex-col">
        {/* Brand — click to return to the landing page */}
        <a
          href="#home"
          className="flex h-14 items-center gap-2 px-3"
          aria-label="AsbirUI home"
        >
          <img src={asbirLogo} alt="AsbirUI logo" width={22} height={20} className="[html.light_&]:invert" />
          <span className="text-xl font-semibold tracking-[-0.03em] text-fg">
            AsbirUI
          </span>
        </a>

        <nav className="flex-1 overflow-y-auto py-1">
          {/* Product */}
          <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
            Library
          </div>
          <div className="space-y-0.5">
            {topNav.map((item) => {
              const isActive = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 border-l-2 px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "border-fg bg-overlay/[0.06] text-fg"
                      : "border-transparent text-fg hover:bg-overlay/[0.04]"
                  }`}
                >
                  <span className="text-fg">{item.icon}</span>
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-3 py-3">
          <p className="text-[11px] leading-relaxed text-muted">
            AsbirUI · v0.1 alpha
            <br />
            <span className="text-muted/70">Owned by AsbirTech</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
