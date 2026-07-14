import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

/*
  Drawer (a.k.a. Sheet) — an edge-anchored panel over a dimmed backdrop.

    const [open, setOpen] = React.useState(false);

    <Drawer open={open} onOpenChange={setOpen} side="right">
      <DrawerTitle>Settings</DrawerTitle>
      <DrawerDescription>Tune your workspace.</DrawerDescription>
      …
      <DrawerFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button>Save</Button>
      </DrawerFooter>
    </Drawer>

  Built on the Dialog approach: portals to <body>, locks page scroll (padding
  the body by the scrollbar width so the layout can't jitter), traps Tab focus,
  and restores focus on close. The panel slides in from the chosen `side`
  (left/right/top/bottom); under prefers-reduced-motion it simply appears.
  Closes on Escape / backdrop click (each toggleable). Title/Description wire up
  aria-labelledby / aria-describedby via context.
*/

type DrawerIds = { titleId: string; descId: string; setHas: (k: "title" | "desc") => void };
const DrawerCtx = React.createContext<DrawerIds | null>(null);

let drawerSeq = 0;

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  /** Edge the panel is anchored to (default "right"). */
  side?: "left" | "right" | "top" | "bottom";
  /** Close when the backdrop is clicked (default true). */
  closeOnBackdrop?: boolean;
  /** Close on Escape (default true). */
  closeOnEscape?: boolean;
  /** Extra classes for the panel (e.g. a width/height override). */
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Resting position + slide-in offset per edge. `enter` is the visible resting
// state; `exit` is the translated-off-screen state used before entering and
// while closing.
const SIDE: Record<
  NonNullable<DrawerProps["side"]>,
  { base: string; size: string; enter: string; exit: string }
> = {
  right: {
    base: "inset-y-0 right-0",
    size: "h-full w-full max-w-sm",
    enter: "translate-x-0",
    exit: "translate-x-full",
  },
  left: {
    base: "inset-y-0 left-0",
    size: "h-full w-full max-w-sm",
    enter: "translate-x-0",
    exit: "-translate-x-full",
  },
  top: {
    base: "inset-x-0 top-0",
    size: "max-h-[85vh] w-full",
    enter: "translate-y-0",
    exit: "-translate-y-full",
  },
  bottom: {
    base: "inset-x-0 bottom-0",
    size: "max-h-[85vh] w-full",
    enter: "translate-y-0",
    exit: "translate-y-full",
  },
};

export function Drawer({
  open,
  onOpenChange,
  children,
  side = "right",
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
}: DrawerProps) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const lastActive = React.useRef<Element | null>(null);
  const seq = React.useRef<number>();
  if (!seq.current) seq.current = ++drawerSeq;
  const titleId = `asbir-drawer-${seq.current}-title`;
  const descId = `asbir-drawer-${seq.current}-desc`;
  const [has, setHasState] = React.useState<{ title: boolean; desc: boolean }>({
    title: false,
    desc: false,
  });
  const setHas = React.useCallback(
    (k: "title" | "desc") => setHasState((h) => (h[k] ? h : { ...h, [k]: true })),
    []
  );

  // Drive the slide: start off-screen, then flip to the resting state one frame
  // after mount so the transition actually plays. Reduced motion is handled by
  // the `motion-reduce:transition-none` on the panel (it just appears).
  const [entered, setEntered] = React.useState(false);

  // scroll lock + focus management
  React.useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    // hiding the scrollbar widens the page and shifts everything sideways —
    // pad the body by the scrollbar's width so the layout doesn't jitter
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    // play the slide-in, then focus the first focusable thing (or the panel)
    const raf = requestAnimationFrame(() => {
      setEntered(true);
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      setEntered(false);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      (lastActive.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  // Escape + Tab trap
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        e.stopPropagation();
        onOpenChange(false);
      }
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOnEscape, onOpenChange]);

  if (!open || typeof document === "undefined") return null;

  const s = SIDE[side];

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        onClick={closeOnBackdrop ? () => onOpenChange(false) : undefined}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] as-animate-fade-in"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={has.title ? titleId : undefined}
        aria-describedby={has.desc ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "absolute flex flex-col overflow-y-auto border-border bg-panel shadow-2xl outline-none",
          // both entered/exiting states share the transition so the slide plays
          // both ways; reduced motion drops the transition and it just appears
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
          s.base,
          s.size,
          // an inner edge border so the panel reads as attached to that side
          side === "right" && "border-l",
          side === "left" && "border-r",
          side === "top" && "border-b",
          side === "bottom" && "border-t",
          entered ? s.enter : s.exit,
          className
        )}
      >
        <div className="p-5">
          <DrawerCtx.Provider value={{ titleId, descId, setHas }}>{children}</DrawerCtx.Provider>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function DrawerTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const ctx = React.useContext(DrawerCtx);
  React.useEffect(() => ctx?.setHas("title"), [ctx]);
  return (
    <h2 id={ctx?.titleId} className={cn("text-base font-semibold tracking-tight text-fg", className)} {...props} />
  );
}

export function DrawerDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const ctx = React.useContext(DrawerCtx);
  React.useEffect(() => ctx?.setHas("desc"), [ctx]);
  return <p id={ctx?.descId} className={cn("mt-1.5 text-sm leading-relaxed text-fg/60", className)} {...props} />;
}

export function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5 flex justify-end gap-2", className)} {...props} />;
}
