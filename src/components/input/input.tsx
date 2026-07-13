import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Input — single-line text field with optional leading/trailing adornments.

    <Input placeholder="Search runs…" />
    <Input invalid value={email} onChange={…} />
    <Input prefix={<SearchIcon />} suffix={<Kbd>⌘K</Kbd>} />

  The wrapper (not the <input>) carries the border/focus ring so adornments
  sit inside the field. `invalid` switches the ring to the danger color and
  sets aria-invalid for assistive tech.
*/

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** Renders inside the field, before the text (icon, label…). */
  prefix?: React.ReactNode;
  /** Renders inside the field, after the text (kbd hint, unit…). */
  suffix?: React.ReactNode;
  invalid?: boolean;
  size?: "sm" | "md" | "lg";
  /** Class for the outer wrapper; `className` styles the <input> itself. */
  wrapperClassName?: string;
}

const sizes: Record<NonNullable<InputProps["size"]>, string> = {
  sm: "h-8 text-xs",
  md: "h-9 text-sm",
  lg: "h-11 text-sm",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { prefix, suffix, invalid = false, size = "md", className, wrapperClassName, disabled, ...props },
    ref
  ) => (
    <div
      className={cn(
        "flex items-center gap-2 rounded-asbir border bg-panel px-3 transition-colors",
        "focus-within:ring-2",
        invalid
          ? "border-red-500/60 focus-within:ring-red-500/40"
          : "border-border focus-within:ring-ring",
        disabled && "pointer-events-none opacity-50",
        sizes[size],
        wrapperClassName
      )}
    >
      {prefix && <span className="flex shrink-0 items-center text-fg/45 [&_svg]:h-4 [&_svg]:w-4">{prefix}</span>}
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-full w-full min-w-0 bg-transparent text-fg outline-none placeholder:text-fg/40",
          className
        )}
        {...props}
      />
      {suffix && <span className="flex shrink-0 items-center text-fg/45 [&_svg]:h-4 [&_svg]:w-4">{suffix}</span>}
    </div>
  )
);
Input.displayName = "Input";
