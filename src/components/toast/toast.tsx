import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

/*
  Toast — transient notifications, stacked bottom-right.

    // once, at the app root:
    <ToastProvider>…</ToastProvider>

    // anywhere below it:
    const toast = useToast();
    toast({ title: "Saved", description: "Your changes are live." });
    toast({ title: "Deploy failed", variant: "danger", duration: 8000 });

  Each toast auto-dismisses after `duration` ms (default 5000; hover pauses
  the timer) and can be dismissed with its ✕. The viewport is a polite
  aria-live region so screen readers announce new toasts without stealing
  focus.
*/

export interface ToastOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: "neutral" | "success" | "danger";
  /** ms before auto-dismiss; 0 disables auto-dismiss. */
  duration?: number;
}

type ToastItem = Required<Pick<ToastOptions, "title">> &
  ToastOptions & { id: number };

const ToastCtx = React.createContext<((opts: ToastOptions) => void) | null>(null);

export function useToast(): (opts: ToastOptions) => void {
  const push = React.useContext(ToastCtx);
  if (!push) throw new Error("useToast() must be used inside <ToastProvider>");
  return push;
}

let toastSeq = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = React.useCallback((opts: ToastOptions) => {
    const id = ++toastSeq;
    setItems((list) => [...list, { duration: 5000, variant: "neutral", ...opts, id }]);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            aria-live="polite"
            aria-label="Notifications"
            className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
          >
            {items.map((t) => (
              <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
            ))}
          </div>,
          document.body
        )}
    </ToastCtx.Provider>
  );
}

const variantBar: Record<NonNullable<ToastOptions["variant"]>, string> = {
  neutral: "bg-accent",
  success: "bg-emerald-500",
  danger: "bg-red-500",
};

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  // auto-dismiss with hover-pause: track remaining time across pauses
  const remaining = React.useRef(item.duration ?? 5000);
  const startedAt = React.useRef<number>(0);
  const timer = React.useRef<number | null>(null);

  const arm = React.useCallback(() => {
    if (!remaining.current) return; // duration 0 = sticky
    startedAt.current = Date.now();
    timer.current = window.setTimeout(onDismiss, remaining.current);
  }, [onDismiss]);
  const pause = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
      remaining.current -= Date.now() - startedAt.current;
    }
  };

  React.useEffect(() => {
    arm();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [arm]);

  return (
    <div
      role="status"
      onMouseEnter={pause}
      onMouseLeave={arm}
      className="pointer-events-auto relative overflow-hidden rounded-xl border border-border bg-panel p-3.5 pl-4 shadow-xl as-animate-fade-up"
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-y-0 left-0 w-1", variantBar[item.variant ?? "neutral"])}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-fg">{item.title}</p>
          {item.description && (
            <p className="mt-0.5 text-xs leading-relaxed text-fg/55">{item.description}</p>
          )}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className="shrink-0 rounded-md p-1 text-fg/40 outline-none transition-colors hover:bg-overlay/[0.06] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
