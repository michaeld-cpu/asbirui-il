/*
  Tripket admin — Dashboard (single-file port for the AsbirUI docs preview)
  ------------------------------------------------------------------------
  A faithful, self-contained port of the tripket-admin dashboard page
  (KPI strip + Weekly revenue + Ticket bookings + Pending bookings +
  Today's departures). All sub-components are inlined as local components;
  the only external imports are React, framer (via @/motion), and the
  pre-existing mock store.

  Rendering notes:
  - No data fetching, no skeletons, no loading/empty states — the mock
    data renders immediately (the source's async lifecycle is dropped).
  - The caller wraps this in a `.tripket-admin` (light) surface, so no
    theme wrapper here. The root fades in via `animate-fade-up` (Lumina's
    stock page-entrance utility).
  - Chart-specific keyframes (bar grow, left→right line reveal, dot pop)
    and the bar-hover dimming live in the source's globals.css, which this
    app doesn't ship — they're reproduced in a scoped <style> block below,
    class-prefixed `tk-` so they can't collide with anything else.
*/

import * as React from "react";
import { motion } from "@/motion";
import {
  ACTIVE_LINE,
  KPI_DATA,
  WEEKLY_REVENUE,
  BOOKINGS_6M,
  PENDING,
  DEPARTURES,
  type WeeklyRevenueDay,
  type BookingsMonth,
  type PendingBooking,
  type Departure,
} from "./store";

/* ---- scoped chart animation CSS -------------------------------------- */
/*
  Ports these rules from tripket-admin/app/globals.css. Every selector is
  namespaced under `.tk-chart-scope` and uses `tk-` prefixed keyframes so
  it stays isolated inside the preview.
*/
const CHART_CSS = `
.tk-chart-scope {
  --tk-ease-out-strong: cubic-bezier(0.16, 1, 0.3, 1);
  --tk-ease-out-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
@keyframes tk-bar-grow {
  from { opacity: 0; transform: scaleY(0.05); }
  to   { opacity: 1; transform: scaleY(1); }
}
.tk-animate-bar {
  transform-origin: bottom;
  animation: tk-bar-grow 900ms var(--tk-ease-out-drawer) both;
}
@keyframes tk-reveal-lr {
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0 0 0); }
}
.tk-animate-reveal-lr {
  animation: tk-reveal-lr 1400ms var(--tk-ease-out-strong) both;
}
@keyframes tk-dot-pop {
  0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
  60%  { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.tk-animate-dot {
  animation: tk-dot-pop 420ms var(--tk-ease-out-strong) both;
}
.tk-bar-group > div:not(.tk-tooltip) {
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
.tk-chart-bars:hover .tk-bar-group > div:not(.tk-tooltip) {
  opacity: 0.3;
}
.tk-chart-bars:hover .tk-bar-group:hover > div:not(.tk-tooltip) {
  opacity: 1;
}
`;

/* ---- CountUp ---------------------------------------------------------- */
/*
  Framer-free reimplementation: eases from 0 → value over ~1.2s on mount
  via requestAnimationFrame (cubic ease-out). Matches the source's intent
  (count up once when it appears) without pulling motion values in.
*/
function CountUp({
  value,
  prefix = "",
  suffix = "",
  format,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const rounded = Math.round(display);
  const formatted = format ? format(rounded) : rounded.toLocaleString();

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}

/* ---- PageHeader ------------------------------------------------------- */
/*
  Trimmed version of the source PageHeader — title + subtitle chip, plus the
  static date-range + Export controls on the right (rendered inert here so
  the header reads faithfully without wiring a date picker).
*/
function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {subtitle && (
            <span className="rounded-md border border-slate-200 px-2 py-0.5 text-xs text-slate-600">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-[background-color,transform] duration-150 ease-out hover:bg-slate-50 active:scale-[0.97]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-500">
            <rect x="3" y="4" width="18" height="17" rx="3" />
            <path d="M8 2v4M16 2v4M3 10h18" />
          </svg>
          Last 14 days
        </button>
        <button className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-[background-color,transform] duration-150 ease-out hover:bg-slate-50 active:scale-[0.97]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-slate-500">
            <rect x="4" y="4" width="16" height="16" rx="3" />
            <path d="M12 9v6" />
            <path d="m9 12 3 3 3-3" />
          </svg>
          Export
        </button>
      </div>
    </div>
  );
}

/* ---- KPI strip -------------------------------------------------------- */
type CardSpec = { label: string; numeric: number; prefix?: string; trend: number };

function KpiStrip() {
  const kpi = KPI_DATA;
  const cards: CardSpec[] = [
    { label: "Total Revenue", numeric: kpi.totalRevenue, prefix: "₱", trend: kpi.trends.revenue },
    { label: "Tickets Issued", numeric: kpi.ticketsIssued, trend: kpi.trends.tickets },
    { label: "Cancellations", numeric: kpi.cancellations, trend: kpi.trends.cancellations },
    { label: "Vehicle Bookings", numeric: kpi.vehicleBookings, trend: kpi.trends.vehicles },
  ];

  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 lg:grid-cols-4 lg:divide-y-0">
      {cards.map((c) => {
        const up = c.trend >= 0;
        const trendTone = up
          ? "text-emerald-700 bg-emerald-50 ring-emerald-200/60"
          : "text-rose-700 bg-rose-50 ring-rose-200/60";
        return (
          <div key={c.label} className="relative px-6 py-5">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">{c.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[28px] font-semibold leading-none tracking-tight text-slate-900 tabular-nums">
                <CountUp value={c.numeric} prefix={c.prefix} />
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium ring-1 ${trendTone}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className={`h-3 w-3 ${up ? "" : "rotate-180"}`}>
                  <path d="M12 19V5" />
                  <path d="m6 11 6-6 6 6" />
                </svg>
                {Math.abs(c.trend)}%
              </span>
              <span className="text-[11px] text-slate-500">vs. last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---- WeeklyRevenueChart ---------------------------------------------- */
function fmtPeso(n: number) {
  if (n === 0) return "₱0k";
  return `₱${Math.round(n / 1000)}k`;
}

function buildTicks(data: WeeklyRevenueDay[]) {
  const maxRaw = Math.max(0, ...data.flatMap((d) => [d.thisWeek, d.lastWeek]));
  const niceMax = maxRaw === 0 ? 200000 : Math.ceil(maxRaw / 50000) * 50000;
  return {
    yMax: niceMax,
    ticks: [0, niceMax * 0.25, niceMax * 0.5, niceMax * 0.75, niceMax].map((t) => Math.round(t)),
  };
}

function WeeklyRevenueChart({ data }: { data: WeeklyRevenueDay[] }) {
  const { yMax, ticks } = buildTicks(data);
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Weekly revenue</h2>
          <p className="mt-0.5 text-[11px] text-slate-500 tabular-nums">May 1 – May 31, 2026</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-brand-500" />
            <span className="text-slate-600">This week</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-brand-500/25" />
            <span className="text-slate-600">Last week</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {/* Y axis labels */}
        <div className="flex h-56 w-12 flex-col-reverse justify-between pb-6 text-[11px] text-gray-400">
          {ticks.map((t) => (
            <div key={t} className="leading-none">{fmtPeso(t)}</div>
          ))}
        </div>

        {/* Chart area */}
        <div className="relative flex-1">
          {/* Gridlines */}
          <div className="absolute inset-0 bottom-6 flex flex-col-reverse justify-between">
            {ticks.map((t) => (
              <div key={t} className="border-t border-dashed border-gray-200" />
            ))}
          </div>

          {/* Bars */}
          <div className="tk-chart-bars relative flex h-56 items-end justify-between gap-3 pb-6">
            {data.map((d, i) => {
              const thisPct = (d.thisWeek / yMax) * 100;
              const lastPct = (d.lastWeek / yMax) * 100;
              const delta = ((d.thisWeek - d.lastWeek) / d.lastWeek) * 100;
              const up = delta >= 0;
              return (
                <div key={d.label} className="tk-bar-group group relative flex h-full flex-1 items-end justify-center gap-1">
                  <div
                    className="tk-animate-bar w-4 rounded-t-sm bg-brand-500"
                    style={{ height: `${thisPct}%`, animationDelay: `${i * 90}ms` }}
                  />
                  <div
                    className="tk-animate-bar w-4 rounded-t-sm bg-brand-500/20"
                    style={{ height: `${lastPct}%`, animationDelay: `${i * 90 + 50}ms` }}
                  />

                  {/* Tooltip — always to the right, hugging the bar */}
                  <div
                    className="tk-tooltip pointer-events-none absolute left-full z-50 ml-0.5 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-opacity duration-150 group-hover:opacity-100"
                    style={{ bottom: `${Math.max(thisPct, lastPct)}%`, transform: "translateY(50%)" }}
                  >
                    <div className="mb-1 font-semibold text-gray-900">{d.label}</div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-sm bg-brand-500" />
                      <span className="text-gray-500">This week</span>
                      <span className="ml-auto font-medium text-gray-900">₱{d.thisWeek.toLocaleString()}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-sm bg-brand-500/20" />
                      <span className="text-gray-500">Last week</span>
                      <span className="ml-auto font-medium text-gray-900">₱{d.lastWeek.toLocaleString()}</span>
                    </div>
                    <div className={`mt-1 border-t border-gray-100 pt-1 text-[11px] font-semibold ${up ? "text-green-600" : "text-red-600"}`}>
                      {up ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}% vs last week
                    </div>
                  </div>

                  <div className="absolute bottom-0 translate-y-5 text-[11px] text-gray-500">{d.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- TicketBookingsChart --------------------------------------------- */
const TB_W = 760;
const TB_H = 200;

function fmtTick(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

function smoothPath(points: { x: number; y: number }[]) {
  // Plateau-with-curve style: each data point sits on a short flat segment,
  // then a soft S-curve transitions to the next plateau.
  if (points.length < 2) return "";
  const d: string[] = [`M ${points[0].x} ${points[0].y}`];
  const plateauFrac = 0.22;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dx = p2.x - p1.x;
    const flatEndX = p1.x + dx * plateauFrac;
    const flatStartX = p2.x - dx * plateauFrac;
    d.push(`L ${flatEndX} ${p1.y}`);
    const c1x = flatEndX + (flatStartX - flatEndX) * 0.5;
    const c2x = flatStartX - (flatStartX - flatEndX) * 0.5;
    d.push(`C ${c1x} ${p1.y}, ${c2x} ${p2.y}, ${flatStartX} ${p2.y}`);
    d.push(`L ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}

function TicketBookingsChart({ data, showTotal = true }: { data: BookingsMonth[]; showTotal?: boolean }) {
  const [hover, setHover] = React.useState<number | null>(null);
  const hoverTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = (i: number) => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    if (hover !== null) {
      if (hoverTimer.current) {
        clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
      }
      setHover(i);
    } else {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => {
        setHover(i);
        hoverTimer.current = null;
      }, 200);
    }
  };
  const handleLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      setHover(null);
      leaveTimer.current = null;
    }, 80);
  };

  const { paxPts, vehPts, paxArea, vehArea, paxLine, vehLine, ticks } = React.useMemo(() => {
    const maxRaw = Math.max(...data.map((d) => Math.max(d.pax, d.veh)));
    const niceMax = Math.ceil(maxRaw / 200) * 200;
    const yMax = niceMax + (niceMax % 400 === 0 ? 0 : 400 - (niceMax % 400));
    const steps = 4;
    const ticks = Array.from({ length: steps + 1 }, (_, i) => Math.round((yMax / steps) * i));

    const stepX = TB_W / Math.max(1, data.length - 1);
    const project = (val: number, i: number) => ({
      x: i * stepX,
      y: (1 - val / yMax) * TB_H,
    });

    const paxPts = data.map((d, i) => project(d.pax, i));
    const vehPts = data.map((d, i) => project(d.veh, i));
    const paxLine = smoothPath(paxPts);
    const vehLine = smoothPath(vehPts);
    const paxArea = `${paxLine} L ${paxPts[paxPts.length - 1].x} ${TB_H} L ${paxPts[0].x} ${TB_H} Z`;
    const vehArea = `${vehLine} L ${vehPts[vehPts.length - 1].x} ${TB_H} L ${vehPts[0].x} ${TB_H} Z`;

    return { paxPts, vehPts, paxArea, vehArea, paxLine, vehLine, ticks };
  }, [data]);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Total ticket bookings</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">Passengers + vehicles</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-brand-500" />
            <span className="text-slate-600">Pax</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-blue-500" />
            <span className="text-slate-600">Veh</span>
          </div>
        </div>
      </div>

      {/* Outer grid identical to WeeklyRevenueChart: Y col + plot column */}
      <div className="mt-6 flex gap-3">
        {/* Y axis labels */}
        <div className="flex h-56 w-12 flex-col-reverse justify-between pb-6 text-[11px] text-gray-400">
          {ticks.map((t) => (
            <div key={t} className="leading-none">{fmtTick(t)}</div>
          ))}
        </div>

        {/* Plot area */}
        <div className="relative flex-1">
          {/* Gridlines */}
          <div className="absolute inset-0 bottom-6 flex flex-col-reverse justify-between">
            {ticks.map((t, i) => (
              <div
                key={t}
                className={i === 0 ? "border-t border-gray-300" : "border-t border-dashed border-gray-200"}
              />
            ))}
          </div>

          {/* Plot area (chart marks) */}
          <div className="relative h-56 pb-6">
            <div className="relative h-full w-full">
              {/* Lines + areas — clipped reveal from left to right */}
              <div className="absolute inset-0 tk-animate-reveal-lr">
                <svg viewBox={`0 0 ${TB_W} ${TB_H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id="tkPaxFill6" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="tkVehFill6" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.20" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path d={vehArea} fill="url(#tkVehFill6)" />
                  <path d={vehLine} fill="none" stroke="#3b82f6" strokeWidth={2.5} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={paxArea} fill="url(#tkPaxFill6)" />
                  <path d={paxLine} fill="none" stroke="#ea580c" strokeWidth={2.5} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* HTML dots — pop in synced with the reveal */}
              {paxPts.map((p, i) => (
                <div
                  key={`pd-${i}`}
                  className="tk-animate-dot absolute h-2.5 w-2.5 rounded-full border-2 border-white"
                  style={{
                    left: `${(p.x / TB_W) * 100}%`,
                    top: `${(p.y / TB_H) * 100}%`,
                    backgroundColor: "#ea580c",
                    animationDelay: `${(p.x / TB_W) * 1300}ms`,
                  }}
                />
              ))}
              {vehPts.map((p, i) => (
                <div
                  key={`vd-${i}`}
                  className="tk-animate-dot absolute h-2.5 w-2.5 rounded-full border-2 border-white"
                  style={{
                    left: `${(p.x / TB_W) * 100}%`,
                    top: `${(p.y / TB_H) * 100}%`,
                    backgroundColor: "#3b82f6",
                    animationDelay: `${(p.x / TB_W) * 1300}ms`,
                  }}
                />
              ))}

              {/* Hover crosshair */}
              {hover !== null && (
                <div
                  className="absolute top-0 bottom-0 w-px border-l border-dashed border-gray-400"
                  style={{ left: `${(paxPts[hover].x / TB_W) * 100}%` }}
                />
              )}

              {/* Hover hit zones */}
              {data.map((d, i) => {
                const colWPct = 100 / data.length;
                return (
                  <div
                    key={`hit-${d.label}`}
                    className="absolute top-0 bottom-0"
                    style={{ left: `${(paxPts[i].x / TB_W) * 100 - colWPct / 2}%`, width: `${colWPct}%` }}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={handleLeave}
                  />
                );
              })}

              {/* Tooltip */}
              {(() => {
                const idx = hover ?? 0;
                const d = data[idx];
                const xPct = (paxPts[idx].x / TB_W) * 100;
                const flipLeft = xPct > 70;
                const yPct = (Math.min(paxPts[idx].y, vehPts[idx].y) / TB_H) * 100;
                return (
                  <div
                    className={`pointer-events-none absolute z-20 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-opacity duration-200 ease-out ${
                      hover !== null ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      left: `${xPct}%`,
                      top: `${yPct}%`,
                      transform: `translate(${flipLeft ? "calc(-100% - 12px)" : "12px"}, -50%)`,
                    }}
                  >
                    <div className="mb-1 font-semibold text-gray-900">{d.label}</div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
                      <span className="text-gray-500">Pax</span>
                      <span className="ml-auto font-medium text-gray-900">{d.pax.toLocaleString()}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                      <span className="text-gray-500">Veh</span>
                      <span className="ml-auto font-medium text-gray-900">{d.veh.toLocaleString()}</span>
                    </div>
                    {showTotal && (
                      <div className="mt-1 border-t border-gray-100 pt-1 text-[11px] font-semibold text-gray-900">
                        Total {(d.pax + d.veh).toLocaleString()}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* X axis labels */}
            {data.map((d, i) => (
              <div
                key={d.label}
                className="absolute bottom-6 translate-y-5 -translate-x-1/2 text-[11px] text-gray-500"
                style={{ left: `${(paxPts[i].x / TB_W) * 100}%` }}
              >
                {d.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- PendingAgingList ------------------------------------------------- */
const statusTone: Record<PendingBooking["status"], string> = {
  Submitted: "bg-brand-50 text-brand-700",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-slate-100 text-slate-500",
};

function relativeAge(mins: number): string {
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h ago` : `${h}h ${m}m ago`;
}

function PendingAgingList({ data }: { data: PendingBooking[] }) {
  const sorted = [...data].sort((a, b) => b.ageMinutes - a.ageMinutes);
  const over1h = sorted.filter((d) => d.ageMinutes >= 60).length;
  const under1h = sorted.length - over1h;
  const [copiedRef, setCopiedRef] = React.useState<string | null>(null);

  const handleCopy = async (ref: string) => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopiedRef(ref);
      setTimeout(() => setCopiedRef((prev) => (prev === ref ? null : prev)), 1500);
    } catch {
      /* clipboard unavailable in the preview iframe — no-op */
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
      {/* Section header */}
      <header className="flex items-start justify-between gap-4 px-6 pb-4 pt-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">Pending bookings</h2>
            <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-brand-700">
              {sorted.length} awaiting action
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            <span className="font-medium text-slate-700">{over1h}</span> aging past 1h ·{" "}
            <span className="font-medium text-slate-700">{under1h}</span> recent · sorted oldest first
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-[background-color,transform] duration-150 ease-out hover:bg-slate-50 active:scale-[0.97]">
          View all
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </header>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50/50 text-left text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <th className="px-6 py-2.5 font-medium">Ref</th>
            <th className="px-2 py-2.5 font-medium">Status</th>
            <th className="px-2 py-2.5 font-medium">Ticketholder</th>
            <th className="px-2 py-2.5 font-medium">Route &amp; vessel</th>
            <th className="px-2 py-2.5 font-medium">Departure</th>
            <th className="px-2 py-2.5 font-medium">Amount</th>
            <th className="px-2 py-2.5 font-medium">Booked</th>
            <th className="w-10 px-6 py-2.5 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((d) => {
            const tone = statusTone[d.status];
            const aged = d.ageMinutes >= 60;
            return (
              <tr
                key={d.ref}
                className="group relative cursor-pointer transition-colors duration-150 ease-out hover:bg-slate-50/60 focus-within:bg-slate-50/60"
                tabIndex={0}
                role="link"
                aria-label={`Open booking ${d.ref}`}
              >
                {/* Left brand accent — fades in on hover */}
                <td className="relative px-6 py-3.5 align-middle">
                  <span className="absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-brand-500 transition-transform duration-200 ease-out group-hover:scale-y-100" />
                  <div className="inline-flex items-center gap-1.5">
                    <span className="font-mono text-[12px] font-semibold tracking-tight text-slate-900">{d.ref}</span>
                    {copiedRef === d.ref ? (
                      <span aria-label="Copied" className="grid h-5 w-5 place-items-center rounded text-emerald-600">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                          <path d="M5 12l5 5 9-11" />
                        </svg>
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(d.ref);
                        }}
                        aria-label={`Copy ${d.ref}`}
                        className="grid h-5 w-5 place-items-center rounded text-slate-400 transition-[background-color,color,transform] duration-150 ease-out hover:bg-slate-100 hover:text-slate-700 active:scale-90"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                          <rect x="9" y="9" width="11" height="11" rx="2" />
                          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-2 py-3.5 align-middle">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${tone}`}>
                    {d.status}
                  </span>
                </td>

                {/* Ticketholder */}
                <td className="px-2 py-3.5 align-middle">
                  <div className="font-medium tracking-tight text-slate-900">{d.passenger}</div>
                  <div className="text-[11px] text-slate-500">
                    <span className="tabular-nums">{d.pax}</span> {d.pax === 1 ? "passenger" : "passengers"}
                  </div>
                </td>

                {/* Route + vessel */}
                <td className="px-2 py-3.5 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 text-slate-900">
                      <span className="font-mono text-[13px] font-bold tracking-wide">{d.routeFromCode}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-brand-500">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                      <span className="font-mono text-[13px] font-bold tracking-wide">{d.routeToCode}</span>
                    </div>
                    <span className="h-5 w-px bg-slate-200" />
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-medium text-slate-700">{d.vessel}</div>
                      <div className="truncate text-[11px] text-slate-500">
                        {d.operator} · <span className="font-mono">{d.voyageId}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Departure */}
                <td className="px-2 py-3.5 align-middle">
                  <div className="text-[13px] font-medium tabular-nums text-slate-700">{d.departure}</div>
                </td>

                {/* Amount */}
                <td className="px-2 py-3.5 align-middle">
                  <span className="font-semibold tabular-nums text-slate-900">₱{d.amount.toLocaleString()}</span>
                </td>

                {/* Booked + age */}
                <td className="px-2 py-3.5 align-middle">
                  <div className="text-[12px] text-slate-600 tabular-nums">{d.bookingDate}</div>
                  <div className={`text-[11px] tabular-nums ${aged ? "text-amber-600" : "text-slate-400"}`}>
                    {relativeAge(d.ageMinutes)}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-3.5 align-middle" onClick={(e) => e.stopPropagation()}>
                  <button
                    aria-label={`Actions for ${d.ref}`}
                    className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 transition-[background-color,color] duration-150 ease-out hover:bg-slate-100 hover:text-slate-700"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <circle cx="12" cy="5" r="1.6" />
                      <circle cx="12" cy="12" r="1.6" />
                      <circle cx="12" cy="19" r="1.6" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

/* ---- DepartureBoard --------------------------------------------------- */
/*
  Source DepartureBoard rows show `{operator} · {id}` under the vessel name.
  The store's Departure shape has no `operator` field, so that line drops to
  the voyage id only (`d.id`). Everything else — layout, the per-row framer
  stagger (opacity/y → animate, spring, delay i*0.05) — is preserved verbatim.
*/
const typeTone: Record<Departure["type"], string> = {
  RoRo: "border border-slate-200 text-slate-600",
  "Fast Craft": "border border-slate-200 text-slate-600",
  Ferry: "border border-slate-200 text-slate-600",
};

function DepartureBoard({ data }: { data: Departure[] }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
      {/* Section header */}
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Today's departures</h2>
          <p className="mt-1 text-xs text-slate-500 tabular-nums">
            Apr 8, 2026 · <span className="font-medium text-slate-700">{data.length}</span> sailings scheduled
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-[background-color,transform] duration-150 ease-out hover:bg-slate-50 active:scale-[0.97]">
          View all
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </header>

      <div className="flex flex-col gap-2">
        {data.map((d, i) => {
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 22,
                delay: i * 0.05, // 50ms stagger — within Emil's 30–80ms range
              }}
              className="group relative flex items-center gap-5 overflow-hidden rounded-xl bg-white pl-5 pr-5 py-3 ring-1 ring-slate-200/70 transition-[background-color,transform] duration-150 ease-out hover:bg-slate-50/60 active:scale-[0.997]"
            >
              {/* Left brand accent */}
              <span className="absolute left-0 top-0 h-full w-[3px] bg-brand-500/70" />

              {/* Time block */}
              <div className="w-44 shrink-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[18px] font-semibold leading-none tracking-tight text-slate-900 tabular-nums">{d.depart}</span>
                  {d.durationLabel && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 ring-1 ring-slate-200/70">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                      <span className="tabular-nums">{d.durationLabel}</span>
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3 w-3 text-slate-400">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>
                    arrives <span className="tabular-nums text-slate-700">{d.arrive}</span>
                  </span>
                </div>
              </div>

              {/* Route */}
              <div className="w-36 shrink-0">
                <div className="flex items-center gap-2 text-[15px] font-bold tracking-wide text-slate-900">
                  <span className="tabular-nums">{d.routeFrom}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-brand-500">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="tabular-nums">{d.routeTo}</span>
                </div>
              </div>

              {/* Vessel + voyage id + type pill (source's operator line dropped — no operator field) */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium tracking-tight text-slate-900">{d.vessel}</span>
                  <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${typeTone[d.type]}`}>{d.type}</span>
                </div>
                <div className="mt-1 truncate text-[11px] text-slate-500">
                  <span className="font-mono">{d.id}</span>
                </div>
              </div>

              {/* Tickets sold — single glance metric, no progress math */}
              <div className="w-28 shrink-0 text-right">
                <div className="text-[20px] font-semibold leading-none tabular-nums tracking-tight text-slate-900">
                  {d.ticketsConfirmed.toLocaleString()}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">tickets sold</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ---- Dashboard -------------------------------------------------------- */
export function TripketDashboard() {
  return (
    <div className="tk-chart-scope animate-fade-up">
      <style>{CHART_CSS}</style>

      <PageHeader title="Dashboard" subtitle={ACTIVE_LINE.name} />

      {/* KPI strip — anti-card grouping with divide-x hairlines; flat surface, no shadow */}
      <KpiStrip />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WeeklyRevenueChart data={WEEKLY_REVENUE} />
        <TicketBookingsChart data={BOOKINGS_6M} />
      </div>

      <div className="mt-6">
        <PendingAgingList data={PENDING} />
      </div>

      <div className="mt-6">
        <DepartureBoard data={DEPARTURES} />
      </div>
    </div>
  );
}
