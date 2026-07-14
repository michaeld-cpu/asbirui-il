import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/*
  SegmentedControl — a single-select control in a bordered track.

    <SegmentedControl
      value={view}
      onValueChange={setView}
      options={[
        { value: "list", label: "List", icon: <ListIcon /> },
        { value: "grid", label: "Grid", icon: <GridIcon /> },
      ]}
    />

  A pure control (no panels — unlike Tabs): a role="radiogroup" track of
  segments where one is active, styled like the Tabs "pills" look. The active
  segment carries the overlay highlight. Roving arrow-key focus (Left/Right/
  Home/End) moves and selects between enabled segments. Both active and inactive
  segments read from the semantic tokens so it re-themes with the palette.
*/

const trackVariants = cva("inline-flex items-center rounded-lg border border-border bg-panel", {
  variants: {
    size: {
      sm: "gap-0.5 p-0.5",
      md: "gap-1 p-1",
    },
  },
  defaultVariants: { size: "md" },
});

const segmentVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3 text-sm",
      },
      active: {
        true: "bg-overlay/[0.08] text-fg",
        false: "text-fg/55 hover:text-fg",
      },
    },
    defaultVariants: { size: "md", active: false },
  }
);

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string>
  extends VariantProps<typeof trackVariants> {
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentedControlOption<T>[];
  /** Disable the whole control. */
  disabled?: boolean;
  /** Accessible name for the group. */
  "aria-label"?: string;
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  value,
  onValueChange,
  options,
  size,
  disabled,
  "aria-label": ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  // Roving focus: arrow keys move to (and select) the next enabled segment.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const segments = Array.from(
      ref.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]:not([disabled])') ?? []
    );
    if (segments.length === 0) return;
    const current = segments.indexOf(document.activeElement as HTMLButtonElement);
    let next = current;
    if (e.key === "ArrowLeft") next = current <= 0 ? segments.length - 1 : current - 1;
    if (e.key === "ArrowRight") next = current === segments.length - 1 ? 0 : current + 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = segments.length - 1;
    e.preventDefault();
    segments[next]?.focus();
    segments[next]?.click();
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      onKeyDown={onKeyDown}
      className={cn(trackVariants({ size }), disabled && "pointer-events-none opacity-60", className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled || o.disabled}
            // roving tabindex: only the active segment is in the tab order
            tabIndex={active ? 0 : -1}
            onClick={() => onValueChange(o.value)}
            className={cn(segmentVariants({ size, active }))}
          >
            {o.icon && <span className="inline-flex shrink-0">{o.icon}</span>}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
