import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/dropdown-menu";
import { Icons, CountUp } from "./ai-ui";
import { useTheme } from "../../shell/theme-context";
import { useConnections, useLogs } from "./store";
import { useRuns, useActiveRunId, setActiveRunId, removeRun } from "./playground-runs";

/*
  AI console layout: compact collapsible sidebar + topbar (search, credits
  pill, notifications, user). `sub` is the sub-path used to highlight nav.

  Sidebar anatomy (fintech-admin style): one flat "Navigate" list with live
  count badges, then a pinned utility cluster (billing/team/settings + night
  mode) above the collapse control — no per-group headings.
*/

type Counts = { keys: number; logs: number };

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  match: (s: string) => boolean;
  countKey?: keyof Counts;
};

const mainNav: NavItem[] = [
  { label: "Overview", href: "#ai", icon: Icons.overview, match: (s) => s === "" },
  { label: "Playground", href: "#ai/playground", icon: Icons.playground, match: (s) => s.startsWith("playground") },
  { label: "API keys", href: "#ai/keys", icon: Icons.keys, match: (s) => s.startsWith("keys"), countKey: "keys" },
  { label: "Logs", href: "#ai/logs", icon: Icons.logs, match: (s) => s.startsWith("logs"), countKey: "logs" },
];

function NavRow({
  item,
  sub,
  collapsed,
  count,
}: {
  item: NavItem;
  sub: string;
  collapsed: boolean;
  count?: number;
}) {
  const active = item.match(sub);
  return (
    <a
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`ai-nav-item flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors ${active ? "ai-nav-active font-medium text-fg" : "text-fg/65 hover:bg-overlay/[0.04] hover:text-fg"} ${collapsed ? "justify-center" : ""}`}
    >
      <span className={active ? "text-fg" : "text-fg/70 dark:text-fg/55"}>{item.icon}</span>
      {!collapsed && item.label}
      {!collapsed && count !== undefined && (
        <span className="ml-auto rounded-full bg-overlay/[0.07] px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-fg/60 dark:text-fg/50">
          {count}
        </span>
      )}
    </a>
  );
}

/* Playground nav row with the session's Runs nested beneath it (ChatGPT-style
   history). The chevron toggles the sub-list; selecting a run opens it in the
   Playground. Collapses to just the icon on the collapsed rail. */
function PlaygroundNav({
  item,
  sub,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  sub: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const runs = useRuns();
  const activeRunId = useActiveRunId();
  const active = item.match(sub);
  const [open, setOpen] = React.useState(true);
  // auto-expand as soon as there's history to show
  React.useEffect(() => {
    if (runs.length > 0) setOpen(true);
  }, [runs.length]);

  if (collapsed) return <NavRow item={item} sub={sub} collapsed />;

  const openRun = (id: string) => {
    setActiveRunId(id);
    location.hash = "#ai/playground";
    onNavigate?.();
  };

  return (
    <div>
      <div
        className={`ai-nav-item group flex items-center gap-2.5 rounded-lg pr-1 text-[13px] transition-colors ${
          active ? "ai-nav-active font-medium text-fg" : "text-fg/65 hover:bg-overlay/[0.04] hover:text-fg"
        }`}
      >
        <a
          href={item.href}
          onClick={() => setActiveRunId(null)}
          className="flex min-w-0 flex-1 items-center gap-2.5 py-1.5 pl-2.5"
        >
          <span className={active ? "text-fg" : "text-fg/70 dark:text-fg/55"}>{item.icon}</span>
          {item.label}
        </a>
        {runs.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
            aria-label={open ? "Collapse runs" : "Expand runs"}
            aria-expanded={open}
            className="rounded-md p-1 text-fg/45 transition-colors hover:bg-overlay/[0.06] hover:text-fg/70 [&_svg]:h-3.5 [&_svg]:w-3.5"
          >
            <span className={`block transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
              {Icons.chevronDown}
            </span>
          </button>
        )}
      </div>

      {open && runs.length > 0 && (
        <ul className="mt-0.5 space-y-0.5 border-l border-border pl-2">
          {runs.map((r) => {
            const on = r.id === activeRunId;
            return (
              <li
                key={r.id}
                className={`group/run flex items-center rounded-lg pr-1 transition-colors ${
                  on ? "bg-overlay/[0.06]" : "hover:bg-overlay/[0.04]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => openRun(r.id)}
                  title={r.title}
                  className={`flex min-w-0 flex-1 items-center gap-1.5 py-1.5 pl-2.5 text-left text-[12px] transition-colors ${
                    on ? "font-medium text-fg" : "text-fg/60 dark:text-fg/45 group-hover/run:text-fg"
                  }`}
                >
                  <span className="line-clamp-1">{r.title}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeRun(r.id);
                  }}
                  aria-label={`Delete run: ${r.title}`}
                  title="Delete run"
                  className="shrink-0 rounded-md p-1 text-fg/40 opacity-0 transition-opacity hover:bg-rose-500/15 hover:text-rose-600 focus-visible:opacity-100 group-hover/run:opacity-100 dark:hover:text-rose-400 [&_svg]:h-3.5 [&_svg]:w-3.5"
                >
                  {Icons.trash}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}


/* Sidebar body shared between the desktop rail and the mobile drawer. The
   drawer always renders the full-width (non-collapsed) list; only the desktop
   rail collapses. `onNavigate` closes the drawer after a tap on mobile. */
function SidebarBody({
  sub,
  counts,
  collapsed,
  onNavigate,
}: {
  sub: string;
  counts: Counts;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  // symmetric horizontal padding when collapsed so every icon centers on the
  // same vertical axis as the logo; the wider label padding only when expanded
  const pad = collapsed ? "px-2" : "px-2.5";
  return (
    <>
      <nav className={`flex-1 overflow-y-auto py-3 ${pad}`}>
        {!collapsed && (
          <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted">Navigate</p>
        )}
        <div className="space-y-0.5" onClick={onNavigate}>
          {mainNav.map((item) =>
            item.href === "#ai/playground" ? (
              <PlaygroundNav
                key={item.href}
                item={item}
                sub={sub}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ) : (
              <NavRow
                key={item.href}
                item={item}
                sub={sub}
                collapsed={collapsed}
                count={item.countKey ? counts[item.countKey] : undefined}
              />
            ),
          )}
        </div>
      </nav>

      {/* user profile — avatar + name/role, collapses to just the avatar.
          Opens a menu upward that now owns ALL account nav (billing / team /
          settings), the night-mode toggle, and sign out — the sidebar no
          longer carries a separate utility cluster. */}
      {/* the DropdownMenu root is `inline-block` by default (shrinks to its
          trigger); force its wrapper full-width here so the trigger spans the
          whole sidebar and the chevron can sit at the right edge */}
      <div className="border-t border-border [&>div]:block [&>div]:w-full">
        <DropdownMenu>
          <DropdownMenuTrigger
            title={collapsed ? "Mike Sander" : undefined}
            className={`group flex w-full items-center gap-2.5 py-3 text-left outline-none transition-colors hover:bg-overlay/[0.04] focus-visible:bg-overlay/[0.04] ${collapsed ? "justify-center px-2" : "px-4"}`}
          >
            <span className="h-8 w-8 shrink-0 rounded-full bg-fg/20" />
            {!collapsed && (
              <>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium leading-tight text-fg">Mike Sander</span>
                  <span className="block truncate text-[11px] leading-tight text-fg/70 dark:text-fg/50">Owner</span>
                </span>
                {/* pushed to the right edge with a gap, like the nav pills' count
                    badge; rotates 180° when the menu is open (keyed off the
                    trigger's aria-expanded) */}
                <span className="ml-auto shrink-0 text-fg/60 transition-transform duration-200 group-aria-expanded:rotate-180 dark:text-fg/40">
                  {Icons.chevronDown}
                </span>
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="mb-2 w-[15rem]">
            <DropdownMenuLabel>Mike Sander · Owner</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => (location.hash = "#ai/settings")}>
              <span className="text-fg/60 dark:text-fg/45 [&_svg]:h-4 [&_svg]:w-4">{Icons.settings}</span>
              Account settings
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => (location.hash = "#ai/billing")}>
              <span className="text-fg/60 dark:text-fg/45 [&_svg]:h-4 [&_svg]:w-4">{Icons.billing}</span>
              Usage &amp; billing
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => (location.hash = "#ai/team")}>
              <span className="text-fg/60 dark:text-fg/45 [&_svg]:h-4 [&_svg]:w-4">{Icons.team}</span>
              Team
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <NightModeItem />
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => (location.hash = "#home")}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

/* Night-mode toggle rendered as a dropdown item — flips the theme WITHOUT
   closing the menu (preventDefault) so the change is visible in place. */
function NightModeItem() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        toggle();
      }}
    >
      <span className="text-fg/60 dark:text-fg/45 [&_svg]:h-4 [&_svg]:w-4">
        {dark ? Icons.moon : Icons.sun}
      </span>
      <span className="flex-1">Night mode</span>
      <span
        className={`flex h-4 w-7 items-center rounded-full p-0.5 transition-colors ${dark ? "ai-bg-accent" : "bg-fg/20"}`}
      >
        <span className={`h-3 w-3 rounded-full bg-white transition-transform ${dark ? "translate-x-3" : ""}`} />
      </span>
    </DropdownMenuItem>
  );
}

export function AiLayout({ sub, children }: { sub: string; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const counts: Counts = {
    keys: useConnections().length,
    logs: useLogs().length,
  };

  // close the drawer whenever the route changes (nav tap) and lock body scroll
  // while it's open so the page behind doesn't scroll
  React.useEffect(() => {
    setDrawerOpen(false);
  }, [sub]);
  React.useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-canvas font-sans text-fg antialiased">
      {/* desktop rail */}
      <aside
        className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-panel transition-[width] duration-200 ease-out md:flex"
        style={{ width: collapsed ? 68 : 216 }}
      >
        <div className={`flex h-14 items-center border-b border-border ${collapsed ? "justify-center px-2" : "gap-2.5 px-4"}`}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white [background-color:rgb(var(--accent))]">
            {Icons.logo}
          </span>
          {!collapsed && (
            <>
              <span className="truncate text-sm font-semibold">Lumina AI</span>
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                aria-label="Collapse sidebar"
                title="Collapse"
                className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-fg/60 transition-colors hover:bg-overlay/[0.06] hover:text-fg"
              >
                {Icons.chevronLeft}
              </button>
            </>
          )}
        </div>

        {/* when collapsed, the expand toggle gets its own centered row below the
            logo — keeps the logo square and lines the icon up with the nav */}
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Expand sidebar"
            title="Expand"
            className="mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-lg text-fg/60 transition-colors hover:bg-overlay/[0.06] hover:text-fg"
          >
            <span className="rotate-180">{Icons.chevronLeft}</span>
          </button>
        )}

        <SidebarBody sub={sub} counts={counts} collapsed={collapsed} />
      </aside>

      {/* mobile drawer: backdrop + off-canvas panel, slides in from the left */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${drawerOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-64 max-w-[80%] flex-col border-r border-border bg-panel shadow-xl transition-transform duration-200 ease-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white [background-color:rgb(var(--accent))]">
              {Icons.logo}
            </span>
            <span className="truncate text-sm font-semibold">Lumina AI</span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-md text-fg/70 transition-colors hover:bg-overlay/[0.06] hover:text-fg"
            >
              {Icons.x}
            </button>
          </div>
          <SidebarBody sub={sub} counts={counts} collapsed={false} onNavigate={() => setDrawerOpen(false)} />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-canvas/80 px-4 backdrop-blur sm:gap-4 lg:px-6">
          {/* hamburger — mobile only, opens the nav drawer (replaces the avatar) */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-fg/80 transition-colors hover:bg-overlay/[0.06] hover:text-fg md:hidden"
          >
            {Icons.menu}
          </button>
          <div className="flex h-9 max-w-sm flex-1 items-center gap-2 rounded-lg border border-border bg-panel px-3 text-sm text-muted">
            {Icons.search}<span className="text-fg/60 dark:text-fg/40">Search…</span>
            <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-fg/60 dark:text-fg/40 sm:inline">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a href="#ai/billing" className="ai-credits hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold sm:inline-flex">
              {Icons.sparkle}
              <span><CountUp value={3180} duration={1200} /> credits</span>
            </a>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-fg/70 transition-colors hover:bg-overlay/[0.06]">
              {Icons.bell}<span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full ai-bg-accent" />
            </button>
            {/* No user chip here — identity lives in the sidebar profile block
                (see SidebarBody). Kept out of the topbar to avoid duplication. */}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
