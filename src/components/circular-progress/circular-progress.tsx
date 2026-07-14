import * as React from "react";
import { cn } from "../../lib/cn";

/*
  CircularProgress — an SVG ring that reflects `value`.

    <CircularProgress value={72} />
    <CircularProgress value={40} size={64} strokeWidth={6} showLabel />

  Two stacked circles — a faint track and an accent arc drawn via
  strokeDasharray/offset, rotated -90° so it fills clockwise from the top.
  The offset eases on change. This is the controlled/static sibling of the
  motion RadialProgress: no in-view trigger, it just mirrors `value`.
*/

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Percentage 0–100. */
  value: number;
  /** Diameter in px. Default 96. */
  size?: number;
  /** Ring thickness in px. Default 8. */
  strokeWidth?: number;
  /** Render the percentage in the center. */
  showLabel?: boolean;
}

export const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ value, size = 96, strokeWidth = 8, showLabel = false, className, ...props }, ref) => {
    const r = (size - strokeWidth) / 2;
    const c = 2 * Math.PI * r;
    const clamped = Math.max(0, Math.min(100, value));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgb(var(--fg-rgb) / 0.1)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - clamped / 100)}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>
        {showLabel && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums text-fg">
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    );
  }
);
CircularProgress.displayName = "CircularProgress";
