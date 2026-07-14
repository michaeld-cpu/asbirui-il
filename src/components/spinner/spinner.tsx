import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/*
  Spinner — a standalone loading indicator.

    <Spinner />
    <Spinner size="sm" className="text-fg/50" />
    <Spinner size="lg" label="Loading dashboard" />

  The same spinning arc the Button uses, extracted. Inherits currentColor, so
  set the color via className. role="status" with an sr-only label for screen
  readers; the spin stops under prefers-reduced-motion.
*/

const spinnerVariants = cva("animate-spin motion-reduce:animate-none", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    },
  },
  defaultVariants: { size: "md" },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  /** Screen-reader label (default "Loading"). */
  label?: string;
}

export function Spinner({ size, label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex", className)} {...props}>
      <svg
        className={spinnerVariants({ size })}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M12 3a9 9 0 1 1-9 9" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
