import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../dropdown-menu";
import { cn } from "../../lib/cn";

/*
  Select — a styled single-value picker built on top of DropdownMenu.

    <Select
      value={region}
      onValueChange={setRegion}
      options={[{ value: "us", label: "US" }, { value: "eu", label: "EU" }]}
      placeholder="Choose a region…"
    />

  The trigger looks like an Input (bordered field with a chevron that rotates
  when open); the content lists the options with a check next to the active one.
  Roles / keyboard / outside-click come from DropdownMenu — this is a thin,
  opinionated preset over it.
*/

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  /** Class for the popover content. */
  contentClassName?: string;
}

const sizes: Record<NonNullable<SelectProps["size"]>, string> = {
  sm: "h-8 text-xs",
  md: "h-9 text-sm",
  lg: "h-11 text-sm",
};

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  size = "md",
  disabled = false,
  className,
  contentClassName,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-asbir border border-border bg-panel px-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            sizes[size],
            className
          )}
        >
          <span className={cn("min-w-0 truncate", selected ? "text-fg" : "text-fg/40")}>
            {selected ? selected.label : placeholder}
          </span>
          <svg
            aria-hidden="true"
            className={cn("h-4 w-4 shrink-0 text-fg/45 transition-transform", open && "rotate-180")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn("min-w-[8rem]", contentClassName)}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => onValueChange?.(opt.value)}
              className={cn("justify-between", active && "text-fg")}
            >
              <span className="min-w-0 truncate">{opt.label}</span>
              <svg
                aria-hidden="true"
                className={cn("h-4 w-4 shrink-0 text-accent", active ? "opacity-100" : "opacity-0")}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
