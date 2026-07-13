import * as React from "react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "./internal";

/*
  Canvas motion (framer-free):

    <div className="relative …">
      <Particles className="absolute inset-0" />
    </div>

    <Confetti>
      <Button>Ship it</Button>
    </Confetti>

  Particles drift continuously; Confetti bursts from the click point.
  Both no-op under prefers-reduced-motion.
*/

/* ---- Particles ------------------------------------------------------------ */

export interface ParticlesProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dot count. Default 48. */
  count?: number;
  /** Base drift speed in px/frame. Default 0.25. */
  speed?: number;
}

/** A field of softly drifting dots that fills its (positioned) parent. */
export function Particles({ count = 48, speed = 0.25, className, ...rest }: ParticlesProps) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    type Dot = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let dots: Dot[] = [];

    const seed = () => {
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2 * speed,
        vy: (Math.random() - 0.5) * 2 * speed,
        r: 0.8 + Math.random() * 1.6,
        a: 0.25 + Math.random() * 0.5,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const color = getComputedStyle(canvas).color;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const d of dots) {
        d.x = (d.x + d.vx + w) % w;
        d.y = (d.y + d.vy + h) % h;
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw(); // reduced-motion still gets one static frame
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [count, speed, reduced]);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none text-fg", className)} {...rest}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

/* ---- Confetti ---------------------------------------------------------------- */

export interface ConfettiProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Pieces per burst. Default 26. */
  count?: number;
  /** Confetti colors. Defaults to accent + a small festive set. */
  colors?: string[];
}

const DEFAULT_COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

/** Wrap anything clickable — a paper burst erupts from the click point. */
export function Confetti({ count = 26, colors = DEFAULT_COLORS, className, children, ...rest }: ConfettiProps) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const raf = React.useRef(0);

  React.useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const burst = (e: React.MouseEvent) => {
    if (reduced) return;
    const host = ref.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const pad = 140;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = (rect.width + pad * 2) * dpr;
    canvas.height = (rect.height + pad * 2) * dpr;
    Object.assign(canvas.style, {
      position: "absolute",
      left: `${-pad}px`,
      top: `${-pad}px`,
      width: `${rect.width + pad * 2}px`,
      height: `${rect.height + pad * 2}px`,
      pointerEvents: "none",
    });
    host.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ox = e.clientX - rect.left + pad;
    const oy = e.clientY - rect.top + pad;
    const pieces = Array.from({ length: count }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
      const power = 4 + Math.random() * 5;
      return {
        x: ox,
        y: oy,
        vx: Math.cos(angle) * power,
        vy: Math.sin(angle) * power,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        w: 4 + Math.random() * 4,
        h: 3 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    const t0 = performance.now();
    const tick = (t: number) => {
      const life = (t - t0) / 900; // ~0.9s burst
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (life >= 1) {
        canvas.remove();
        return;
      }
      for (const p of pieces) {
        p.vy += 0.18; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = 1 - life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <span
      ref={ref}
      className={cn("relative inline-block", className)}
      onClickCapture={burst}
      {...rest}
    >
      {children}
    </span>
  );
}
