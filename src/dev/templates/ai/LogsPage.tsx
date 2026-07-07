import * as React from "react";
import { PageHeader, Badge, EmptyState } from "./ai-states";
import { useLogs, httpTone, type RequestLog } from "./store";

type EndpointFilter = "all" | RequestLog["endpoint"];
type StatusFilter = "all" | "2xx" | "4xx" | "5xx";

const ENDPOINTS: { label: string; value: EndpointFilter }[] = [
  { label: "All", value: "all" },
  { label: "chat", value: "chat" },
  { label: "completions", value: "completions" },
  { label: "embeddings", value: "embeddings" },
  { label: "images", value: "images" },
];

const STATUSES: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "2xx", value: "2xx" },
  { label: "4xx", value: "4xx" },
  { label: "5xx", value: "5xx" },
];

function statusClass(v: StatusFilter): number {
  return v === "2xx" ? 2 : v === "4xx" ? 4 : 5;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "ai-bg-accent-soft ai-accent"
          : "border border-border text-fg/60 hover:bg-overlay/[0.05] hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

export function LogsPage() {
  const logs = useLogs();
  const [endpoint, setEndpoint] = React.useState<EndpointFilter>("all");
  const [status, setStatus] = React.useState<StatusFilter>("all");

  const filtered = React.useMemo(
    () =>
      logs.filter((l) => {
        if (endpoint !== "all" && l.endpoint !== endpoint) return false;
        if (status !== "all" && Math.floor(l.status / 100) !== statusClass(status)) return false;
        return true;
      }),
    [logs, endpoint, status],
  );

  const summary = React.useMemo(() => {
    const total = filtered.length;
    const avgLatency = total ? Math.round(filtered.reduce((s, l) => s + l.latencyMs, 0) / total) : 0;
    const errors = filtered.filter((l) => l.status >= 400).length;
    return { total, avgLatency, errors };
  }, [filtered]);

  return (
    <div>
      <PageHeader title="Logs" subtitle="Every request routed through the Lumina AI gateway." />

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium uppercase tracking-wider text-fg/60 dark:text-fg/40">Endpoint</span>
          {ENDPOINTS.map((e) => (
            <Chip key={e.value} active={endpoint === e.value} onClick={() => setEndpoint(e.value)}>
              {e.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-medium uppercase tracking-wider text-fg/60 dark:text-fg/40">Status</span>
          {STATUSES.map((s) => (
            <Chip key={s.value} active={status === s.value} onClick={() => setStatus(s.value)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg border border-border bg-panel px-4 py-2.5 text-sm">
        <span className="text-fg/70 dark:text-fg/55">
          Showing <span className="font-semibold text-fg">{summary.total.toLocaleString()}</span> requests
        </span>
        <span className="text-fg/70 dark:text-fg/55">
          Avg latency <span className="font-semibold text-fg">{summary.avgLatency} ms</span>
        </span>
        <span className="text-fg/70 dark:text-fg/55">
          Errors{" "}
          <span className={`font-semibold ${summary.errors ? "text-rose-700 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"}`}>
            {summary.errors}
          </span>
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No requests match"
          description="No log entries match the current endpoint and status filters. Try widening the filter."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-panel">
          <table className="min-w-[880px] w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs capitalize text-fg">
                <th className="px-4 py-2.5 font-medium">Request ID</th>
                <th className="px-4 py-2.5 font-medium">Time</th>
                <th className="px-4 py-2.5 font-medium">Model</th>
                <th className="px-4 py-2.5 font-medium">Endpoint</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Latency</th>
                <th className="px-4 py-2.5 text-right font-medium">Tokens</th>
                <th className="px-4 py-2.5 text-right font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-border/60 last:border-0 hover:bg-overlay/[0.03]">
                  <td className="px-4 py-2.5 font-mono text-xs text-fg/60">{l.id}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-fg/70">{l.time}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-fg">{l.model}</td>
                  <td className="px-4 py-2.5">
                    <Badge className="border border-border text-fg/70">{l.endpoint}</Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge className={httpTone[l.status]}>{l.status}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-fg/70">{l.latencyMs} ms</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-fg/70">
                    {l.tokens.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs tabular-nums text-fg">
                    ${l.cost.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
