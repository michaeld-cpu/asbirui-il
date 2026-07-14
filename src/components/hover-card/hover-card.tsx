import * as React from "react";
import { cn } from "../../lib/cn";
import { usePresence } from "../../lib/use-presence";

/*
  HoverCard — a hover/focus-triggered preview card.

    <HoverCard>
      <HoverCardTrigger>
        <a href="/u/mikey">@mikey</a>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="start">
        <div className="flex gap-3">
          <Avatar … />
          <div>…profile preview…</div>
        </div>
      </HoverCardContent>
    </HoverCard>

  Like Tooltip but larger and interactive: it opens on hover/focus after a
  longer delay (~300ms) and stays open through a short close delay (~150ms) so
  the pointer can travel into the card without dismissing it. Positioned inline
  against a `relative inline-flex` wrapper via `side` + `align` (not a portal).
  Escape closes it. Content is role="dialog"; the trigger gets aria-expanded.
*/

type HoverCardCtxValue = {
  open: boolean;
  show: () => void;
  hide: () => void;
  cancelHide: () => void;
  contentId: string;
};

const HoverCardCtx = React.createContext<HoverCardCtxValue | null>(null);

function useHoverCardCtx(part: string): HoverCardCtxValue {
  const ctx = React.useContext(HoverCardCtx);
  if (!ctx) throw new Error(`<${part}> must be used within a <HoverCard>.`);
  return ctx;
}

let hoverCardSeq = 0;

export interface HoverCardProps {
  children: React.ReactNode;
  /** Delay before opening on hover, in ms (default 300). */
  openDelay?: number;
  /** Delay before closing after the pointer leaves, in ms (default 150). */
  closeDelay?: number;
}

export function HoverCard({ children, openDelay = 300, closeDelay = 150 }: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const openTimer = React.useRef<number | null>(null);
  const closeTimer = React.useRef<number | null>(null);
  const seq = React.useRef<number>();
  if (!seq.current) seq.current = ++hoverCardSeq;
  const contentId = `asbir-hovercard-${seq.current}`;

  const clearTimers = React.useCallback(() => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const show = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
    if (openTimer.current) return;
    openTimer.current = window.setTimeout(() => {
      openTimer.current = null;
      setOpen(true);
    }, openDelay);
  }, [openDelay]);

  const hide = React.useCallback(() => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    openTimer.current = null;
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setOpen(false);
    }, closeDelay);
  }, [closeDelay]);

  // Keep the card open while the pointer is inside it (cancel a pending close).
  const cancelHide = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  React.useEffect(() => () => clearTimers(), [clearTimers]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearTimers();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, clearTimers]);

  return (
    <HoverCardCtx.Provider value={{ open, show, hide, cancelHide, contentId }}>
      <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
        {children}
      </span>
    </HoverCardCtx.Provider>
  );
}

export interface HoverCardTriggerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Render the single child as the trigger element (merges props). */
  asChild?: boolean;
}

export function HoverCardTrigger({ asChild, children, ...props }: HoverCardTriggerProps) {
  const { open, contentId } = useHoverCardCtx("HoverCardTrigger");
  const shared = {
    "aria-haspopup": "dialog" as const,
    "aria-expanded": open,
    "aria-controls": open ? contentId : undefined,
    ...props,
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, shared as Record<string, unknown>);
  }

  return (
    <span className="inline-flex" {...shared}>
      {children}
    </span>
  );
}

const SIDE: Record<"top" | "bottom" | "left" | "right", string> = {
  top: "bottom-full mb-2",
  bottom: "top-full mt-2",
  left: "right-full mr-2",
  right: "left-full ml-2",
};

const ALIGN_V: Record<"start" | "center" | "end", string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};
const ALIGN_H: Record<"start" | "center" | "end", string> = {
  start: "top-0",
  center: "top-1/2 -translate-y-1/2",
  end: "bottom-0",
};

export interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  function HoverCardContent({ side = "bottom", align = "center", className, children, ...props }, forwardedRef) {
    const { open, cancelHide, hide, contentId } = useHoverCardCtx("HoverCardContent");
    const { mounted, status, ref: presenceRef } = usePresence(open);
    const ref = useMergedRef(forwardedRef, presenceRef as React.Ref<HTMLDivElement>);

    if (!mounted) return null;

    const horizontal = side === "left" || side === "right";
    const alignClass = horizontal ? ALIGN_H[align] : ALIGN_V[align];

    return (
      <div
        ref={ref}
        id={contentId}
        role="dialog"
        data-state={status === "exiting" ? "closed" : "open"}
        onMouseEnter={cancelHide}
        onMouseLeave={hide}
        className={cn(
          "absolute z-50 w-64 max-w-[calc(100vw-1rem)] rounded-xl border border-border bg-panel p-4 text-fg shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)] outline-none as-animate-fade-in",
          SIDE[side],
          alignClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/** Merge any number of ref objects / callbacks into one STABLE ref callback. */
function useMergedRef<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  const box = React.useRef(refs);
  box.current = refs;
  return React.useCallback((node: T) => {
    for (const r of box.current) {
      if (!r) continue;
      if (typeof r === "function") r(node);
      else (r as React.MutableRefObject<T | null>).current = node;
    }
  }, []);
}
