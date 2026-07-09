import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/dropdown-menu";
import { Button } from "./ai-states";
import { AreaChart, HalftoneChart, RoundAction, Icons, ProviderMarks, ModelMarks, ProviderBadge, CountUp, dayLabels } from "./ai-ui";
import {
  platform,
  useAgents,
  useLogs,
  useProviderBreakdown,
  httpTone,
  type ProviderId,
} from "./store";

const nf = new Intl.NumberFormat("en-US");

// selectable dashboard time ranges (header period dropdown)
const PERIODS = ["Last 24 hours", "Last 7 days", "Last 30 days", "Last 90 days"] as const;
type Period = (typeof PERIODS)[number];
// compact form for the KPI label, e.g. "Last 7 days" → "7d"
const periodShort = (p: Period) =>
  ({ "Last 24 hours": "24h", "Last 7 days": "7d", "Last 30 days": "30d", "Last 90 days": "90d" })[p];

// distinct hues for the per-agent trend charts — a spectrum, NOT the brand
// color; each var is a bright pastel in dark mode and a deeper step in light
// mode so the curve stays visible on both surfaces (see ai-theme.css)
const CHART_COLORS = ["rgb(var(--ai-chart-1))", "rgb(var(--ai-chart-2))", "rgb(var(--ai-chart-3))"];

// one violet ramp — accent → lilac → lightest purple — uniform in both themes
const SEG_COLORS = ["rgb(var(--accent))", "rgb(var(--ai-seg-2))", "rgb(var(--ai-seg-3))"];
const fmtLatency = (ms: number) => `${ms} ms`;
const fmtCost = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* agent avatar — the provider's company mark in a circle filled with its
   real brand color (Anthropic keeps the A; models use the Claude starburst) */
function Avatar({ provider }: { provider: ProviderId }) {
  return <ProviderBadge provider={provider} className="h-8 w-8" logoClassName="h-4 w-4" />;
}

/* KPI cell in the divided top row — big number + violet delta pill */
function KpiCell({
  label,
  value,
  delta,
  up = true,
}: {
  label: string;
  value: React.ReactNode;
  delta?: string;
  up?: boolean;
}) {
  return (
    <div className="px-4 py-4 sm:px-6 sm:py-5">
      <p className="text-xs text-fg/70 dark:text-fg/55 sm:text-sm">{label}</p>
      {/* stack value + pill on mobile so the count-up's changing width can't
          push the pill onto another line (it caused a bounce); inline on sm+.
          tabular-nums keeps each digit fixed-width so the ramp doesn't jitter. */}
      <div className="mt-1.5 flex flex-col items-start gap-1 sm:mt-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-2xl font-semibold tabular-nums tracking-tight text-fg sm:text-3xl">{value}</span>
        {delta && (
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              up ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-fg/10 text-fg/70 dark:text-fg/55"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

export function OverviewPage() {
  const agents = useAgents();
  const allLogs = useLogs();
  const breakdown = useProviderBreakdown();

  // dashboard time range — driven by the header period dropdown
  const [period, setPeriod] = React.useState<Period>(PERIODS[1]);

  // provider filter chips (fintech-style pill row) — filters the requests table
  const [filter, setFilter] = React.useState<ProviderId | "all">("all");
  const logs = (filter === "all" ? allLogs : allLogs.filter((l) => l.provider === filter)).slice(0, 6);

  const activeAgents = agents.filter((a) => a.status === "active");
  // top 3 agents by 7d requests → the micro-bar spend columns
  const topAgents = [...activeAgents].sort((a, b) => b.requests7d - a.requests7d).slice(0, 3);

  // budget/usage segments from provider spend share
  const segs = breakdown.map((b) => ({ name: b.name, share: b.share, spend: b.spend }));
  const totalSpend = breakdown.reduce((s, b) => s + b.spend, 0);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Good afternoon, Mike</h1>
          <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">
            Here's how <span className="text-fg">Lumina</span> is routing across your connected
            providers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* period selector — internal DropdownMenu component */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-asbir border border-border bg-panel px-3 py-1.5 text-xs font-medium text-fg/80 transition-colors hover:bg-overlay/[0.05] hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {period}
              <span className="text-fg/50">{Icons.chevronDown}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[11rem]">
              <DropdownMenuLabel>Time range</DropdownMenuLabel>
              {PERIODS.map((p) => (
                <DropdownMenuItem key={p} onSelect={() => setPeriod(p)}>
                  <span className="flex-1">{p}</span>
                  {p === period && (
                    <span className="text-accent-soft-fg">{Icons.check}</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" size="sm">
            <a href="#ai/logs">View logs</a>
          </Button>
          <Button variant="primary" size="sm">
            <a href="#ai/playground">Open playground</a>
          </Button>
        </div>
      </div>

      {/* KPI row — divided columns, violet glow wash, numbers ramp up on load */}
      <div className="ai-glow rounded-xl border border-border bg-panel">
        <div className="grid grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0">
          <KpiCell
            label={`Requests (${periodShort(period)})`}
            value={<CountUp value={platform.totalRequests7d} format={(n) => nf.format(Math.round(n))} />}
            delta={platform.requestsDelta}
          />
          <KpiCell
            label="Spend (30d)"
            value={<CountUp value={platform.totalSpend30d} format={fmtCost} />}
            delta={platform.spendDelta}
          />
          <KpiCell
            label="Avg latency"
            value={<CountUp value={platform.avgLatency} format={(n) => fmtLatency(Math.round(n))} />}
            delta={platform.errorRate + " err"}
            up={false}
          />
          <KpiCell
            label="Success rate"
            value={<CountUp value={platform.successRate * 100} format={(n) => `${n.toFixed(1)}%`} />}
            delta={`${platform.activeAgents} agents`}
          />
        </div>
      </div>

      {/* per-agent request-share trend charts */}
      <div className="rounded-xl border border-border bg-panel px-6 pt-5 pb-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {topAgents.map((a, i) => (
            <div key={a.id}>
              <p className="truncate text-sm text-fg/70 dark:text-fg/55">{a.name}</p>
              <p className="mt-0.5 text-xl font-semibold tracking-tight text-fg">
                {fmtCost(a.spend30d)}
              </p>
              <AreaChart
                data={a.series}
                color={CHART_COLORS[i % CHART_COLORS.length]}
                labels={dayLabels(a.series.length)}
                className="mt-3 block h-20"
                revealDelay={i * 0.12}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2-col: segmented spend  +  provider sources — equal heights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* budget/usage segmented bar */}
        <div className="rounded-xl border border-border bg-panel p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-fg/70 dark:text-fg/55">Spend across providers</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-fg">
                {fmtCost(totalSpend)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <RoundAction aria-label="Filter">{Icons.filter}</RoundAction>
              <a href="#ai/billing">
                <RoundAction variant="accent" aria-label="Open billing">
                  {Icons.arrowUpRight}
                </RoundAction>
              </a>
            </div>
          </div>

          {/* % markers — each label drops a tall hairline down to its segment */}
          <div className="mt-8 flex text-sm text-fg">
            {segs.map((s) => (
              <div key={s.name} style={{ flex: s.share }}>
                <p>{Math.round(s.share * 100)}%</p>
                <span className="mt-2 block h-10 w-px bg-fg/25" />
              </div>
            ))}
          </div>

          {/* segmented track */}
          <div className="mt-3 flex gap-1.5">
            {segs.map((s, i) => (
              <div
                key={s.name}
                className="h-2 rounded-full"
                style={{ flex: s.share, backgroundColor: SEG_COLORS[i % SEG_COLORS.length] }}
              />
            ))}
          </div>

          {/* legend */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {segs.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 text-sm text-fg/70">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: SEG_COLORS[i % SEG_COLORS.length] }}
                />
                {s.name}
              </div>
            ))}
          </div>
        </div>

        {/* provider sources list (ref: Income Sources) */}
        <div className="rounded-xl border border-border bg-panel p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-fg/70 dark:text-fg/55">Requests this month</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-fg">
                {nf.format(breakdown.reduce((s, b) => s + b.requests, 0))}
              </p>
            </div>
            <a href="#ai/keys">
              <RoundAction variant="accent" aria-label="Manage providers">
                {Icons.arrowUpRight}
              </RoundAction>
            </a>
          </div>

          {/* halftone dot-matrix of the 14-day request series */}
          <HalftoneChart data={platform.requestsSeries} className="mt-5 h-16" />

          {/* compact horizontal provider strip — matches the sibling's height */}
          <div className="mt-5 grid grid-cols-3 divide-x divide-border border-t border-border pt-4">
            {breakdown.map((b) => (
              <div key={b.provider} className="px-4 first:pl-0 last:pr-0">
                <p className="flex items-center gap-1.5 truncate text-xs text-fg/70 dark:text-fg/55">
                  {ProviderMarks[b.provider]}
                  {b.name}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-fg">{nf.format(b.requests)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* recent requests table */}
      <div className="rounded-xl border border-border bg-panel">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <h2 className="text-base font-semibold text-fg">Recent requests</h2>
          <a href="#ai/logs">
            <RoundAction variant="accent" aria-label="View all logs">
              {Icons.arrowUpRight}
            </RoundAction>
          </a>
        </div>

        {/* provider filter chips — drive the table below */}
        <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-7 pb-4">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </Chip>
          {breakdown.map((b) => (
            <Chip
              key={b.provider}
              active={filter === b.provider}
              onClick={() => setFilter(b.provider)}
            >
              {b.name}
            </Chip>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border text-left text-xs capitalize text-fg">
                <th className="px-6 py-3 font-medium">Agent</th>
                <th className="px-6 py-3 font-medium">Model</th>
                <th className="px-6 py-3 font-medium">Endpoint</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Latency</th>
                <th className="px-6 py-3 text-right font-medium">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-fg/70 dark:text-fg/55">
                    No requests for this provider yet.
                  </td>
                </tr>
              )}
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-overlay/[0.04]">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar provider={l.provider} />
                      <span className="font-medium text-fg">{l.agent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2 text-fg/70 dark:text-fg/55">
                      {ModelMarks[l.provider]}
                      {l.model}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="rounded-md bg-overlay/[0.05] px-2 py-0.5 font-mono text-xs text-fg/70 dark:text-fg/55">
                      {l.endpoint}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${httpTone[l.status]}`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-fg/70 dark:text-fg/55">{fmtLatency(l.latencyMs)}</td>
                  <td className="px-6 py-3 text-right text-fg">{fmtCost(l.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* fintech-style filter chip: active = filled violet, rest = muted pill */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "ai-bg-accent text-white"
          : "bg-overlay/[0.06] text-fg/70 hover:bg-overlay/[0.12] hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
