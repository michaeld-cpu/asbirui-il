import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Tooltip — a hover/focus label for icon buttons and truncated text.

    <Tooltip content="Copy to clipboard">
      <button>…</button>
    </Tooltip>

  Hand-rolled (no portal): the bubble positions absolutely around the trigger
  wrapper, appears after `delay` ms on hover or immediately on keyboard focus,
  and hides on Escape. The child gets aria-describedby while open.
*/

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  /** Hover delay in ms (focus shows immediately). */
  delay?: number;
  className?: string;
}

let tooltipSeq = 0;

export function Tooltip({ content, children, side = "top", delay = 300, className }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | null>(null);
  const idRef = React.useRef<string>();
  if (!idRef.current) idRef.current = `asbir-tooltip-${++tooltipSeq}`;

  const show = (immediate = false) => {
    if (timer.current) window.clearTimeout(timer.current);
    if (immediate) setOpen(true);
    else timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const pos: Record<NonNullable<TooltipProps["side"]>, string> = {
    top: "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
    left: "right-full top-1/2 mr-1.5 -translate-y-1/2",
    right: "left-full top-1/2 ml-1.5 -translate-y-1/2",
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show()}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      aria-describedby={open ? idRef.current : undefined}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          id={idRef.current}
          className={cn(
            "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-solid px-2.5 py-1 text-[11px] font-medium text-fg-invert shadow-lg",
            "as-animate-fade-in",
            pos[side],
            className
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
