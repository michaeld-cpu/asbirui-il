import * as React from "react";
import { FilterChips } from "@/components/filter-chips";
import { Icons } from "./ai-ui";
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

const PAGE_SIZE = 12; // rows per page — keeps the table from getting congested

export function LogsPage() {
  const logs = useLogs();
  const [endpoint, setEndpoint] = React.useState<EndpointFilter>("all");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [page, setPage] = React.useState(1);

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

  // pagination — reset to page 1 whenever the filters narrow/widen the set
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  React.useEffect(() => {
    setPage(1);
  }, [endpoint, status]);
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <PageHeader title="Logs" subtitle="Every request routed through the Lumina AI gateway." />

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <FilterChips
          label="Endpoint"
          value={endpoint}
          onValueChange={setEndpoint}
          options={ENDPOINTS}
        />
        <FilterChips
          label="Status"
          value={status}
          onValueChange={setStatus}
          options={STATUSES}
        />
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
              {pageRows.map((l) => (
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

      {filtered.length > 0 && (
        <Pager
          page={current}
          pageCount={pageCount}
          rangeStart={start + 1}
          rangeEnd={start + pageRows.length}
          total={filtered.length}
          onChange={setPage}
        />
      )}
    </div>
  );
}

/* Numbered pager: "showing X–Y of Z" + Prev / page numbers / Next. Windows the
   page numbers around the current page so a large set stays compact. */
function pageWindow(page: number, count: number): (number | "…")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const lo = Math.max(2, page - 1);
  const hi = Math.min(count - 1, page + 1);
  if (lo > 2) out.push("…");
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi < count - 1) out.push("…");
  out.push(count);
  return out;
}

function Pager({
  page,
  pageCount,
  rangeStart,
  rangeEnd,
  total,
  onChange,
}: {
  page: number;
  pageCount: number;
  rangeStart: number;
  rangeEnd: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const btn =
    "flex h-8 min-w-8 items-center justify-center rounded-lg border border-border px-2.5 text-xs font-medium transition-colors disabled:opacity-40 disabled:pointer-events-none";
  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-fg/60 dark:text-fg/45">
        Showing <span className="font-medium text-fg">{rangeStart.toLocaleString()}</span>–
        <span className="font-medium text-fg">{rangeEnd.toLocaleString()}</span> of{" "}
        <span className="font-medium text-fg">{total.toLocaleString()}</span>
      </p>

      {pageCount > 1 && (
        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            className={`${btn} text-fg/70 hover:bg-overlay/[0.05] hover:text-fg`}
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <span className="[&_svg]:h-4 [&_svg]:w-4">{Icons.chevronLeft}</span>
          </button>

          {pageWindow(page, pageCount).map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-1 text-xs text-fg/40">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`${btn} tabular-nums ${
                  p === page
                    ? "ai-bg-accent-soft ai-accent [border-color:rgb(var(--accent)/0.4)]"
                    : "text-fg/70 hover:bg-overlay/[0.05] hover:text-fg"
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            type="button"
            className={`${btn} text-fg/70 hover:bg-overlay/[0.05] hover:text-fg`}
            onClick={() => onChange(page + 1)}
            disabled={page >= pageCount}
            aria-label="Next page"
          >
            <span className="rotate-180 [&_svg]:h-4 [&_svg]:w-4">{Icons.chevronLeft}</span>
          </button>
        </nav>
      )}
    </div>
  );
}
