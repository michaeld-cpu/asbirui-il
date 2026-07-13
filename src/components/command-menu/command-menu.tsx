import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

/*
  CommandMenu — the ⌘K palette: fuzzy-filtered actions in a modal.

    const [open, setOpen] = useState(false);
    useCommandMenuShortcut(setOpen); // binds ⌘K / Ctrl+K

    <CommandMenu
      open={open}
      onOpenChange={setOpen}
      groups={[
        {
          heading: "Navigate",
          items: [
            { id: "home", label: "Go to Home", hint: "G H", onSelect: () => go("/") },
            { id: "docs", label: "Open Docs", icon: <BookIcon />, onSelect: () => go("/docs") },
          ],
        },
      ]}
    />

  Filtering is subsequence match on label + keywords ("gth" hits
  "Go to Home"). Arrow keys move the highlight, Enter runs the item,
  Escape closes. The list is a proper listbox for screen readers.
*/

export interface CommandItem {
  id: string;
  label: string;
  /** Extra strings the filter also matches against. */
  keywords?: string[];
  icon?: React.ReactNode;
  /** Right-aligned hint, e.g. a shortcut like "⌘ P". */
  hint?: string;
  disabled?: boolean;
  onSelect: () => void;
}

export interface CommandGroup {
  heading?: string;
  items: CommandItem[];
}

export interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandGroup[];
  placeholder?: string;
  emptyMessage?: string;
}

/** Binds ⌘K (mac) / Ctrl+K to toggle the palette. */
export function useCommandMenuShortcut(setOpen: React.Dispatch<React.SetStateAction<boolean>>) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
}

/* subsequence match: every query char appears in order */
function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

let cmdSeq = 0;

export function CommandMenu({
  open,
  onOpenChange,
  groups,
  placeholder = "Type a command or search…",
  emptyMessage = "No results found",
}: CommandMenuProps) {
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const baseId = React.useRef<string>();
  if (!baseId.current) baseId.current = `asbir-cmd-${++cmdSeq}`;

  const filtered = React.useMemo(() => {
    if (!query.trim()) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((it) =>
          fuzzyMatch(query, [it.label, ...(it.keywords ?? [])].join(" "))
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  const flat = React.useMemo(
    () => filtered.flatMap((g) => g.items).filter((it) => !it.disabled),
    [filtered]
  );

  // reset + focus on open
  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // clamp highlight when the result set shrinks
  React.useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, flat.length - 1)));
  }, [flat.length]);

  // keep the highlighted row in view
  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, filtered]);

  if (!open || typeof document === "undefined") return null;

  const run = (item: CommandItem) => {
    onOpenChange(false);
    item.onSelect();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % Math.max(1, flat.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % Math.max(1, flat.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[activeIndex];
      if (item) run(item);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[18vh]">
      <div
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
        className="as-animate-fade-in absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onKeyDown={onKeyDown}
        className="as-animate-scale-in relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-panel shadow-2xl"
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-fg/40"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={placeholder}
            role="combobox"
            aria-expanded="true"
            aria-controls={`${baseId.current}-list`}
            aria-activedescendant={
              flat[activeIndex] ? `${baseId.current}-item-${flat[activeIndex].id}` : undefined
            }
            aria-autocomplete="list"
            className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg/35"
          />
          <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-fg/45">
            Esc
          </kbd>
        </div>

        <div
          ref={listRef}
          id={`${baseId.current}-list`}
          role="listbox"
          aria-label="Commands"
          className="max-h-[min(20rem,50vh)] overflow-y-auto p-1.5"
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-fg/45">{emptyMessage}</p>
          ) : (
            filtered.map((group, gi) => (
              <div key={group.heading ?? gi} role="presentation">
                {group.heading && (
                  <p className="px-2.5 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wider text-fg/40">
                    {group.heading}
                  </p>
                )}
                {group.items.map((item) => {
                  const flatIdx = flat.indexOf(item);
                  const active = flatIdx === activeIndex && !item.disabled;
                  return (
                    <div
                      key={item.id}
                      id={`${baseId.current}-item-${item.id}`}
                      role="option"
                      aria-selected={active}
                      aria-disabled={item.disabled || undefined}
                      data-active={active || undefined}
                      onMouseMove={() => !item.disabled && setActiveIndex(flatIdx)}
                      onClick={() => !item.disabled && run(item)}
                      className={cn(
                        "flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
                        active ? "bg-overlay/[0.08] text-fg" : "text-fg/70",
                        item.disabled && "cursor-default opacity-40"
                      )}
                    >
                      {item.icon && (
                        <span aria-hidden="true" className="flex h-4 w-4 shrink-0 items-center justify-center text-fg/50 [&_svg]:h-4 [&_svg]:w-4">
                          {item.icon}
                        </span>
                      )}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {item.hint && (
                        <span className="shrink-0 text-[11px] tracking-wide text-fg/35">
                          {item.hint}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
