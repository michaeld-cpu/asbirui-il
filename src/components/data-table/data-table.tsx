import * as React from "react";
import { cn } from "../../lib/cn";

/*
  DataTable — typed, sortable table with optional row selection.

    const columns: DataTableColumn<User>[] = [
      { key: "name", header: "Name", sortable: true },
      { key: "role", header: "Role" },
      { key: "credits", header: "Credits", align: "right", sortable: true,
        cell: (u) => u.credits.toLocaleString() },
    ];

    <DataTable columns={columns} data={users} getRowId={(u) => u.id} selectable />

  Sorting is client-side (click a sortable header to cycle asc → desc → off)
  and uses `sortValue` when the raw cell isn't comparable. `selectable`
  adds a checkbox column; read selection via onSelectionChange. Empty data
  renders `emptyMessage` across the full width.
*/

export interface DataTableColumn<T> {
  /** Unique key; also the default accessor into the row object. */
  key: string;
  header: React.ReactNode;
  /** Custom cell renderer; defaults to String(row[key]). */
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  /** Value used for comparison when sorting; defaults to row[key]. */
  sortValue?: (row: T) => string | number;
  align?: "left" | "right";
  /** Fixed width, e.g. "120px" or "20%". */
  width?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  onRowClick?: (row: T) => void;
  emptyMessage?: React.ReactNode;
  className?: string;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

function defaultSortValue<T>(row: T, key: string): string | number {
  const v = (row as Record<string, unknown>)[key];
  if (typeof v === "number") return v;
  return String(v ?? "");
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  selectable = false,
  onSelectionChange,
  onRowClick,
  emptyMessage = "No results",
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState>(null);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const sorted = React.useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;
    const value = (row: T) => col.sortValue?.(row) ?? defaultSortValue(row, col.key);
    return [...data].sort((a, b) => {
      const av = value(a);
      const bv = value(b);
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [data, sort, columns]);

  const cycleSort = (key: string) => {
    setSort((s) => {
      if (s?.key !== key) return { key, dir: "asc" };
      if (s.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const updateSelection = (next: Set<string>) => {
    setSelected(next);
    onSelectionChange?.(Array.from(next));
  };

  const allIds = React.useMemo(() => sorted.map(getRowId), [sorted, getRowId]);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = allIds.some((id) => selected.has(id));

  const toggleAll = () => {
    updateSelection(allSelected ? new Set() : new Set(allIds));
  };
  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    updateSelection(next);
  };

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-overlay/[0.03]">
            {selectable && (
              <th scope="col" className="w-10 px-3 py-2.5">
                <SelectBox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={toggleAll}
                  label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                  className={cn(
                    "px-3 py-2.5 text-xs font-semibold text-fg/55",
                    col.align === "right" ? "text-right" : "text-left"
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => cycleSort(col.key)}
                      className={cn(
                        "inline-flex shrink-0 select-none items-center gap-1 whitespace-nowrap rounded outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
                        active && "text-fg",
                        col.align === "right" && "flex-row-reverse"
                      )}
                    >
                      {col.header}
                      <svg
                        aria-hidden="true"
                        className={cn("h-3 w-3 transition-opacity", active ? "opacity-100" : "opacity-30")}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      >
                        {active && sort!.dir === "desc" ? <path d="m6 9 6 6 6-6" /> : <path d="m18 15-6-6-6 6" />}
                      </svg>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-3 py-10 text-center text-sm text-fg/45"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row) => {
              const id = getRowId(row);
              const isSelected = selected.has(id);
              return (
                <tr
                  key={id}
                  data-selected={isSelected || undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    isSelected ? "bg-accent/[0.06]" : "hover:bg-overlay/[0.03]",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {selectable && (
                    <td className="w-10 px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <SelectBox
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        label={`Select row ${id}`}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-3 py-2.5 text-fg/80",
                        col.align === "right" && "text-right tabular-nums"
                      )}
                    >
                      {col.cell ? col.cell(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function SelectBox({
  checked,
  indeterminate = false,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
}) {
  const ref = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={onChange}
      className="h-3.5 w-3.5 cursor-pointer accent-[var(--as-accent,#8b5cf6)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}
