import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Pagination — Prev / windowed page buttons / Next.

    <Pagination page={page} total={12} onPageChange={setPage} />

  Shows a window of page buttons around the current one, with an "…" ellipsis on
  either side when there are hidden pages, plus Prev/Next controls that disable
  at the bounds. `siblingCount` controls how many pages flank the current page.
  The active page uses the accent-soft tint; every control is the house button
  style (whitespace-nowrap shrink-0) and both active/inactive carry a 1px border
  so switching pages never reflows. nav gets an aria-label; the active button
  gets aria-current="page".
*/

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages. */
  total: number;
  onPageChange: (page: number) => void;
  /** Pages to show on each side of the current page (default 1). */
  siblingCount?: number;
}

const DOTS = "dots" as const;

/** Build the list of page numbers (and DOTS markers) to render. Mirrors the
    common windowing algorithm: first + last are always shown, a sibling window
    surrounds the current page, and gaps collapse to a single ellipsis. */
function paginationRange(page: number, total: number, siblingCount: number): Array<number | typeof DOTS> {
  // first, last, current, and 2*siblings, plus 2 slots for the dots
  const totalToShow = siblingCount * 2 + 5;
  if (totalToShow >= total) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, total);

  // Only render dots when there's at least one page hidden behind them.
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 1;

  const first = 1;
  const last = total;

  if (!showLeftDots && showRightDots) {
    const leftCount = siblingCount * 2 + 3;
    const left = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...left, DOTS, last];
  }

  if (showLeftDots && !showRightDots) {
    const rightCount = siblingCount * 2 + 3;
    const right = Array.from({ length: rightCount }, (_, i) => total - rightCount + 1 + i);
    return [first, DOTS, ...right];
  }

  const middle = Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i);
  return [first, DOTS, ...middle, DOTS, last];
}

const CONTROL =
  "inline-flex h-9 min-w-9 shrink-0 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-asbir border px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

export function Pagination({ page, total, onPageChange, siblingCount = 1, className, ...props }: PaginationProps) {
  if (total <= 0) return null;
  const range = paginationRange(page, total, siblingCount);
  const atStart = page <= 1;
  const atEnd = page >= total;

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1.5", className)} {...props}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={atStart}
        onClick={() => onPageChange(page - 1)}
        className={cn(CONTROL, "border-border text-fg/70 hover:bg-overlay/[0.06] hover:text-fg")}
      >
        <ChevronLeft />
        <span>Prev</span>
      </button>

      {range.map((item, i) =>
        item === DOTS ? (
          <span
            key={`dots-${i}`}
            aria-hidden="true"
            className="inline-flex h-9 w-9 shrink-0 select-none items-center justify-center text-fg/45"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={cn(
              CONTROL,
              // BOTH states carry a 1px border so switching pages never reflows.
              item === page
                ? "border-accent/30 bg-accent/15 text-accent"
                : "border-border text-fg/70 hover:bg-overlay/[0.06] hover:text-fg"
            )}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={atEnd}
        onClick={() => onPageChange(page + 1)}
        className={cn(CONTROL, "border-border text-fg/70 hover:bg-overlay/[0.06] hover:text-fg")}
      >
        <span>Next</span>
        <ChevronRight />
      </button>
    </nav>
  );
}

function ChevronLeft() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
