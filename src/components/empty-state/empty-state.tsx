import * as React from "react";
import { cn } from "../../lib/cn";

/*
  EmptyState — the "nothing here yet" panel for lists, tables, and searches.

    <EmptyState
      icon={<InboxIcon />}
      title="No deployments yet"
      description="Push to main and your first deploy shows up here"
      action={<Button size="sm">Create deployment</Button>}
    />

  Centered, quiet, and self-contained: dashed border, dimmed icon tile,
  optional action slot. Use it in place of the empty list — not next to it.
*/

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Usually a <Button> — rendered under the description. */
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div
          aria-hidden="true"
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-overlay/[0.04] text-fg/40 [&_svg]:h-5 [&_svg]:w-5"
        >
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-fg/55">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
