import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/*
  Progress — a linear determinate or indeterminate bar.

    <Progress value={64} />
    <Progress value={30} size="sm" />
    <Progress indeterminate aria-label="Loading" />

  Track is a bg-overlay pill; the fill is bg-accent with a width transition.
  When `indeterminate`, a partial bar breathes (animate-pulse) since the exact
  progress is unknown — CSS-only, degrades under reduced motion.
*/

const trackVariants = cva("w-full overflow-hidden rounded-full bg-overlay/[0.08]", {
  variants: {
    size: {
      sm: "h-1.5",
      md: "h-2.5",
    },
  },
  defaultVariants: { size: "md" },
});

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "role">,
    VariantProps<typeof trackVariants> {
  /** 0–100. Ignored when `indeterminate`. */
  value?: number;
  /** Unknown-duration mode: a breathing partial bar. */
  indeterminate?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, indeterminate = false, size, className, ...props }, ref) => {
    const clamped = Math.max(0, Math.min(100, value));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
        className={cn(trackVariants({ size }), className)}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full bg-accent",
            indeterminate
              ? "w-2/5 animate-pulse motion-reduce:animate-none"
              : "transition-[width] duration-500 ease-out"
          )}
          style={indeterminate ? undefined : { width: `${clamped}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";
