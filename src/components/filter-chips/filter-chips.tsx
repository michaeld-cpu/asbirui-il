import * as React from "react";
import { cn } from "../../lib/cn";

/*
  FilterChips — a labeled, single-select row of pill toggles.

  A compact segmented filter: one optional label, then a row of chips where
  exactly one is active. Used for things like endpoint / status / provider
  filters over a table or list.

    <FilterChips
      label="Endpoint"
      value={endpoint}
      onValueChange={setEndpoint}
      options={[
        { value: "all", label: "All" },
        { value: "chat", label: "chat" },
      ]}
    />

  Chips are real <button role="radio"> inside a role="radiogroup", so the
  active option is announced to assistive tech. Styling reads from the library
  semantic tokens; the active chip uses the accent-soft tint.
*/

export interface FilterChipOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
}

export interface FilterChipsProps<T extends string = string> {
  value: T;
  onValueChange: (value: T) => void;
  options: FilterChipOption<T>[];
  /** Optional leading label (rendered muted, as written). */
  label?: string;
  /** Accessible name for the group when no visible `label` is set. */
  "aria-label"?: string;
  className?: string;
}

export function FilterChips<T extends string = string>({
  value,
  onValueChange,
  options,
  label,
  "aria-label": ariaLabel,
  className,
}: FilterChipsProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel ?? label}
      className={cn("flex flex-wrap items-center gap-1.5", className)}
    >
      {label && (
        <span className="mr-1 text-xs font-medium text-fg/60 dark:text-fg/40">
          {label}
        </span>
      )}
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onValueChange(o.value)}
            className={cn(
              // BOTH states carry a 1px border so the box model is identical —
              // switching active chips never changes width, so the row can't
              // jitter/reflow. Active = low-alpha accent tint + accent border
              // and text; inactive = neutral border. The 15% tint (not the
              // full-opacity --accent-soft-bg, which is the SOLID color) keeps
              // the label readable in light + dark, themed or not.
              "rounded-lg border px-3 py-1.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-accent/30 bg-accent/15 text-accent"
                : "border-border text-fg/60 hover:bg-overlay/[0.05] hover:text-fg"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
