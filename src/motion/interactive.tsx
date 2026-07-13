import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "../lib/cn";

/*
  Pointer-driven motion (framer springs):

    <Magnetic><Button>Hover me</Button></Magnetic>
    <TiltCard className="rounded-xl border …">…</TiltCard>
    <SpotlightCard className="rounded-xl border …">…</SpotlightCard>

  All three honor prefers-reduced-motion by rendering a static wrapper.
*/

/* ---- Magnetic ---------------------------------------------------------- */

export interface MagneticProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max px the content travels toward the pointer. Default 14. */
  strength?: number;
}

/**
 * Magnetic — pulls its child toward the pointer while hovered and springs
 * back on leave. Wrap a Button or icon; keep `strength` subtle.
 */
export function Magnetic({ strength = 14, className, children, ...rest }: MagneticProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  if (reduced) {
    return (
      <div className={cn("inline-block", className)} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      {...(rest as object)}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set(((e.clientX - r.left) / r.width - 0.5) * 2 * strength);
        y.set(((e.clientY - r.top) / r.height - 0.5) * 2 * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---- TiltCard ----------------------------------------------------------- */

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max tilt in degrees. Default 10. */
  maxTilt?: number;
  /** Show the moving specular glare. Default true. */
  glare?: boolean;
}

/**
 * TiltCard — 3D-tilts toward the pointer with a specular glare that tracks
 * it. The card springs flat again on leave.
 */
export function TiltCard({ maxTilt = 10, glare = true, className, children, ...rest }: TiltCardProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 18 });
  const sry = useSpring(ry, { stiffness: 220, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareBg = useMotionTemplate`radial-gradient(240px circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.14), transparent 60%)`;

  if (reduced) {
    return (
      <div className={cn("relative", className)} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      {...(rest as object)}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * 2 * maxTilt);
        rx.set(-(py - 0.5) * 2 * maxTilt);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        gx.set(50);
        gy.set(50);
      }}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}

/* ---- SpotlightCard ------------------------------------------------------- */

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spotlight radius in px. Default 240. */
  radius?: number;
  /** CSS color of the glow. Default accent at low alpha. */
  color?: string;
}

/**
 * SpotlightCard — a radial glow follows the pointer across the card's
 * surface, fading in on enter and out on leave.
 */
export function SpotlightCard({
  radius = 240,
  color = "rgb(var(--accent) / 0.14)",
  className,
  children,
  ...rest
}: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = React.useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, ${color}, transparent 70%)`;

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      {...rest}
    >
      <motion.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-300",
          hovered ? "opacity-100" : "opacity-0"
        )}
        style={{ background: bg }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
