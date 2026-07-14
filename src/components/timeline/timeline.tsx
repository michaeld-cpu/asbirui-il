import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Timeline — a vertical list of events on a connector line.

    <Timeline>
      <TimelineItem status="success" title="Deployed" time="2m ago">
        Build #482 shipped to production.
      </TimelineItem>
      <TimelineItem status="accent" title="Review requested" time="1h ago" />
      <TimelineItem title="Opened PR" time="Yesterday" />
    </Timeline>

  Each item shows a status dot (or a custom icon) on a line that runs behind the
  dots; the last item's line stops so the track doesn't dangle. Title + optional
  time + optional description/children.
*/

export function Timeline({ className, children, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return (
    <ol className={cn("flex flex-col", className)} {...props}>
      {children}
    </ol>
  );
}

type TimelineStatus = "default" | "accent" | "success" | "warning" | "danger";

const dotColor: Record<TimelineStatus, string> = {
  default: "bg-fg/40",
  accent: "bg-accent",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
};

export interface TimelineItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> {
  status?: TimelineStatus;
  title: React.ReactNode;
  time?: React.ReactNode;
  /** Optional icon that replaces the status dot. */
  icon?: React.ReactNode;
}

export function TimelineItem({
  status = "default",
  title,
  time,
  icon,
  className,
  children,
  ...props
}: TimelineItemProps) {
  return (
    <li className={cn("flex gap-3", className)} {...props}>
      {/* marker rail: dot + the connector that runs to the next item */}
      <div className="flex flex-col items-center">
        {icon ? (
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-panel text-fg/70 ring-1 ring-border [&>svg]:h-3.5 [&>svg]:w-3.5"
          >
            {icon}
          </span>
        ) : (
          <span
            aria-hidden="true"
            className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-panel", dotColor[status])}
          />
        )}
        {/* the last item has no next sibling, so flex-1 makes this line only as
            tall as the content above it while intermediate items stretch full */}
        <span aria-hidden="true" className="w-px flex-1 bg-border last:hidden" />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-fg">{title}</span>
          {time != null && <span className="shrink-0 text-xs text-fg/45">{time}</span>}
        </div>
        {children != null && <div className="mt-1 text-sm leading-relaxed text-fg/70">{children}</div>}
      </div>
    </li>
  );
}
