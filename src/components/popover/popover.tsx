import * as React from "react";
import { cn } from "../../lib/cn";
import { usePresence } from "../../lib/use-presence";

/*
  Popover — an anchored floating panel for general (non-menu) content.

    <Popover>
      <PopoverTrigger>
        <Button variant="outline">Filters</Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start">
        <p className="text-sm text-fg/70">Anything goes in here.</p>
      </PopoverContent>
    </Popover>

  Click the trigger to toggle. The panel is positioned absolutely against a
  `relative inline-flex` wrapper via `side` (top/bottom/left/right) + `align`
  (start/center/end), like the dropdown does — it is NOT a portal, so it stays
  interactive and inline. Closes on outside pointerdown and Escape (Escape
  restores focus to the trigger). Controlled (open/onOpenChange) or uncontrolled
  (defaultOpen). Content is role="dialog"; the trigger gets aria-expanded.
*/

type PopoverCtxValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  contentId: string;
};

const PopoverCtx = React.createContext<PopoverCtxValue | null>(null);

function usePopoverCtx(part: string): PopoverCtxValue {
  const ctx = React.useContext(PopoverCtx);
  if (!ctx) throw new Error(`<${part}> must be used within a <Popover>.`);
  return ctx;
}

let popoverSeq = 0;

export interface PopoverProps {
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Popover({ defaultOpen = false, open: openProp, onOpenChange, children }: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const seq = React.useRef<number>();
  if (!seq.current) seq.current = ++popoverSeq;
  const contentId = `asbir-popover-${seq.current}`;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  // Close on outside pointerdown + Escape (Escape restores focus to trigger).
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !contentRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <PopoverCtx.Provider value={{ open, setOpen, triggerRef, contentRef, contentId }}>
      <span className="relative inline-flex">{children}</span>
    </PopoverCtx.Provider>
  );
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the single child as the trigger element (merges props). */
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ asChild, onClick, children, ...props }, forwardedRef) {
    const { open, setOpen, triggerRef, contentId } = usePopoverCtx("PopoverTrigger");
    const ref = useMergedRef(triggerRef, forwardedRef);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) setOpen(!open);
    };

    const shared = {
      ref,
      "aria-haspopup": "dialog" as const,
      "aria-expanded": open,
      "aria-controls": open ? contentId : undefined,
      onClick: handleClick,
      ...props,
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, shared as Record<string, unknown>);
    }

    return (
      <button type="button" {...shared}>
        {children}
      </button>
    );
  }
);

const SIDE: Record<"top" | "bottom" | "left" | "right", string> = {
  top: "bottom-full mb-2",
  bottom: "top-full mt-2",
  left: "right-full mr-2",
  right: "left-full ml-2",
};

// Alignment along the cross axis, split by whether the panel sits on a
// vertical (top/bottom) or horizontal (left/right) side of the trigger.
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

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ side = "bottom", align = "center", className, children, ...props }, forwardedRef) {
    const { open, contentRef, contentId } = usePopoverCtx("PopoverContent");
    const { mounted, status, ref: presenceRef } = usePresence(open);
    const ref = useMergedRef(contentRef, forwardedRef, presenceRef as React.Ref<HTMLDivElement>);

    if (!mounted) return null;

    const horizontal = side === "left" || side === "right";
    const alignClass = horizontal ? ALIGN_H[align] : ALIGN_V[align];

    return (
      <div
        ref={ref}
        id={contentId}
        role="dialog"
        data-state={status === "exiting" ? "closed" : "open"}
        className={cn(
          "absolute z-50 min-w-[12rem] max-w-[calc(100vw-1rem)] rounded-xl border border-border bg-panel p-4 text-fg shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)] outline-none as-animate-scale-in",
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
