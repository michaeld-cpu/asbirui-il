import * as React from "react";
import { cn } from "../../lib/cn";

/*
  StatusBadge — a dot + label live-status indicator.

    <StatusBadge status="running">Running</StatusBadge>
    <StatusBadge status="failed">Failed</StatusBadge>
    <StatusBadge status="paused" />

  Distinct from Badge (a category label): this reads as a system state. The dot
  is colored by `status`; "live" states (online/active/running) get a soft
  pulsing halo. The pill body stays neutral so the color reads as the signal.
*/

export type Status =
  | "online"
  | "active"
  | "running"
  | "idle"
  | "paused"
  | "warning"
  | "offline"
  | "inactive"
  | "error"
  | "failed";

const dotColor: Record<Status, string> = {
  online: "bg-emerald-500",
  active: "bg-emerald-500",
  running: "bg-emerald-500",
  idle: "bg-amber-500",
  paused: "bg-amber-500",
  warning: "bg-amber-500",
  offline: "bg-fg/40",
  inactive: "bg-fg/40",
  error: "bg-red-500",
  failed: "bg-red-500",
};

const LIVE: Status[] = ["online", "active", "running"];

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: Status;
  /** Label; falls back to a title-cased status when omitted. */
  children?: React.ReactNode;
}

export function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  const color = dotColor[status];
  const live = LIVE.includes(status);
  const label = children ?? status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-overlay/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-fg/70",
        className
      )}
      {...props}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {live && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping motion-reduce:hidden",
              color
            )}
          />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", color)} />
      </span>
      {label}
    </span>
  );
}
