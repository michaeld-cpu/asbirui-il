import * as React from "react";
import { cn } from "../../lib/cn";

/*
  UsageMeter — a labeled quota bar.

    <UsageMeter label="Renders" value={1284} max={2000} unit="renders" />
    <UsageMeter label="Storage" value={46} max={50} unit="GB" />

  A label row with a "value / max unit" readout, then a track with an accent
  fill. The fill turns amber past ~75% and red past ~90% so a near-limit quota
  reads at a glance. role="progressbar" with the value/max. Width transitions
  (dropped under reduced motion).
*/

export interface UsageMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max: number;
  label?: React.ReactNode;
  unit?: string;
  /** Format the value/max readout. Default toLocaleString. */
  format?: (n: number) => string;
  /** Hide the numeric readout row. */
  hideReadout?: boolean;
}

export function UsageMeter({
  value,
  max,
  label,
  unit,
  format = (n) => n.toLocaleString(),
  hideReadout = false,
  className,
  ...props
}: UsageMeterProps) {
  const safeMax = max > 0 ? max : 1;
  const ratio = Math.max(0, Math.min(1, value / safeMax));
  const pct = ratio * 100;
  const fill = pct >= 90 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : "bg-accent";

  return (
    <div className={cn("w-full", className)} {...props}>
      {!hideReadout && (label != null || unit != null) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
          {label != null && <span className="font-medium text-fg/70">{label}</span>}
          <span className="tabular-nums text-fg/55">
            <span className="text-fg">{format(value)}</span> / {format(max)}
            {unit ? ` ${unit}` : ""}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-2 w-full overflow-hidden rounded-full bg-overlay/[0.08]"
      >
        <div
          className={cn("h-full rounded-full transition-[width,background-color] duration-500 ease-out motion-reduce:transition-none", fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
