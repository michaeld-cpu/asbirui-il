import * as React from "react";
import { Input, type InputProps } from "../input";
import { cn } from "../../lib/cn";

/*
  SearchInput — a search-flavored preset over Input.

    <SearchInput value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} />
    <SearchInput value={q} onChange={…} kbd="⌘K" placeholder="Search…" />

  A leading search icon; a trailing clear (×) button appears once there's a
  value (it calls onClear, falling back to onChange with an empty string). When
  empty, an optional `kbd` hint (e.g. "⌘K") shows in the suffix instead.
*/

export interface SearchInputProps extends Omit<InputProps, "prefix" | "suffix" | "type"> {
  /** Called when the clear button is pressed. */
  onClear?: () => void;
  /** Keyboard hint shown at the trailing edge while empty (e.g. "⌘K"). */
  kbd?: React.ReactNode;
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, kbd, placeholder = "Search…", disabled, ...props }, ref) => {
    const hasValue = value != null && String(value).length > 0;

    const clear = () => {
      onClear?.();
      // Fall back to firing onChange with "" so inputs that only wire onChange
      // still get emptied.
      onChange?.({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <Input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        prefix={<SearchIcon />}
        suffix={
          hasValue ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={clear}
              disabled={disabled}
              className="flex h-5 w-5 items-center justify-center rounded-full text-fg/45 outline-none transition-colors hover:bg-overlay/[0.08] hover:text-fg focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          ) : kbd ? (
            <kbd className="pointer-events-none select-none whitespace-nowrap rounded border border-border bg-overlay/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-fg/55">
              {kbd}
            </kbd>
          ) : undefined
        }
        className={cn("[&::-webkit-search-cancel-button]:appearance-none")}
        {...props}
      />
    );
  }
);
SearchInput.displayName = "SearchInput";
