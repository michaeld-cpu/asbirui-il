import { AreaChart } from "./admin-ui";
import { stats, activitySeries, recentActivity } from "./admin-data";

export function DashboardPage() {
  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-fg/55">
          An overview of what's happening across your workspace.
        </p>
      </div>

      {/* stat widgets */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-panel p-4">
            <p className="text-sm text-fg/55">{s.label}</p>
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

      {/* chart + activity */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Activity</h2>
            <span className="text-xs text-fg/50">Last 12 weeks</span>
          </div>
          <AreaChart data={activitySeries} className="h-48 w-full" />
        </div>

        <div className="rounded-xl border border-border bg-panel p-5">
          <h2 className="mb-4 text-base font-semibold">Recent activity</h2>
          <ul className="space-y-4">
            {recentActivity.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-fg/15" />
                <div className="min-w-0 text-sm">
                  <p className="text-fg/80">
                    <span className="font-medium text-fg">{a.who}</span> {a.what}{" "}
                    <span className="font-medium text-fg">{a.target}</span>
                  </p>
                  <p className="text-xs text-fg/40">{a.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
