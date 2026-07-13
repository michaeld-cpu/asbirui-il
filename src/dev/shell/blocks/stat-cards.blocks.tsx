import type { BlockEntry } from "./entry";

const STATS = [
  { label: "Total revenue", value: "$48,080", delta: "+12.5%", up: true },
  { label: "Active users", value: "8,420", delta: "+4.1%", up: true },
  { label: "Avg. latency", value: "690 ms", delta: "-0.5%", up: false },
  { label: "Success rate", value: "97.6%", delta: "+1.2%", up: true },
];

/* ---- 01 · trend deltas ------------------------------------------------- */

function TrendDeltas() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-panel p-4">
          <p className="text-xs font-medium text-fg/60">{s.label}</p>
          <p className="mt-2 whitespace-nowrap text-2xl font-semibold tracking-tight text-fg">{s.value}</p>
          <span
            className={`mt-2 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
              s.up ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
            }`}
          >
            {s.delta}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---- 02 · sparklines ---------------------------------------------------- */

const SERIES = [
  [4, 6, 5, 8, 7, 10, 12],
  [3, 4, 6, 5, 7, 8, 9],
  [9, 8, 8, 7, 7, 6, 7],
  [5, 6, 6, 7, 8, 8, 9],
];

function sparkPoints(data: number[]): string {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  return data
    .map((v, i) => `${(i * (64 / (data.length - 1))).toFixed(1)},${(18 - ((v - min) / span) * 14).toFixed(1)}`)
    .join(" ");
}

function Sparklines() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s, i) => (
        <div key={s.label} className="rounded-xl border border-border bg-panel p-4">
          <p className="text-xs font-medium text-fg/60">{s.label}</p>
          {/* flex-wrap: on tight cards the sparkline drops below the value
              instead of overflowing; the value itself never breaks */}
          <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1.5">
            <p className="whitespace-nowrap text-2xl font-semibold tracking-tight text-fg">{s.value}</p>
            <svg viewBox="0 0 64 20" className={`h-5 w-16 shrink-0 ${s.up ? "text-emerald-500" : "text-rose-500"}`} aria-hidden="true">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sparkPoints(SERIES[i])}
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- 03 · compact panel -------------------------------------------------- */

function CompactPanel() {
  return (
    <div className="grid w-full grid-cols-2 overflow-hidden rounded-xl border border-border bg-panel lg:grid-cols-4">
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={`p-4 ${i % 2 === 1 ? "border-l border-border/60" : ""} ${i >= 2 ? "border-t border-border/60 lg:border-t-0" : ""} ${i >= 2 ? "lg:border-l" : ""}`}
        >
          <p className="text-xs font-medium text-fg/60">{s.label}</p>
          <p className="mt-1.5 text-xl font-semibold tracking-tight text-fg">
            <span className="whitespace-nowrap">{s.value}</span>
            <span className={`ml-2 text-[11px] font-medium ${s.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {s.delta}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---- 04 · icon tiles ------------------------------------------------------ */

const ICON_STATS = [
  {
    label: "Deployments",
    value: "312",
    tint: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: "API requests",
    value: "1.2M",
    tint: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
      </svg>
    ),
  },
  {
    label: "Error rate",
    value: "0.42%",
    tint: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01" />
      </svg>
    ),
  },
  {
    label: "Uptime",
    value: "99.98%",
    tint: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    ),
  },
];

function IconTiles() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ICON_STATS.map((s) => (
        <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-panel p-4">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5 ${s.tint}`}>
            {s.icon}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-medium text-fg/60">{s.label}</span>
            <span className="block whitespace-nowrap text-xl font-semibold tracking-tight text-fg">{s.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---- registry ----------------------------------------------------------- */

export const statCardsBlock: BlockEntry = {
  slug: "stat-cards",
  name: "Stat cards",
  tagline: "KPI tiles for dashboards — label, value, trend. From pill deltas and sparklines to icon tiles and a compact panel.",
  wide: true,
  variants: [
    {
      id: "stat-cards-01",
      title: "Trend deltas",
      description: "A responsive row of tiles with a tinted delta pill under each value.",
      render: () => <TrendDeltas />,
      code: `const stats = [
  { label: "Total revenue", value: "$48,080", delta: "+12.5%", up: true },
  { label: "Active users",  value: "8,420",   delta: "+4.1%",  up: true },
  { label: "Avg. latency",  value: "690 ms",  delta: "-0.5%",  up: false },
  { label: "Success rate",  value: "97.6%",   delta: "+1.2%",  up: true },
];

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {stats.map((s) => (
    <div key={s.label} className="rounded-xl border border-border bg-panel p-4">
      <p className="text-xs font-medium text-fg/60">{s.label}</p>
      <p className="mt-2 whitespace-nowrap text-2xl font-semibold tracking-tight text-fg">{s.value}</p>
      <span className={cn("mt-2 inline-flex rounded-full px-1.5 py-0.5 text-[11px] font-medium",
        s.up ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600")}>
        {s.delta}
      </span>
    </div>
  ))}
</div>`,
    },
    {
      id: "stat-cards-02",
      title: "Sparklines",
      description: "Each tile pairs the value with a 7-point trend line, colored by direction.",
      render: () => <Sparklines />,
      code: `function sparkPoints(data: number[]) {
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  return data
    .map((v, i) => (i * (64 / (data.length - 1))) + "," + (18 - ((v - min) / span) * 14))
    .join(" ");
}

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {stats.map((s) => (
    <div key={s.label} className="rounded-xl border border-border bg-panel p-4">
      <p className="text-xs font-medium text-fg/60">{s.label}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1.5">
        <p className="whitespace-nowrap text-2xl font-semibold tracking-tight text-fg">{s.value}</p>
        <svg viewBox="0 0 64 20" className={cn("h-5 w-16", s.up ? "text-emerald-500" : "text-rose-500")}>
          <polyline fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" points={sparkPoints(s.series)} />
        </svg>
      </div>
    </div>
  ))}
</div>`,
    },
    {
      id: "stat-cards-03",
      title: "Compact panel",
      description: "All four KPIs in one hairline-divided panel — for dense dashboards.",
      render: () => <CompactPanel />,
      code: `<div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-panel lg:grid-cols-4">
  {stats.map((s, i) => (
    <div key={s.label} className={cn("p-4",
      i % 2 === 1 && "border-l border-border/60",
      i >= 2 && "border-t border-border/60 lg:border-l lg:border-t-0")}>
      <p className="text-xs font-medium text-fg/60">{s.label}</p>
      <p className="mt-1.5 text-xl font-semibold tracking-tight text-fg">
        <span className="whitespace-nowrap">{s.value}</span>
        <span className={cn("ml-2 text-[11px] font-medium",
          s.up ? "text-emerald-600" : "text-rose-600")}>{s.delta}</span>
      </p>
    </div>
  ))}
</div>`,
    },
    {
      id: "stat-cards-04",
      title: "Icon tiles",
      description: "Horizontal tiles with a tinted icon square — when the metric's domain matters as much as the number.",
      render: () => <IconTiles />,
      code: `const stats = [
  { label: "Deployments", value: "312",    icon: <LayersIcon />, tint: "bg-sky-500/15 text-sky-600" },
  { label: "API requests", value: "1.2M",  icon: <BoltIcon />,   tint: "bg-violet-500/15 text-violet-600" },
  { label: "Error rate",  value: "0.42%",  icon: <AlertIcon />,  tint: "bg-amber-500/15 text-amber-600" },
  { label: "Uptime",      value: "99.98%", icon: <ShieldIcon />, tint: "bg-emerald-500/15 text-emerald-600" },
];

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {stats.map((s) => (
    <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-panel p-4">
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", s.tint)}>
        {s.icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium text-fg/60">{s.label}</span>
        <span className="block whitespace-nowrap text-xl font-semibold tracking-tight text-fg">{s.value}</span>
      </span>
    </div>
  ))}
</div>`,
    },
  ],
};
