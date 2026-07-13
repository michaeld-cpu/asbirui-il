import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/*
  Badge — a small status/category label.

    <Badge>Default</Badge>
    <Badge variant="success" dot>Operational</Badge>
    <Badge variant="accent">Beta</Badge>

  Tinted variants use low-alpha fills so they read on both themes without
  per-theme overrides. `dot` prepends a status dot in the variant color.
*/

const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-5",
  {
    variants: {
      variant: {
        neutral: "border-border bg-overlay/[0.04] text-fg/70",
        accent: "border-accent/30 bg-accent/15 text-accent",
        success:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        warning:
          "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",
        danger: "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-400",
        outline: "border-border bg-transparent text-fg/70",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

const dotColor: Record<string, string> = {
  neutral: "bg-fg/40",
  accent: "bg-accent",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  outline: "bg-fg/40",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Prepends a small status dot in the variant color. */
  dot?: boolean;
}

export function Badge({ className, variant, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 rounded-full", dotColor[variant ?? "neutral"])}
        />
      )}
      {children}
    </span>
  );
}

export { badgeVariants };
