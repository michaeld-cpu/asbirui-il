import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Textarea — a multiline field matching Input's chrome.

    <Textarea placeholder="Notes…" rows={4} />
    <Textarea invalid value={bio} onChange={…} />
    <Textarea autoGrow maxRows={10} />

  The wrapper carries the border and focus-within ring (invalid switches it to
  the danger color and sets aria-invalid). `autoGrow` grows the field to fit its
  content, capped at `maxRows`; past the cap it scrolls. forwardRef points at the
  <textarea>.
*/

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Grow to fit content up to maxRows, then scroll. */
  autoGrow?: boolean;
  /** Cap for autoGrow, in text rows. Default 8. */
  maxRows?: number;
  /** Class for the outer wrapper; `className` styles the <textarea>. */
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { invalid = false, autoGrow = false, maxRows = 8, rows = 3, disabled, className, wrapperClassName, onChange, value, ...props },
    ref
  ) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoGrow) return;
      el.style.height = "auto";
      const cs = window.getComputedStyle(el);
      const lineHeight = parseFloat(cs.lineHeight) || 20;
      const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
      const maxHeight = lineHeight * maxRows + paddingY + borderY;
      const next = Math.min(el.scrollHeight, maxHeight);
      el.style.height = `${next}px`;
      el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [autoGrow, maxRows]);

    // Resize on mount and whenever the value changes (covers controlled updates).
    React.useEffect(() => {
      resize();
    }, [resize, value]);

    return (
      <div
        className={cn(
          "flex rounded-asbir border bg-panel px-3 py-2 text-sm transition-colors focus-within:ring-2",
          invalid
            ? "border-red-500/60 focus-within:ring-red-500/40"
            : "border-border focus-within:ring-ring",
          disabled && "pointer-events-none opacity-50",
          wrapperClassName
        )}
      >
        <textarea
          ref={innerRef}
          rows={rows}
          value={value}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          onChange={(e) => {
            onChange?.(e);
            resize();
          }}
          className={cn(
            "w-full min-w-0 resize-y bg-transparent text-fg outline-none placeholder:text-fg/40",
            autoGrow && "resize-none",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
