import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/*
  Button — the workhorse action element.

    <Button>Save changes</Button>
    <Button variant="outline" size="sm">Cancel</Button>
    <Button variant="destructive" loading>Deleting…</Button>

  Variants map to the semantic tokens, so every button re-themes with the
  palette. `loading` swaps the label for a spinner while keeping the button's
  width (the label goes invisible instead of unmounting) so rows never jitter.
  Labels never wrap — long text truncates rather than stacking.
*/

const buttonVariants = cva(
  // whitespace-nowrap + shrink-0: button labels must never wrap or squash
  "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-asbir font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-solid text-fg-invert hover:bg-solid/85",
        secondary:
          "border border-border bg-panel text-fg hover:bg-overlay/[0.06]",
        outline:
          "border border-border bg-transparent text-fg hover:bg-overlay/[0.05]",
        ghost: "bg-transparent text-fg/70 hover:bg-overlay/[0.06] hover:text-fg",
        accent: "ai-bg-accent bg-accent text-white hover:opacity-90",
        destructive:
          "bg-red-600 text-white hover:bg-red-600/90 dark:bg-red-500 dark:hover:bg-red-500/90",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
        icon: "h-9 w-9 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows a spinner and disables the button; width is preserved. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      type={props.type ?? "button"}
      disabled={disabled || loading}
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size }), "relative", className)}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 3a9 9 0 1 1-9 9" />
          </svg>
        </span>
      )}
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>
        {children}
      </span>
    </button>
  )
);
Button.displayName = "Button";

export { buttonVariants };
