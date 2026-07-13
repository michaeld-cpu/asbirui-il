import * as React from "react";
import { cn } from "../lib/cn";
import { useInView, usePrefersReducedMotion } from "./internal";

/*
  Chart motion (framer-free; pairs with ChartReveal for line charts):

    <BarsReveal values={[0.4, 0.7, 0.5, 0.9, 0.65]} />
    <RadialProgress value={72} />

  Both play when scrolled into view and resolve to the finished chart under
  prefers-reduced-motion.
*/

/* ---- BarsReveal ---------------------------------------------------------- */

export interface BarsRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bar heights, 0–1. */
  values: number[];
  /** Seconds between adjacent bars. Default 0.07. */
  stagger?: number;
  /** Reveal once (default) or on every viewport entry. */
  once?: boolean;
}

/**
 * BarsReveal — bars grow up out of the baseline one after another when the
 * chart scrolls into view.
 */
export function BarsReveal({ values, stagger = 0.07, once = true, className, ...rest }: BarsRevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>(once);
  return (
    <div
      ref={ref}
      data-inview={inView || undefined}
      className={cn("flex h-24 items-end gap-1.5", className)}
      {...rest}
    >
      {values.map((v, i) => (
        <span
          key={i}
          className="as-bar w-4 rounded-t-[3px] bg-gradient-to-t from-[rgb(var(--accent)/0.35)] to-[rgb(var(--accent))]"
          style={{
            height: `${Math.max(0, Math.min(1, v)) * 100}%`,
            ["--as-bar-delay" as string]: `${(i * stagger).toFixed(3)}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---- RadialProgress --------------------------------------------------------- */

export interface RadialProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Percentage 0–100. */
  value: number;
  /** Diameter in px. Default 96. */
  size?: number;
  /** Ring thickness in px. Default 8. */
  strokeWidth?: number;
  /** Seconds the sweep takes. Default 1.2. */
  duration?: number;
  /** Animate once (default) or on every viewport entry. */
  once?: boolean;
}

/**
 * RadialProgress — a donut sweeps to `value` while the center counts up to
 * it, when scrolled into view.
 */
export function RadialProgress({
  value,
  size = 96,
  strokeWidth = 8,
  duration = 1.2,
  once = true,
  className,
  ...rest
}: RadialProgressProps) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>(once);
  const [display, setDisplay] = React.useState(0);

  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const active = inView || reduced;

  // count the center label alongside the sweep
  React.useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(clamped);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(clamped * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, clamped, duration]);

  return (
    <div
      ref={ref}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${clamped}%`}
      {...rest}
    >
      <svg width={size} height={size} className="-rotate-90">
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
          strokeDashoffset={active ? c * (1 - clamped / 100) : c}
          style={
            reduced
              ? undefined
              : { transition: `stroke-dashoffset ${duration}s cubic-bezier(0.22, 1, 0.36, 1)` }
          }
        />
      </svg>
      <span className="absolute text-lg font-semibold tabular-nums tracking-tight text-fg">
        {display}%
      </span>
    </div>
  );
}
