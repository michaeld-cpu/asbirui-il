import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/dropdown-menu";
import { Icons, Sparkline } from "./ai-ui";

/* Shared primitives + states for the AI console. Accent-aware (violet). */

/* FormSelect — a native-<select> replacement, composed directly from the
   library DropdownMenu (no separate SelectMenu component). Fills its container
   like an input; shows the selected label; checks the active option. */
export function FormSelect({
  value,
  onValueChange,
  options,
  ariaLabel,
  className = "",
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: React.ReactNode }[];
  ariaLabel?: string;
  className?: string;
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={ariaLabel}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-canvas px-3 py-2 text-left text-sm text-fg outline-none transition-colors hover:bg-overlay/[0.02] focus-visible:[border-color:rgb(var(--accent)/0.6)] ${className}`}
      >
        <span className="truncate">{selected ? selected.label : "Select…"}</span>
        <span className="shrink-0 text-fg/50">{Icons.chevronDown}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 min-w-[12rem] overflow-y-auto">
        {options.map((o) => (
          <DropdownMenuItem key={o.value} onSelect={() => onValueChange(o.value)}>
            <span className="flex-1">{o.label}</span>
            {o.value === value && (
              <span className="text-accent-soft-fg [&_svg]:h-3.5 [&_svg]:w-3.5">{Icons.check}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}) {
  const base = "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-colors disabled:opacity-40 disabled:pointer-events-none";
  const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-3.5 py-2 text-sm" };
  const variants = {
    primary: "text-white font-semibold [background-color:rgb(var(--accent))] hover:[background-color:rgb(var(--accent-hover))]",
    secondary: "border border-border text-fg hover:bg-overlay/[0.05]",
    ghost: "text-fg/70 hover:bg-overlay/[0.05] hover:text-fg",
    danger: "bg-rose-500/90 text-white font-semibold hover:bg-rose-500",
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}

export function Badge({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <span className={`inline-flex rounded-md px-1.5 py-0.5 text-xs font-medium ${className}`}>{children}</span>;
}

export const inputCls = "w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-fg placeholder:text-fg/35 outline-none transition-colors focus:[border-color:rgb(var(--accent)/0.6)]";

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-rose-700 dark:text-rose-400">{error}</span> : hint ? <span className="mt-1 block text-xs text-fg/65 dark:text-fg/45">{hint}</span> : null}
    </label>
  );
}

export function PageHeader({ title, subtitle, action, back }: { title: string; subtitle?: string; action?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6">
      {back && (
        <a href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-sm text-fg/70 dark:text-fg/55 transition-colors hover:text-fg">
          {Icons.arrowLeft}{back.label}
        </a>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-fg/70 dark:text-fg/55">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function Tabs({ tabs }: { tabs: { label: string; href: string; active: boolean }[] }) {
  return (
    <div className="mb-6 flex gap-1 border-b border-border">
      {tabs.map((t) => (
        <a key={t.href} href={t.href}
          className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${t.active ? "[border-color:rgb(var(--accent))] font-medium text-fg" : "border-transparent text-fg/70 dark:text-fg/55 hover:text-fg"}`}>
          {t.label}
        </a>
      ))}
    </div>
  );
}

/* KPI tile with optional sparkline + delta. */
export function KpiTile({ label, value, delta, up, spark }: { label: string; value: string; delta?: string; up?: boolean; spark?: number[] }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-4">
      <p className="text-sm text-fg/70 dark:text-fg/55">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {delta && <p className={`mt-1 text-xs font-medium ${up ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>{delta}</p>}
        </div>
        {spark && <Sparkline data={spark} className="h-8 w-24" />}
      </div>
    </div>
  );
}

/* Code block with copy. */
export function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-canvas">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-fg/60 dark:text-fg/40">{lang}</span>
        <button onClick={copy} className="flex items-center gap-1 text-[11px] text-fg/70 dark:text-fg/50 transition-colors hover:text-fg">
          {copied ? Icons.check : Icons.copy}{copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-3 text-xs leading-relaxed text-fg/80"><code>{code}</code></pre>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-panel/50 px-6 py-16 text-center">
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-overlay/[0.06] text-fg/60 dark:text-fg/40">{Icons.inbox}</span>
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-fg/70 dark:text-fg/55">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", danger, onConfirm, onCancel }: { open: boolean; title: string; description: string; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-panel p-5 shadow-2xl">
        <h3 className="text-base font-semibold text-fg">{title}</h3>
        <p className="mt-1.5 text-sm text-fg/60">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-panel p-5 shadow-2xl">
        <h3 className="mb-4 text-base font-semibold text-fg">{title}</h3>
        {children}
      </div>
    </div>
  );
}

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
          <div key={t.id} className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3.5 py-2.5 text-sm text-fg shadow-lg animate-fade-up">
            <span className="text-emerald-700 dark:text-emerald-400">{Icons.check}</span>{t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
