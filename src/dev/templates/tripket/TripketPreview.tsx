import "./tripket-theme.css";
import { TripketDashboard } from "./TripketDashboard";
import { ACTIVE_LINE } from "./store";

// shell-only chrome details (not part of the dashboard data contract)
const LINE_CHROME = { initial: "2G", plan: "Business", tint: "bg-pink-600" };
const CURRENT_USER = { email: "mikey@tripket.ph", initials: "MD" };

/*
  The Tripket admin as a standalone preview — rendered in the `preview/tripket`
  iframe on the Templates page. Shows the real app chrome (collapsible-style
  slate sidebar + topbar with the shipping-line switcher and search) around the
  live dashboard, so the preview reads as the full product. Ported from the
  source Sidebar/Topbar; hash-nav and CSS replace Next.js Link/motion.
  "Visit live site" links to the deployed app for the complete experience.
*/

type IconProps = { className?: string };

const icons = {
  dashboard: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  voyages: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  ),
  routes: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H15a3.5 3.5 0 0 1 0 7H9a3.5 3.5 0 0 0 0 7h6.5" /></svg>
  ),
  vessels: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v3" /><path d="M6 13V8h12v5" /><path d="M3 13h18l-1.8 5.2a2 2 0 0 1-1.9 1.3H6.7a2 2 0 0 1-1.9-1.3L3 13Z" /><path d="M2.5 21c1.2 0 1.2-1 2.4-1s1.2 1 2.4 1 1.2-1 2.4-1 1.2 1 2.3 1 1.2-1 2.4-1 1.2 1 2.4 1 1.2-1 2.3-1" /></svg>
  ),
  bookings: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="M9 10h6M9 14h6M9 18h4" /></svg>
  ),
  tickets: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" /><path d="M14 6v12" strokeDasharray="2 2" /></svg>
  ),
  reports: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></svg>
  ),
  settings: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
  ),
};

const NAV: ({ href: string; label: string; icon: keyof typeof icons } | "divider")[] = [
  { href: "", label: "Dashboard", icon: "dashboard" },
  "divider",
  { href: "voyages", label: "Voyages", icon: "voyages" },
  { href: "routes", label: "Routes", icon: "routes" },
  { href: "vessels", label: "Vessels", icon: "vessels" },
  { href: "bookings", label: "Bookings", icon: "bookings" },
  { href: "tickets", label: "Tickets", icon: "tickets" },
  { href: "reports", label: "Reports", icon: "reports" },
  "divider",
  { href: "settings", label: "Settings", icon: "settings" },
];

function Sidebar() {
  return (
    <aside
      className="relative flex h-full w-60 shrink-0 flex-col border-r border-slate-200/70 px-3 py-5"
      style={{ background: "linear-gradient(180deg, rgb(248 250 252 / 0.7) 0%, rgb(248 250 252 / 0.5) 60%, rgb(255 255 255 / 0.6) 100%)" }}
    >
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">T</div>
        <div className="truncate text-[15px] font-semibold tracking-tight text-slate-900">Tripket PH</div>
      </div>
      <nav className="flex flex-1 flex-col gap-px">
        {NAV.map((e, i) =>
          e === "divider" ? (
            <div key={`d-${i}`} className="my-2 mx-2 h-px bg-slate-200/70" />
          ) : (
            (() => {
              const Icon = icons[e.icon];
              const active = e.href === "";
              return (
                <a
                  key={e.href}
                  href={`#tripket${e.href ? `/${e.href}` : ""}`}
                  className={`group relative flex items-center gap-3 rounded-md px-3 py-1.5 text-[13.5px] transition-colors duration-200 ${
                    active ? "font-medium tracking-tight text-slate-900" : "font-normal text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                  }`}
                >
                  {active && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-500" />}
                  <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-brand-600" : "text-slate-400 group-hover:text-slate-700"}`} />
                  <span>{e.label}</span>
                </a>
              );
            })()
          )
        )}
      </nav>
      <div className="mt-4 border-t border-slate-200/70 pt-3">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-100 text-[11px] font-bold text-brand-600">{CURRENT_USER.initials}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-slate-900">Admin</div>
            <div className="truncate text-[11px] text-slate-500">{CURRENT_USER.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200/70 bg-white px-6">
      <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-[10px] font-bold text-white ${LINE_CHROME.tint}`}>{LINE_CHROME.initial}</span>
        <span className="text-left">
          <span className="block text-[13px] font-semibold leading-tight tracking-tight text-slate-900">{ACTIVE_LINE.name}</span>
          <span className="block text-[10px] uppercase tracking-[0.08em] text-slate-400">{LINE_CHROME.plan}</span>
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-slate-400"><path d="M6 9l6 6 6-6" /></svg>
      </div>
      <div className="mx-6 flex max-w-xl flex-1 items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-slate-400"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="flex-1 text-sm text-slate-400">Search vessels, bookings, voyages…</span>
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
          <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5">⌘</kbd>
          <kbd className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5">K</kbd>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="relative grid h-9 w-9 place-items-center rounded-full text-slate-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M6 8a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
      </div>
    </header>
  );
}

export function TripketPreview() {
  return (
    <div className="tripket-admin flex h-screen w-full overflow-hidden bg-white text-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-w-0 flex-1 overflow-y-auto bg-slate-50/40 px-8 py-7">
          <TripketDashboard />
        </main>
      </div>
    </div>
  );
}
