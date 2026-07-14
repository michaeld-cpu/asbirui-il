import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Kbd — a keyboard-key chip.

    <Kbd>⌘</Kbd> <Kbd>K</Kbd>
    <Kbd>Esc</Kbd>

  A <kbd> with a subtle border and panel fill; single characters get a min
  width so ⌘ / K / ? line up as even squares.
*/

export const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded border border-border bg-panel px-1.5 py-0.5 text-center align-middle font-mono text-[11px] font-medium leading-none text-fg/60",
        className
      )}
      {...props}
    />
  )
);
Kbd.displayName = "Kbd";
