/*
  Sample SaaS "projects" dashboard for the Templates section — a static hero
  screenshot of a template, composed from raw markup on the shell tokens.
  Structure is our own (chart + activity split, distinct grid), not a Catalyst
  reskin; the polish cues (roomy sidebar, greeting, delta pills, clean table)
  are kept because they read well.
*/

const HomeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" />
  </svg>
);
const ProjectsIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </svg>
);
const UsersIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.7" />
  </svg>
);
const SettingsIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </svg>
);
const ChevronDown = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const Chevrons = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
  </svg>
);

const nav = [
  { label: "Home", icon: HomeIcon },
  { label: "Projects", icon: ProjectsIcon, active: true },
  { label: "Members", icon: UsersIcon },
  { label: "Settings", icon: SettingsIcon },
];

const workspaces = ["Acme Studio", "Personal", "Client work"];

const stats = [
  { label: "Active projects", value: "24", delta: "+3", up: true },
  { label: "Monthly active users", value: "18.2k", delta: "+12.5%", up: true },
  { label: "Deployments", value: "412", delta: "+8.1%", up: true },
];

// weekly activity series (0..1) for the area chart
const series = [
  0.18, 0.12, 0.2, 0.16, 0.28, 0.22, 0.65, 0.42,
];
const seriesLabels = [
  "Jan 21",
  "Jan 22",
  "Jan 23",
  "Jan 24",
  "Jan 25",
  "Jan 26",
  "Jan 27",
  "Jan 28",
];

/*
  Smooth filled area chart (SVG). Builds a Catmull-Rom-smoothed path through
  the points, fills below it with a fading gradient, and strokes the line on
  top. Monochrome (fg token) to match the rest of the preview.
*/
function AreaChart({ data }: { data: number[] }) {
  const W = 640;
  const H = 200;
  const pad = 6;
  const n = data.length;
  const x = (i: number) => (i / (n - 1)) * (W - pad * 2) + pad;
  const y = (v: number) => H - pad - v * (H - pad * 2);

  const pts = data.map((v, i) => [x(i), y(v)] as const);

  // Catmull-Rom → cubic Bézier for a smooth curve
  let line = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    line += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  const area = `${line} L ${x(n - 1)} ${H} L ${x(0)} ${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-40 w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--fg-rgb))" stopOpacity="0.28" />
          <stop offset="100%" stopColor="rgb(var(--fg-rgb))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* horizontal gridlines */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={pad}
          x2={W - pad}
          y1={H - pad - g * (H - pad * 2)}
          y2={H - pad - g * (H - pad * 2)}
          stroke="rgb(var(--fg-rgb))"
          strokeOpacity="0.08"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
      ))}
      <path d={area} fill="url(#areaFill)" />
      <path
        d={line}
        fill="none"
        stroke="rgb(var(--fg-rgb))"
        strokeOpacity="0.8"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const projects = [
  { name: "Marketing site", owner: "Leslie A.", status: "Live", updated: "2h ago" },
  { name: "Mobile app", owner: "Michael F.", status: "In review", updated: "5h ago" },
  { name: "Design system", owner: "Dries V.", status: "Live", updated: "1d ago" },
  { name: "Internal tools", owner: "Lindsay W.", status: "Paused", updated: "3d ago" },
];

const statusTone: Record<string, string> = {
  Live: "bg-emerald-500/15 text-emerald-400",
  "In review": "bg-amber-500/15 text-amber-400",
  Paused: "bg-fg/10 text-fg/50",
};

// monochrome avatars for now — flat gray, no per-user color
const AVATAR = "bg-fg/20";

function PeriodSelect() {
  return (
    <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-1.5 text-sm text-fg">
      This month
      <span className="text-muted">{Chevrons}</span>
    </button>
  );
}

export function DashboardPreview() {
  return (
    <div className="flex h-full w-full bg-canvas text-fg">
      {/* sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-panel p-4 md:flex">
        <button className="mb-6 flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-overlay/[0.05]">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-fg text-fg-invert">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 14l10 5 10-5-10-5Z" /></svg>
          </span>
          <span className="text-sm font-semibold">Acme Studio</span>
          <span className="ml-auto text-muted">{ChevronDown}</span>
        </button>

        <nav className="space-y-0.5">
          {nav.map((n) => (
            <div
              key={n.label}
              className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm ${
                n.active ? "bg-overlay/[0.07] font-medium text-fg" : "text-fg/70"
              }`}
            >
              <span className={n.active ? "text-fg" : "text-fg/55"}>{n.icon}</span>
              {n.label}
            </div>
          ))}
        </nav>

        <p className="mb-2 mt-7 px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted">
          Workspaces
        </p>
        <div className="space-y-0.5">
          {workspaces.map((w) => (
            <div key={w} className="truncate rounded-lg px-2.5 py-1.5 text-sm text-fg/70">
              {w}
            </div>
          ))}
        </div>
      </aside>

      {/* main */}
      <div className="min-w-0 flex-1 overflow-hidden px-6 py-6 lg:px-9 lg:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Good afternoon, Eric
            </h2>
            <p className="mt-1 text-sm text-fg/55">
              Here's what's happening across your workspace.
            </p>
          </div>
          <PeriodSelect />
        </div>

        {/* stat cells */}
        <div className="mt-6 grid grid-cols-3 gap-x-8">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-border pt-4">
              <p className="text-sm text-fg/60">{s.label}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${
                    s.up ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                  }`}
                >
                  {s.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* our own composition: chart (2/3) + activity feed (1/3) */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Activity</h3>
              <span className="text-xs text-fg/50">Last 12 weeks</span>
            </div>
            <AreaChart data={series} />
            <div className="mt-2 flex justify-between px-1.5 text-[10px] text-fg/40">
              {seriesLabels.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-base font-semibold">Recent members</h3>
            <div className="space-y-3.5">
              {["Leslie Alexander", "Michael Foster", "Dries Vincent", "Lindsay Walton"].map(
                (name) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className={`h-7 w-7 shrink-0 rounded-full ${AVATAR}`} />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-fg">{name}</p>
                      <p className="text-xs text-fg/45">joined this week</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* projects table */}
        <h3 className="mb-2 mt-9 text-base font-semibold">Projects</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-sm text-fg/50">
              <th className="py-2.5 pr-4 font-normal">Name</th>
              <th className="py-2.5 pr-4 font-normal">Owner</th>
              <th className="py-2.5 pr-4 font-normal">Status</th>
              <th className="py-2.5 font-normal">Updated</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.name} className="border-b border-border/60 text-sm">
                <td className="py-3 pr-4 font-medium text-fg">{p.name}</td>
                <td className="py-3 pr-4">
                  <span className="flex items-center gap-2">
                    <span className={`h-6 w-6 shrink-0 rounded-full ${AVATAR}`} />
                    <span className="text-fg/80">{p.owner}</span>
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${statusTone[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3 text-fg/55">{p.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
