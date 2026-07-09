import * as React from "react";
import { PageHeader, Button, Badge, useToast } from "./ai-states";
import { AreaChart, Donut, Icons, CountUp, dayLabels, chartPalette, ModelMarks } from "./ai-ui";
import { usage, useInvoices, invoiceTone } from "./store";

const nf = new Intl.NumberFormat("en-US");
const fmtCost = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* KPI cell in the divided top row — mirrors the Overview dashboard exactly:
   label, big count-up value, optional delta pill. */
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

export function BillingPage() {
  const invoices = useInvoices();
  const toast = useToast();

  const creditsPct = Math.min(100, Math.round((usage.creditsUsed / usage.creditsTotal) * 100));
  const creditsLeft = Math.max(0, usage.creditsTotal - usage.creditsUsed);
  const maxCost = Math.max(...usage.byModel.map((m) => m.cost), 1);
  const totalModelCost = usage.byModel.reduce((s, m) => s + m.cost, 0);
  const seriesSum = usage.spendSeries.reduce((a, b) => a + b, 0) || 1;

  return (
    <div>
      <PageHeader title="Usage & Billing" subtitle="Track spend, credits, and invoices for your Lumina AI workspace." />

      {/* KPI row — divided columns, count-up values, matches Overview */}
      <div className="mb-6 rounded-xl border border-border bg-panel">
        <div className="grid grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0">
          <KpiCell label="Spend (MTD)" value={<CountUp value={usage.spendMonth} format={fmtCost} />} delta={usage.spendDelta} />
          <KpiCell
            label="Requests (7d)"
            value={<CountUp value={usage.requests7d} format={(n) => nf.format(Math.round(n))} />}
            delta={usage.requestsDelta}
          />
          <KpiCell label="Error rate" value={usage.errorRate} delta="0.42% err" up={false} />
          <KpiCell
            label="Credits left"
            value={<CountUp value={creditsLeft} format={(n) => nf.format(Math.round(n))} />}
            delta={`${creditsPct}% used`}
            up={false}
          />
        </div>
      </div>

      {/* Current plan + credits */}
      <div className="mb-6 ai-glow rounded-xl border border-border bg-panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-fg">Scale</h2>
              <Badge className="ai-bg-accent-soft ai-accent">Current plan</Badge>
            </div>
            <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">
              <span className="font-medium text-fg">$299</span>/mo · every model, one platform · priority routing
            </p>
          </div>
          <Button variant="secondary" onClick={() => toast("Opening plan manager…")}>
            Manage plan
          </Button>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-fg/70 dark:text-fg/55">Credits used this cycle</span>
            <span className="font-medium tabular-nums text-fg">
              {usage.creditsUsed.toLocaleString()}{" "}
              <span className="text-fg/65 dark:text-fg/45">/ {usage.creditsTotal.toLocaleString()}</span>
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-overlay/[0.08]">
            <div className="ai-bg-accent h-full rounded-full transition-all" style={{ width: `${creditsPct}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-fg/65 dark:text-fg/45">{creditsPct}% of monthly credits consumed · resets in 12 days</p>
        </div>
      </div>

      {/* Spend trend + composition — trend area chart paired with a donut breakdown */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-fg">Spend</h3>
              <p className="mt-0.5 text-xs text-fg/60 dark:text-fg/45">Last 30 days</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold tabular-nums tracking-tight text-fg">{fmtCost(usage.spendMonth)}</div>
              <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{usage.spendDelta} MTD</div>
            </div>
          </div>
          <AreaChart
            data={usage.spendSeries}
            labels={dayLabels(usage.spendSeries.length)}
            format={(v) => fmtCost((v / seriesSum) * usage.spendMonth)}
            className="h-48 w-full"
          />
        </div>

        <div className="rounded-xl border border-border bg-panel p-5">
          <h3 className="text-sm font-semibold text-fg">Spend by model</h3>
          <p className="mt-0.5 text-xs text-fg/60 dark:text-fg/45">This billing cycle</p>
          <div className="mt-4 flex justify-center">
            <Donut
              className="h-36 w-36"
              centerLabel={fmtCost(totalModelCost)}
              slices={usage.byModel.map((m) => ({ label: m.model, value: m.cost }))}
            />
          </div>
          <ul className="mt-4 space-y-2.5">
            {usage.byModel.map((m) => (
              <li key={m.model} className="flex items-center gap-2 text-xs">
                {ModelMarks[m.provider]}
                <span className="truncate text-fg/70 dark:text-fg/55">{m.model}</span>
                <span className="ml-auto font-medium tabular-nums text-fg">{Math.round((m.cost / totalModelCost) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Usage by model */}
      <div className="mb-6 rounded-xl border border-border bg-panel">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-fg">Usage by model</h3>
          <span className="text-xs text-fg/70 dark:text-fg/55">{fmtCost(totalModelCost)} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs capitalize text-fg">
                <th className="px-5 py-2.5 font-medium">Model</th>
                <th className="px-5 py-2.5 text-right font-medium">Requests</th>
                <th className="px-5 py-2.5 text-right font-medium">Tokens</th>
                <th className="px-5 py-2.5 text-right font-medium">Cost</th>
                <th className="px-5 py-2.5 font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {usage.byModel.map((m, i) => {
                const color = chartPalette[i % chartPalette.length];
                return (
                  <tr key={m.model} className="border-b border-border/60 last:border-0 hover:bg-overlay/[0.03]">
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className="flex items-center gap-2.5 font-medium text-fg">
                        {ModelMarks[m.provider]}
                        {m.model}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs tabular-nums text-fg/70">
                      {m.requests.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs tabular-nums text-fg/70">{m.tokens}</td>
                    <td className="px-5 py-3 text-right font-mono text-xs tabular-nums text-fg">${m.cost.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="h-2 w-32 max-w-full overflow-hidden rounded-full bg-overlay/[0.08]">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${Math.round((m.cost / maxCost) * 100)}%`, background: color }}
                          />
                        </div>
                        <span className="w-9 text-right text-xs font-medium tabular-nums text-fg/70">
                          {Math.round((m.cost / totalModelCost) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment method */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-panel p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-12 items-center justify-center rounded-md border border-border bg-canvas text-[10px] font-bold tracking-wider text-fg/70">
            VISA
          </span>
          <div>
            <p className="text-sm font-medium text-fg">•••• •••• •••• 4242</p>
            <p className="text-xs text-fg/65 dark:text-fg/45">Expires 08 / 2028 · default method</p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => toast("Update payment method")}>
          Update
        </Button>
      </div>

      {/* Invoices */}
      <div className="rounded-xl border border-border bg-panel">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-fg">Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[520px] w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs capitalize text-fg">
                <th className="px-5 py-2.5 font-medium">Date</th>
                <th className="px-5 py-2.5 text-right font-medium">Amount</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 text-right font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border/60 last:border-0 hover:bg-overlay/[0.03]">
                  <td className="whitespace-nowrap px-5 py-3 text-fg/80">{inv.date}</td>
                  <td className="px-5 py-3 text-right font-mono text-xs tabular-nums text-fg">
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={invoiceTone[inv.status]}>{inv.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto"
                      onClick={() => toast(`Downloading ${inv.id}…`)}
                    >
                      {Icons.copy}Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
