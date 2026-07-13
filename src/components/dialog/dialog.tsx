import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

/*
  Dialog — a modal over a dimmed backdrop.

    const [open, setOpen] = React.useState(false);

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle>Delete workspace</DialogTitle>
      <DialogDescription>This can't be undone.</DialogDescription>
      …
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="destructive">Delete</Button>
      </DialogFooter>
    </Dialog>

  Portals to <body>, locks page scroll, closes on Escape / backdrop click
  (each toggleable), traps Tab focus inside the panel, and restores focus to
  the previously focused element on close. Title/Description wire up
  aria-labelledby / aria-describedby automatically via context.
*/

type DialogIds = { titleId: string; descId: string; setHas: (k: "title" | "desc") => void };
const DialogCtx = React.createContext<DialogIds | null>(null);

let dialogSeq = 0;

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  /** Close when the backdrop is clicked (default true). */
  closeOnBackdrop?: boolean;
  /** Close on Escape (default true). */
  closeOnEscape?: boolean;
  /** Max-width utility for the panel (default "max-w-md"). */
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Dialog({
  open,
  onOpenChange,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
}: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const lastActive = React.useRef<Element | null>(null);
  const seq = React.useRef<number>();
  if (!seq.current) seq.current = ++dialogSeq;
  const titleId = `asbir-dialog-${seq.current}-title`;
  const descId = `asbir-dialog-${seq.current}-desc`;
  const [has, setHasState] = React.useState<{ title: boolean; desc: boolean }>({
    title: false,
    desc: false,
  });
  const setHas = React.useCallback(
    (k: "title" | "desc") => setHasState((h) => (h[k] ? h : { ...h, [k]: true })),
    []
  );

  // scroll lock + focus management
  React.useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus the first focusable thing in the panel (or the panel itself)
    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
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

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          "relative w-full max-w-md rounded-xl border border-border bg-panel p-5 shadow-2xl outline-none as-animate-scale-in",
          className
        )}
      >
        <DialogCtx.Provider value={{ titleId, descId, setHas }}>{children}</DialogCtx.Provider>
      </div>
    </div>,
    document.body
  );
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const ctx = React.useContext(DialogCtx);
  React.useEffect(() => ctx?.setHas("title"), [ctx]);
  return (
    <h2
      id={ctx?.titleId}
      className={cn("text-base font-semibold tracking-tight text-fg", className)}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const ctx = React.useContext(DialogCtx);
  React.useEffect(() => ctx?.setHas("desc"), [ctx]);
  return (
    <p
      id={ctx?.descId}
      className={cn("mt-1.5 text-sm leading-relaxed text-fg/60", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5 flex justify-end gap-2", className)} {...props} />;
}
