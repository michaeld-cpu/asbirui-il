import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/*
  Alert — an inline banner for status, warnings, and errors.

    <Alert variant="success" title="Saved" description="Your changes are live." />
    <Alert variant="danger" title="Deploy failed">
      <AlertDescription>Type error in app/page.tsx — see the logs.</AlertDescription>
    </Alert>

  Five variants, each a low-alpha tinted surface + border + matching icon (with
  dark: text variants so they read on both themes). Pass `icon` to override the
  default, or `icon={null}` to drop it; `onDismiss` adds a × button and `action`
  a trailing slot. role="alert" for danger/warning, role="status" otherwise.
*/

const alertVariants = cva(
  "relative flex gap-3 rounded-xl border p-4 text-sm [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:mt-0.5",
  {
    variants: {
      variant: {
        neutral: "border-border bg-overlay/[0.03] text-fg [&>svg]:text-fg/60",
        info: "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-200 [&>svg]:text-sky-600 dark:[&>svg]:text-sky-400",
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400",
        warning:
          "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
        danger:
          "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-200 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;

const DEFAULT_ICON: Record<AlertVariant, React.ReactNode> = {
  neutral: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  ),
};

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Override the default icon, or pass null to drop it. */
  icon?: React.ReactNode;
  /** Trailing action slot (e.g. a Button). */
  action?: React.ReactNode;
  /** Adds a × dismiss button that calls this. */
  onDismiss?: () => void;
}

export function Alert({
  variant = "neutral",
  title,
  description,
  icon,
  action,
  onDismiss,
  className,
  children,
  ...props
}: AlertProps) {
  const v = variant ?? "neutral";
  const showIcon = icon !== null;
  return (
    <div
      role={v === "danger" || v === "warning" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {showIcon && (icon ?? DEFAULT_ICON[v])}
      <div className="min-w-0 flex-1">
        {title != null && <AlertTitle>{title}</AlertTitle>}
        {description != null && <AlertDescription>{description}</AlertDescription>}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="-mr-1 -mt-1 shrink-0 rounded-md p-1 opacity-60 outline-none transition-opacity hover:bg-overlay/[0.08] hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-medium leading-snug", className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-0.5 text-sm leading-relaxed opacity-80", className)} {...props} />;
}
