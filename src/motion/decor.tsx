import * as React from "react";
import { cn } from "../lib/cn";

/*
  Ambient / decorative motion (framer-free; keyframes in motion.css):

    <div className="relative rounded-xl border …">
      <BorderBeam />                 // light orbiting the border
      <Meteors count={8} />          // falling streaks
    </div>
    <Aurora className="absolute inset-0" />
    <GradientBlob className="h-24 w-24" />
    <PulseBeacon />
    <Orbit />
    <Equalizer />
    <HoverFlip front={…} back={…} />

  Everything decorative stops (static final state) under
  prefers-reduced-motion via the media gate in motion.css.
*/

/* ---- BorderBeam --------------------------------------------------------- */

export interface BorderBeamProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Seconds per lap around the border. Default 6. */
  duration?: number;
  /** CSS color of the beam. Default the accent token. */
  color?: string;
}

/** A streak of light that laps the parent's border. Parent needs
    `relative` and a border-radius; the beam inherits it. */
export function BorderBeam({ duration = 6, color, className, style, ...rest }: BorderBeamProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("as-border-beam", className)}
      style={{
        ["--as-beam-duration" as string]: `${duration}s`,
        ...(color ? { ["--as-beam-color" as string]: color } : {}),
        ...style,
      }}
      {...rest}
    />
  );
}

/* ---- Meteors -------------------------------------------------------------- */

export interface MeteorsProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** How many streaks. Default 8. */
  count?: number;
}

/** Falling light streaks across the parent (clipped to its radius). */
export function Meteors({ count = 8, className, ...rest }: MeteorsProps) {
  const meteors = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${Math.round((i / count) * 100 + (Math.random() * 12 - 6))}%`,
        delay: `${(Math.random() * 4).toFixed(2)}s`,
        duration: `${(2.4 + Math.random() * 2.6).toFixed(2)}s`,
      })),
    [count]
  );
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}
      {...rest}
    >
      {meteors.map((m, i) => (
        <span
          key={i}
          className="as-meteor"
          style={{ left: m.left, animationDelay: m.delay, animationDuration: m.duration }}
        />
      ))}
    </span>
  );
}

/* ---- Aurora ---------------------------------------------------------------- */

export type AuroraProps = React.HTMLAttributes<HTMLDivElement>;

/** Two blurred color fields drifting against each other — an ambient
    aurora backdrop. Position it absolutely behind content. */
export function Aurora({ className, ...rest }: AuroraProps) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none overflow-hidden", className)} {...rest}>
      <span className="as-aurora-blob as-aurora-1" />
      <span className="as-aurora-blob as-aurora-2" />
    </div>
  );
}

/* ---- GradientBlob ---------------------------------------------------------- */

export type GradientBlobProps = React.HTMLAttributes<HTMLDivElement>;

/** An organic gradient blob that slowly morphs its silhouette. */
export function GradientBlob({ className, ...rest }: GradientBlobProps) {
  return <div aria-hidden="true" className={cn("as-blob", className)} {...rest} />;
}

/* ---- PulseBeacon ------------------------------------------------------------ */

export interface PulseBeaconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** CSS color. Default the accent token. */
  color?: string;
}

/** A live-status dot radiating expanding rings. */
export function PulseBeacon({ color, className, style, ...rest }: PulseBeaconProps) {
  return (
    <span
      className={cn("relative inline-flex h-3 w-3", className)}
      style={color ? { ["--as-beacon-color" as string]: color, ...style } : style}
      {...rest}
    >
      <span className="as-beacon-ring" />
      <span className="as-beacon-ring" style={{ animationDelay: "1.1s" }} />
      <span className="relative h-3 w-3 rounded-full bg-[var(--as-beacon-color,rgb(var(--accent)))]" />
    </span>
  );
}

/* ---- Orbit ------------------------------------------------------------------- */

export interface OrbitProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds per revolution of the outer ring. Default 8. */
  duration?: number;
}

/** Satellites orbiting a core on two counter-rotating rings. */
export function Orbit({ duration = 8, className, ...rest }: OrbitProps) {
  return (
    <div className={cn("relative h-28 w-28", className)} {...rest}>
      <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg" />
      <span
        className="as-orbit absolute inset-0 rounded-full border border-border"
        style={{ ["--as-orbit-duration" as string]: `${duration}s` }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--accent))]" />
      </span>
      <span
        className="as-orbit absolute inset-4 rounded-full border border-border"
        style={{ ["--as-orbit-duration" as string]: `${duration / 2}s`, animationDirection: "reverse" }}
      >
        <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/60" />
      </span>
    </div>
  );
}

/* ---- Equalizer ---------------------------------------------------------------- */

export interface EqualizerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of bars. Default 5. */
  bars?: number;
}

/** Audio-style bars bouncing out of phase. */
export function Equalizer({ bars = 5, className, ...rest }: EqualizerProps) {
  return (
    <div className={cn("flex h-8 items-end gap-1", className)} {...rest}>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="as-eq-bar w-1.5 rounded-full bg-[rgb(var(--accent))]"
          style={{
            height: "100%",
            animationDelay: `${(i * 0.13).toFixed(2)}s`,
            animationDuration: `${(0.9 + (i % 3) * 0.14).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---- HoverFlip ----------------------------------------------------------------- */

export interface HoverFlipProps extends React.HTMLAttributes<HTMLDivElement> {
  front: React.ReactNode;
  back: React.ReactNode;
}

/** A card that flips in 3D on hover to reveal its back face. Size it via
    className; both faces fill the box. */
export function HoverFlip({ front, back, className, ...rest }: HoverFlipProps) {
  return (
    <div className={cn("as-flip-scene", className)} {...rest}>
      <div className="as-flip-inner">
        <div className="as-flip-face">{front}</div>
        <div className="as-flip-face as-flip-back">{back}</div>
      </div>
    </div>
  );
}
