import { Badge, DataTable, type DataTableColumn } from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

type Run = { id: string; project: string; status: "ready" | "building" | "failed"; duration: number };

const RUNS: Run[] = [
  { id: "run_01", project: "lumina-web", status: "ready", duration: 42 },
  { id: "run_02", project: "asbir-docs", status: "building", duration: 18 },
  { id: "run_03", project: "lumina-api", status: "ready", duration: 63 },
  { id: "run_04", project: "brand-site", status: "failed", duration: 7 },
  { id: "run_05", project: "tokens-cli", status: "ready", duration: 29 },
];

const STATUS_VARIANT = { ready: "success", building: "warning", failed: "danger" } as const;

function DataTableDemo({ v }: { v: ControlValues }) {
  const sortable = v.sortable as boolean;
  const columns: DataTableColumn<Run>[] = [
    { key: "project", header: "Project", sortable },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <Badge variant={STATUS_VARIANT[r.status]} dot>
          {r.status}
        </Badge>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      align: "right",
      sortable,
      cell: (r) => `${r.duration}s`,
    },
  ];
  return (
    <DataTable
      className="w-[26rem] max-w-full"
      columns={columns}
      data={v.empty ? [] : RUNS}
      getRowId={(r) => r.id}
      selectable={v.selectable as boolean}
      emptyMessage="No runs yet"
    />
  );
}

export const dataTableEntry: ComponentEntry = {
  slug: "data-table",
  name: "Data Table",
  tagline:
    "Typed, sortable table with optional row selection. Click a sortable header to cycle ascending → descending → off; selection is a checkbox column with a tri-state select-all.",
  controls: [
    { type: "toggle", key: "selectable", label: "Selectable rows", default: true },
    { type: "toggle", key: "sortable", label: "Sortable columns", default: true },
    { type: "toggle", key: "empty", label: "Empty state", default: false },
  ],
  render: (v) => <DataTableDemo v={v} />,
  code: (v) => `const columns: DataTableColumn<Run>[] = [
  { key: "project", header: "Project"${v.sortable ? ", sortable: true" : ""} },
  { key: "status", header: "Status", cell: (r) => <Badge dot>{r.status}</Badge> },
  { key: "duration", header: "Duration", align: "right"${v.sortable ? ", sortable: true" : ""} },
];

<DataTable
  columns={columns}
  data={runs}
  getRowId={(r) => r.id}${v.selectable ? "\n  selectable" : ""}
  emptyMessage="No runs yet"
/>`,
  importPath: `import { DataTable, type DataTableColumn } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "columns", type: "DataTableColumn<T>[]", description: "{ key, header, cell?, sortable?, sortValue?, align?, width? } per column." },
    { name: "data", type: "T[]", description: "Row objects; sorting is client-side and non-destructive." },
    { name: "getRowId", type: "(row: T) => string", description: "Stable id per row — keys rows and tracks selection." },
    { name: "selectable", type: "boolean", description: "Adds the checkbox column with tri-state select-all." },
    { name: "onSelectionChange", type: "(ids: string[]) => void", description: "Fires with the selected row ids." },
    { name: "onRowClick", type: "(row: T) => void", description: "Makes rows clickable (checkbox clicks don't trigger it)." },
    { name: "emptyMessage", type: "ReactNode", description: "Rendered across the table when data is empty." },
  ],
};
