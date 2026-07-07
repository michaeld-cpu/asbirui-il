import * as React from "react";
import { Icons } from "./admin-ui";

/*
  Reusable UI states + primitives shared across the admin pages: page header,
  buttons, badges, inputs, tabs, and the four data states every real list needs
  — loading (skeleton), empty, error, and (implicitly) loaded. Token-driven so
  restyling happens in tokens.css, not here.
*/

/* ---- buttons ---- */
export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-colors disabled:opacity-40 disabled:pointer-events-none";
  const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-3.5 py-2 text-sm" };
  const variants = {
    primary: "bg-solid text-fg-invert font-semibold hover:bg-solid/85",
    secondary: "border border-border text-fg hover:bg-overlay/[0.05]",
    ghost: "text-fg/70 hover:bg-overlay/[0.05] hover:text-fg",
    danger: "bg-rose-500/90 text-white font-semibold hover:bg-rose-500",
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}

/* ---- badge ---- */
export function Badge({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex rounded-md px-1.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

/* ---- inputs ---- */
export const inputCls =
  "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg/35 outline-none transition-colors focus:border-fg/40";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-rose-400">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-fg/45">{hint}</span>
      ) : null}
    </label>
  );
}

/* ---- page header ---- */
export function PageHeader({
  title,
  subtitle,
  action,
  back,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      {back && (
        <a
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-fg/55 transition-colors hover:text-fg"
        >
          {Icons.arrowLeft}
          {back.label}
        </a>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-fg/55">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

/* ---- tabs (controlled by the caller / router) ---- */
export function Tabs({
  tabs,
}: {
  tabs: { label: string; href: string; active: boolean }[];
}) {
  return (
    <div className="mb-6 flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <a
          key={t.href}
          href={t.href}
          className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${
            t.active
              ? "border-fg font-medium text-fg"
              : "border-transparent text-fg/55 hover:text-fg"
          }`}
        >
          {t.label}
        </a>
      ))}
    </div>
  );
}

/* ---- data states ---- */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-panel/50 px-6 py-16 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-overlay/[0.06] text-fg/40">
        {Icons.inbox}
      </span>
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-fg/55">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  onRetry,
  message = "Something went wrong while loading this data.",
}: {
  onRetry?: () => void;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-rose-500/30 bg-rose-500/[0.04] px-6 py-16 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
        {Icons.alert}
      </span>
      <h3 className="text-sm font-semibold text-fg">Couldn't load</h3>
      <p className="mt-1 max-w-sm text-sm text-fg/55">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-overlay/[0.08] ${className}`} />;
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-panel">
      <div className="border-b border-border px-4 py-3">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-3.5">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className={`h-4 ${c === 0 ? "w-40" : "w-24"}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- confirm dialog ---- */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-panel p-5 shadow-2xl">
        <h3 className="text-base font-semibold text-fg">{title}</h3>
        <p className="mt-1.5 text-sm text-fg/60">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

/* ---- toast (very small, self-dismissing) ---- */
type Toast = { id: number; message: string };
const ToastCtx = React.createContext<(msg: string) => void>(() => {});
export const useToast = () => React.useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const idRef = React.useRef(0);
  const push = React.useCallback((message: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3.5 py-2.5 text-sm text-fg shadow-lg animate-fade-up"
          >
            <span className="text-emerald-400">{Icons.check}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
