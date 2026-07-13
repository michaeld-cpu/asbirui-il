import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "./internal";

/*
  Interaction motion:

    <Magnetic><Button>Hover me</Button></Magnetic>
    <Dock>{apps.map((a) => <DockItem key={a.id}>{a.icon}</DockItem>)}</Dock>
    <CardStack items={[…]} />
    <Ripple className="rounded-asbir"><Button>Click me</Button></Ripple>

  Magnetic and Dock ride framer springs; CardStack and Ripple are
  timer/DOM-driven. All honor prefers-reduced-motion.
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

/* ---- Dock ----------------------------------------------------------------- */

const DockCtx = React.createContext<MotionValue<number> | null>(null);

export interface DockProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Dock — the macOS dock: items magnify as the pointer nears them and relax
 * as it leaves. Compose with <DockItem>.
 */
export function Dock({ className, children, ...rest }: DockProps) {
  const mouseX = useMotionValue(Infinity);
  return (
    <DockCtx.Provider value={mouseX}>
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border border-border bg-panel px-3 py-2.5",
          className
        )}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        {...rest}
      >
        {children}
      </div>
    </DockCtx.Provider>
  );
}

export interface DockItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Resting size in px. Default 40. */
  size?: number;
  /** Peak size under the pointer. Default 64. */
  magnification?: number;
}

/** One dock tile — size springs with the pointer's distance. */
export function DockItem({ size = 40, magnification = 64, className, children, ...rest }: DockItemProps) {
  const reduced = useReducedMotion();
  const mouseX = React.useContext(DockCtx);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const fallback = useMotionValue(Infinity);
  const distance = useTransform(mouseX ?? fallback, (x) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return Infinity;
    return x - (r.left + r.width / 2);
  });
  const width = useSpring(
    useTransform(distance, [-110, 0, 110], [size, magnification, size]),
    { stiffness: 320, damping: 22 }
  );

  return (
    <motion.div
      ref={ref}
      style={reduced ? { width: size, height: size } : { width, height: width }}
      className={cn(
        "flex items-center justify-center rounded-xl border border-border bg-overlay/[0.06] text-fg/70",
        className
      )}
      {...(rest as object)}
    >
      {children}
    </motion.div>
  );
}

/* ---- CardStack ---------------------------------------------------------------- */

export interface CardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  /** ms each card stays on top. Default 2600. */
  interval?: number;
  /** px vertical offset between stacked cards. Default 12. */
  offset?: number;
}

/**
 * CardStack — cards sit stacked with depth; every interval the top card
 * springs to the back and the next rises. Size the wrapper; cards fill it.
 */
export function CardStack({ items, interval = 2600, offset = 12, className, ...rest }: CardStackProps) {
  const reduced = usePrefersReducedMotion();
  const [order, setOrder] = React.useState(() => items.map((_, i) => i));

  React.useEffect(() => {
    setOrder(items.map((_, i) => i));
  }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (reduced || items.length < 2) return;
    const t = window.setInterval(
      () => setOrder((o) => [...o.slice(1), o[0]]),
      interval
    );
    return () => window.clearInterval(t);
  }, [reduced, items.length, interval]);

  return (
    <div className={cn("relative", className)} {...rest}>
      {items.map((item, i) => {
        const pos = order.indexOf(i);
        return (
          <motion.div
            key={i}
            className="absolute inset-x-0 top-0 h-full"
            animate={{
              y: pos * offset,
              scale: 1 - pos * 0.05,
              zIndex: items.length - pos,
              opacity: pos > 2 ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            style={{ transformOrigin: "top center" }}
          >
            {item}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---- Ripple ---------------------------------------------------------------------- */

export type RippleProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * Ripple — a material-style ring expands from the click point. Wrap any
 * clickable; give the wrapper the same border-radius so the ripple clips.
 */
export function Ripple({ className, children, ...rest }: RippleProps) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLSpanElement | null>(null);

  const spawn = (e: React.PointerEvent) => {
    if (reduced) return;
    const host = ref.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "as-ripple";
    const d = Math.max(rect.width, rect.height) * 2;
    Object.assign(ripple.style, {
      width: `${d}px`,
      height: `${d}px`,
      left: `${e.clientX - rect.left}px`,
      top: `${e.clientY - rect.top}px`,
    });
    ripple.addEventListener("animationend", () => ripple.remove());
    host.appendChild(ripple);
  };

  return (
    <span
      ref={ref}
      className={cn("relative inline-flex overflow-hidden", className)}
      onPointerDown={spawn}
      {...rest}
    >
      {children}
    </span>
  );
}
