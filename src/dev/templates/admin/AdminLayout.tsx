import * as React from "react";
import { Icons } from "./admin-ui";

/*
  Admin panel layout shell (Filament-style): collapsible grouped sidebar +
  topbar (search, notifications, user). Purely structural — `sub` is the admin
  sub-path (e.g. "", "projects", "projects/new") used to highlight nav.
*/

const nav: { heading: string; items: { label: string; href: string; icon: React.ReactNode; match: (s: string) => boolean }[] }[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", href: "#admin", icon: Icons.dashboard, match: (s) => s === "" },
    ],
  },
  {
    heading: "Manage",
    items: [
      { label: "Projects", href: "#admin/projects", icon: Icons.projects, match: (s) => s.startsWith("projects") },
      { label: "Members", href: "#admin/members", icon: Icons.members, match: (s) => s.startsWith("members") },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Settings", href: "#admin/settings", icon: Icons.settings, match: (s) => s.startsWith("settings") },
    ],
  },
];

export function AdminLayout({
  sub,
  children,
}: {
  sub: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-canvas font-sans text-fg antialiased">
      {/* Sidebar */}
      <aside
        className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-panel transition-[width] duration-200 ease-out md:flex"
        style={{ width: collapsed ? 68 : 240 }}
      >
        {/* brand / workspace */}
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-fg text-fg-invert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 14l10 5 10-5-10-5Z" /></svg>
          </span>
          {!collapsed && <span className="truncate text-sm font-semibold">Acme Admin</span>}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {nav.map((group) => (
            <div key={group.heading} className="mb-4">
              {!collapsed && (
                <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {group.heading}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = item.match(sub);
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        active
                          ? "bg-overlay/[0.08] font-medium text-fg"
                          : "text-fg/65 hover:bg-overlay/[0.04] hover:text-fg"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <span className={active ? "text-fg" : "text-fg/55"}>{item.icon}</span>
                      {!collapsed && item.label}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex h-11 items-center gap-2 border-t border-border px-4 text-xs text-fg/55 transition-colors hover:text-fg"
        >
          <span className={`transition-transform ${collapsed ? "rotate-180" : ""}`}>
            {Icons.chevronLeft}
          </span>
          {!collapsed && "Collapse"}
        </button>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-canvas/80 px-4 backdrop-blur lg:px-6">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-md text-fg/70 transition-colors hover:bg-overlay/[0.06] md:hidden"
          >
            {Icons.menu}
          </button>

          {/* search */}
          <div className="flex h-9 max-w-sm flex-1 items-center gap-2 rounded-lg border border-border bg-panel px-3 text-sm text-muted">
            {Icons.search}
            <span className="text-fg/40">Search…</span>
            <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-fg/40 sm:inline">⌘K</kbd>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-fg/70 transition-colors hover:bg-overlay/[0.06]">
              {Icons.bell}
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-fg" />
            </button>
            <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-overlay/[0.05]">
              <span className="h-7 w-7 rounded-full bg-fg/20" />
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-medium leading-tight">Eric Sander</span>
                <span className="block text-[10px] leading-tight text-fg/50">Admin</span>
              </span>
              <span className="text-fg/40">{Icons.chevronDown}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
