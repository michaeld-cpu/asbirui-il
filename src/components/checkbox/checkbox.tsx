import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Checkbox — the house checkbox, with our own smooth stroke check instead of
  the thick OS-native glyph (accent-color can only tint that one, not slim it).

    <Checkbox checked={agreed} onCheckedChange={setAgreed} />
    <label className="flex items-center gap-2">
      <Checkbox defaultChecked /> Remember me
    </label>

  A real <input type="checkbox"> stays underneath (invisible, full-size) so
  focus, keyboard, forms, and screen readers all behave natively; the styled
  box on top just renders its state. `indeterminate` shows a minus and sets
  the native flag for assistive tech. Size with className (default h-4 w-4).
*/

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  indeterminate?: boolean;
  /** Convenience change handler; the native onChange still fires too. */
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked,
      defaultChecked,
      indeterminate = false,
      disabled,
      onChange,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const controlled = checked !== undefined;
    const [internal, setInternal] = React.useState(defaultChecked ?? false);
    const isChecked = controlled ? checked : internal;

    const innerRef = React.useRef<HTMLInputElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);
    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <span className={cn("relative inline-flex h-4 w-4 shrink-0", className)}>
        <input
          ref={innerRef}
          type="checkbox"
          checked={controlled ? checked : undefined}
          defaultChecked={controlled ? undefined : defaultChecked}
          disabled={disabled}
          onChange={(e) => {
            if (!controlled) setInternal(e.target.checked);
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          className="peer absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none rounded outline-none disabled:cursor-default"
          {...props}
        />
        {/* the visible box; the input above stays transparent and catches input */}
        <span
          aria-hidden="true"
          className={cn(
            "flex h-full w-full items-center justify-center rounded-[0.3125rem] border transition-colors",
            isChecked || indeterminate
              ? "border-accent bg-accent text-accent-fg"
              : "border-border bg-transparent text-transparent",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-ring",
            disabled && "opacity-50"
          )}
        >
          {indeterminate ? (
            <svg className="h-[70%] w-[70%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 12h12" />
            </svg>
          ) : (
            <svg className="h-[70%] w-[70%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </span>
      </span>
    );
  }
);
Checkbox.displayName = "Checkbox";
