import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { usePresence } from "../../lib/use-presence";

/*
  DropdownMenu — accessible, token-driven dropdown built without Radix.

  Compound API (shadcn-shaped):

    <DropdownMenu>
      <DropdownMenuTrigger>…</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Period</DropdownMenuLabel>
        <DropdownMenuItem onSelect={…}>Last 7 days</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  Behaviour: click to toggle; Escape / outside-click / blur closes; ↑/↓ move
  between items, Home/End jump to ends, Enter/Space activate, typing focuses
  the trigger again on close. Content is positioned relative to the trigger and
  gets `role="menu"`; items get `role="menuitem"`. Menu chrome uses the library
  semantic tokens (panel/border/overlay/accent) so it themes with the system.
*/

/* ---- context ---------------------------------------------------------- */

type DropdownContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  menuId: string;
  triggerId: string;
};

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownContext(component: string): DropdownContextValue {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used within a <DropdownMenu>.`);
  }
  return ctx;
}

let idCounter = 0;
function useId(prefix: string): string {
  // React 18 has useId, but this keeps SSR-stable ids without a hard dep on it.
  const react18Id = (React as { useId?: () => string }).useId?.();
  const [fallback] = React.useState(() => `${prefix}-${++idCounter}`);
  return react18Id ? `${prefix}-${react18Id}` : fallback;
}

/* ---- root ------------------------------------------------------------- */

export interface DropdownMenuProps {
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state should change. */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function DropdownMenu({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const menuId = useId("asbir-menu");
  const triggerId = useId("asbir-menu-trigger");

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  // Close on outside pointer + Escape (Escape also restores focus to trigger).
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !contentRef.current?.contains(target)
      ) {
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

  const ctx: DropdownContextValue = {
    open,
    setOpen,
    triggerRef,
    contentRef,
    menuId,
    triggerId,
  };

  return (
    <DropdownContext.Provider value={ctx}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  );
}

/* ---- trigger ---------------------------------------------------------- */

export interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the trigger's single child as the trigger element (merges props). */
  asChild?: boolean;
}

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(function DropdownMenuTrigger(
  { asChild, onClick, onKeyDown, children, ...props },
  forwardedRef
) {
  const { open, setOpen, triggerRef, menuId, triggerId } =
    useDropdownContext("DropdownMenuTrigger");

  const ref = useMergedRef(triggerRef, forwardedRef);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) setOpen(!open);
  };

  // Open with ↓/↑/Enter/Space and let the content grab focus (see Content).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (
      e.key === "ArrowDown" ||
      e.key === "ArrowUp" ||
      e.key === "Enter" ||
      e.key === " "
    ) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const shared = {
    ref,
    id: triggerId,
    "aria-haspopup": "menu" as const,
    "aria-expanded": open,
    "aria-controls": open ? menuId : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
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
});

/* ---- content ---------------------------------------------------------- */

const contentVariants = cva(
  "absolute z-50 min-w-[10rem] max-w-[calc(100vw-1rem)] overflow-hidden rounded-asbir border border-border bg-panel p-1 text-fg shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)] focus:outline-none motion-safe:data-[state=open]:animate-menu-in motion-safe:data-[state=closed]:animate-menu-out",
  {
    variants: {
      align: {
        start: "left-0",
        end: "right-0",
      },
      side: {
        bottom: "top-full mt-2 origin-top",
        top: "bottom-full mb-2 origin-bottom",
      },
    },
    defaultVariants: {
      align: "start",
      side: "bottom",
    },
  }
);

export interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof contentVariants> {}

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  { className, align, side, children, ...props },
  forwardedRef
) {
  const { open, contentRef, menuId, triggerId } =
    useDropdownContext("DropdownMenuContent");
  const { mounted, status, ref: presenceRef } = usePresence(open);
  const ref = useMergedRef(contentRef, forwardedRef, presenceRef);

  // Focus the first item when the menu opens (keyboard entry point).
  React.useEffect(() => {
    if (!open) return;
    const first = getItems(contentRef.current)[0];
    first?.focus();
  }, [open, contentRef]);

  // Collision avoidance: after opening, if the menu overflows its scroll
  // container horizontally (e.g. a wide min-width near an edge, common on
  // mobile or inside a constrained preview panel), nudge it back in with a
  // translate so it never spills past that boundary. Recomputed on open and
  // on resize/scroll. Keeps a small margin from the boundary.
  const [shiftX, setShiftX] = React.useState(0);
  React.useEffect(() => {
    if (!open) return;
    const MARGIN = 8;
    const adjust = () => {
      const el = contentRef.current;
      if (!el) return;
      // Measure without a prior shift so the correction is absolute, not
      // cumulative (the shift is applied via the `translate` property).
      const prev = el.style.translate;
      el.style.translate = "";
      const r = el.getBoundingClientRect();
      // Clamp against the nearest ancestor that actually clips content
      // (overflow hidden/auto/scroll), falling back to the viewport — a
      // dropdown inside a bounded card should respect the card's edge, not
      // just the browser window.
      const boundary = nearestClipAncestor(el);
      const boundaryRect = boundary
        ? boundary.getBoundingClientRect()
        : { left: 0, right: window.innerWidth };
      let dx = 0;
      if (r.right > boundaryRect.right - MARGIN) {
        dx = boundaryRect.right - MARGIN - r.right;
      }
      if (r.left + dx < boundaryRect.left + MARGIN) {
        dx = boundaryRect.left + MARGIN - r.left;
      }
      el.style.translate = prev;
      setShiftX(dx);
    };
    adjust();
    window.addEventListener("resize", adjust);
    window.addEventListener("scroll", adjust, true);
    return () => {
      window.removeEventListener("resize", adjust);
      window.removeEventListener("scroll", adjust, true);
    };
    // `mounted` matters, not just `open`: usePresence flips `mounted` true a
    // render *after* `open` does, which is the render that actually attaches
    // contentRef. Depending on `open` alone re-runs this effect one render
    // too early, when contentRef.current is still null, and never again —
    // so the shift silently never applies.
  }, [open, mounted, contentRef, align, side]);

  // Roving focus: ↑/↓/Home/End move between enabled items.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = getItems(contentRef.current);
    if (items.length === 0) return;
    const current = document.activeElement as HTMLElement | null;
    const index = current ? items.indexOf(current) : -1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        e.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
      default:
        break;
    }
  };

  if (!mounted) return null;

  return (
    <div
      ref={ref}
      id={menuId}
      role="menu"
      data-state={status === "exiting" ? "closed" : "open"}
      aria-labelledby={triggerId}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={cn(contentVariants({ align, side }), className)}
      {...props}
      // `translate` is its own CSS property, so the collision shift doesn't
      // clash with the enter/exit keyframes that animate `transform`. Spread
      // props.style FIRST — it must not clobber the shift that keeps the menu
      // inside its boundary.
      style={{ ...props.style, translate: shiftX ? `${shiftX}px 0` : undefined }}
    >
      {children}
    </div>
  );
});

/** Walk up from `el` to the nearest ancestor that bounds collision avoidance:
    either an explicit `data-dropdown-boundary` marker (for a visually bounded
    panel that doesn't clip overflow, e.g. a component preview stage) or an
    ancestor that clips overflow (a scroll container / `overflow: hidden`
    panel). Falls back to the viewport when neither is found. */
function nearestClipAncestor(el: HTMLElement): HTMLElement | null {
  let node = el.parentElement;
  while (node && node !== document.body) {
    if (node.hasAttribute("data-dropdown-boundary")) return node;
    const style = getComputedStyle(node);
    if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) return node;
    node = node.parentElement;
  }
  return null;
}

/** All enabled, focusable menu items inside the content element. */
function getItems(content: HTMLDivElement | null): HTMLElement[] {
  if (!content) return [];
  return Array.from(
    content.querySelectorAll<HTMLElement>('[role="menuitem"]:not([data-disabled])')
  );
}

/* ---- item ------------------------------------------------------------- */

const itemVariants = cva(
  "flex w-full cursor-pointer select-none items-center gap-2 rounded-[calc(var(--as-radius)-0.2rem)] px-2.5 py-1.5 text-left text-[13px] outline-none transition-colors focus:bg-overlay/[0.06] data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
  {
    variants: {
      destructive: {
        true: "text-destructive focus:bg-destructive/10",
        false: "text-fg/80 hover:text-fg focus:text-fg",
      },
    },
    defaultVariants: {
      destructive: false,
    },
  }
);

export interface DropdownMenuItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Fired on click / Enter / Space. Closes the menu unless preventDefault(). */
  onSelect?: (event: React.SyntheticEvent) => void;
  destructive?: boolean;
  disabled?: boolean;
}

export const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(function DropdownMenuItem(
  { className, destructive, disabled, onSelect, onClick, children, ...props },
  forwardedRef
) {
  const { setOpen, triggerRef } = useDropdownContext("DropdownMenuItem");

  const activate = (e: React.SyntheticEvent) => {
    if (disabled) return;
    onSelect?.(e);
    if (!e.defaultPrevented) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <button
      ref={forwardedRef}
      type="button"
      role="menuitem"
      tabIndex={-1}
      data-disabled={disabled ? "" : undefined}
      aria-disabled={disabled || undefined}
      onClick={(e) => {
        onClick?.(e);
        activate(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate(e);
        }
      }}
      className={cn(itemVariants({ destructive: !!destructive }), className)}
      {...props}
    >
      {children}
    </button>
  );
});

/* ---- label + separator ------------------------------------------------ */

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "px-2.5 py-1.5 text-xs font-semibold text-muted",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

/* ---- utils ------------------------------------------------------------ */

/** Merge any number of ref objects / callbacks into one STABLE ref callback.
    The callback identity never changes across renders, so React won't detach
    and re-attach the node — the latest refs are read from a mutable box. */
function useMergedRef<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
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
