import * as React from "react";
import { cn } from "../../lib/cn";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../dropdown-menu";

/*
  SelectMenu — a form-select-shaped control built on <DropdownMenu>.

  A drop-in replacement for a native <select> that inherits the library's
  accessible menu behaviour (keyboard nav, focus management, token styling)
  while keeping the familiar value / onValueChange / options API:

    <SelectMenu
      value={model}
      onValueChange={setModel}
      options={MODELS.map((m) => ({ value: m.id, label: m.label }))}
    />

  The trigger fills its container (like an input) and shows the selected
  option's label; the open menu marks the current value with a check.
*/

const ChevronIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const CheckIcon = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectMenuProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  /** Shown on the trigger when no option matches `value`. */
  placeholder?: string;
  /** Menu alignment relative to the trigger. */
  align?: "start" | "end";
  disabled?: boolean;
  /** Extra classes for the trigger button. */
  className?: string;
  /** Accessible label when there's no visible <label> wired to it. */
  "aria-label"?: string;
}

export function SelectMenu({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  align = "start",
  disabled,
  className,
  "aria-label": ariaLabel,
}: SelectMenuProps) {
  const selected = options.find((o) => o.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-canvas px-3 py-2 text-left text-sm text-fg outline-none transition-colors focus-visible:[border-color:rgb(var(--accent)/0.6)] focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <span className={cn("truncate", !selected && "text-fg/40")}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="shrink-0 text-fg/50">{ChevronIcon}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="max-h-72 min-w-[12rem] overflow-y-auto">
        {options.map((o) => (
          <DropdownMenuItem
            key={o.value}
            disabled={o.disabled}
            onSelect={() => onValueChange(o.value)}
          >
            <span className="flex-1 truncate">{o.label}</span>
            {o.value === value && (
              <span className="shrink-0 text-accent-soft-fg">{CheckIcon}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
