import * as React from "react";
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FilterChips,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/index";
import type { BlockEntry } from "./entry";

const SearchIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3-3" />
  </svg>
);
const PlusIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ROWS = [
  { name: "Aurora API", status: "Active", updated: "2h ago" },
  { name: "Billing sync", status: "Paused", updated: "5h ago" },
  { name: "Webhook relay", status: "Active", updated: "1d ago" },
];

/* ---- 01 · search + filters ------------------------------------------------ */

function SearchFilters() {
  const [status, setStatus] = React.useState("all");
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3">
        <Input placeholder="Search records…" prefix={SearchIcon} wrapperClassName="min-w-[12rem] flex-1" />
        <FilterChips
          label="Status"
          value={status}
          onValueChange={setStatus}
          options={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "paused", label: "Paused" },
          ]}
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex shrink-0 select-none items-center gap-1.5 whitespace-nowrap rounded-asbir bg-solid px-3 py-2 text-sm font-semibold text-fg-invert outline-none transition-colors hover:bg-solid/85 focus-visible:ring-2 focus-visible:ring-ring">
            {PlusIcon}
            New
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem]">
            <DropdownMenuItem>Record</DropdownMenuItem>
            <DropdownMenuItem>Import CSV</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Clear all</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        <div className="flex items-center gap-4 border-b border-border bg-panel px-4 py-2.5 text-xs font-medium text-fg/70">
          <span className="flex-1">Name</span>
          <span className="w-24">Status</span>
          <span className="w-24 text-right">Updated</span>
        </div>
        {ROWS.map((r) => (
          <div key={r.name} className="flex items-center gap-4 border-b border-border/60 px-4 py-2.5 text-sm text-fg/80 last:border-0">
            <span className="flex-1">{r.name}</span>
            <span className="w-24 text-fg/60">{r.status}</span>
            <span className="w-24 text-right text-fg/50">{r.updated}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- 02 · bulk actions ------------------------------------------------------ */

function BulkActions() {
  const [selected, setSelected] = React.useState<string[]>(["Aurora API", "Webhook relay"]);
  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));
  const all = selected.length === ROWS.length;
  return (
    <div className="w-full">
      {/* selection bar replaces the toolbar while rows are selected */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-accent/30 bg-accent/[0.07] px-4 py-2.5">
        <Checkbox
          checked={all}
          indeterminate={selected.length > 0 && !all}
          onCheckedChange={() => setSelected(all ? [] : ROWS.map((r) => r.name))}
          aria-label="Select all"
          className="h-3.5 w-3.5"
        />
        <span className="text-sm font-medium text-fg">
          {selected.length} selected
        </span>
        <span className="flex-1" />
        <Button variant="ghost" size="sm">Archive</Button>
        <Button variant="ghost" size="sm">Export</Button>
        <Button variant="destructive" size="sm">Delete</Button>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        {ROWS.map((r) => {
          const isSelected = selected.includes(r.name);
          return (
            <label
              key={r.name}
              className={`flex cursor-pointer items-center gap-3 border-b border-border/60 px-4 py-2.5 text-sm last:border-0 ${
                isSelected ? "bg-accent/[0.06]" : "hover:bg-overlay/[0.03]"
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggle(r.name)}
                className="h-3.5 w-3.5"
              />
              <span className="flex-1 text-fg/80">{r.name}</span>
              <Badge variant={r.status === "Active" ? "success" : "warning"} dot>
                {r.status}
              </Badge>
              <span className="w-20 text-right text-fg/50">{r.updated}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* ---- 03 · view tabs ------------------------------------------------------------ */

const VIEWS = [
  { value: "all", label: "All", count: 24 },
  { value: "active", label: "Active", count: 18 },
  { value: "archived", label: "Archived", count: 6 },
];

function ViewTabs() {
  const [view, setView] = React.useState("all");
  return (
    <div className="w-full">
      <Tabs value={view} onValueChange={setView}>
        {/* one shared hairline under the whole row; the TabsList's own border
            is dropped so tabs and controls sit on the same baseline */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border">
          <TabsList className="border-b-0">
            {VIEWS.map((v) => (
              <TabsTrigger key={v.value} value={v.value}>
                {v.label}
                <span className="ml-1.5 rounded-full bg-overlay/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-fg/55">
                  {v.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center gap-2 pb-2">
            <Input size="sm" placeholder="Filter…" prefix={SearchIcon} wrapperClassName="w-44" />
            <Button variant="outline" size="sm">
              Columns
            </Button>
          </div>
        </div>
      </Tabs>
      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        {ROWS.map((r) => (
          <div key={r.name} className="flex items-center gap-4 border-b border-border/60 px-4 py-2.5 text-sm last:border-0">
            <span className="flex-1 text-fg/80">{r.name}</span>
            <Badge variant={r.status === "Active" ? "success" : "warning"} dot>
              {r.status}
            </Badge>
            <span className="w-20 text-right text-fg/50">{r.updated}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- registry ---------------------------------------------------------------- */

export const tableToolbarBlock: BlockEntry = {
  slug: "table-toolbar",
  name: "Table toolbar",
  tagline: "Data-table headers — search + filters for browsing, and a selection bar with bulk actions.",
  wide: true,
  variants: [
    {
      id: "table-toolbar-01",
      title: "Search + filters",
      description: "Search Input, FilterChips status filter, and a New dropdown action.",
      render: () => <SearchFilters />,
      code: `import { Input, FilterChips, DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@asbirtech/asbir-ui";

<div className="flex flex-wrap items-center gap-3">
  <Input placeholder="Search records…" prefix={<SearchIcon />}
    wrapperClassName="min-w-[12rem] flex-1" />

  <FilterChips
    label="Status"
    value={status}
    onValueChange={setStatus}
    options={[
      { value: "all", label: "All" },
      { value: "active", label: "Active" },
      { value: "paused", label: "Paused" },
    ]}
  />

  <DropdownMenu>
    <DropdownMenuTrigger className="… bg-solid text-fg-invert">
      <PlusIcon /> New
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>Record</DropdownMenuItem>
      <DropdownMenuItem>Import CSV</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem destructive>Clear all</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>`,
    },
    {
      id: "table-toolbar-02",
      title: "Bulk actions",
      description: "When rows are selected the toolbar becomes an accent-tinted action bar with a tri-state select-all.",
      render: () => <BulkActions />,
      code: `import { Badge, Button, Checkbox } from "@asbirtech/asbir-ui";

<div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/[0.07] px-4 py-2.5">
  <Checkbox
    checked={all}
    indeterminate={selected.length > 0 && !all}
    onCheckedChange={toggleAll}
    aria-label="Select all"
    className="h-3.5 w-3.5"
  />
  <span className="text-sm font-medium text-fg">{selected.length} selected</span>
  <span className="flex-1" />
  <Button variant="ghost" size="sm">Archive</Button>
  <Button variant="ghost" size="sm">Export</Button>
  <Button variant="destructive" size="sm">Delete</Button>
</div>

{rows.map((r) => (
  <label key={r.name} className={cn("flex items-center gap-3 px-4 py-2.5",
    isSelected(r) ? "bg-accent/[0.06]" : "hover:bg-overlay/[0.03]")}>
    <Checkbox checked={isSelected(r)} onCheckedChange={() => toggle(r)} className="h-3.5 w-3.5" />
    <span className="flex-1">{r.name}</span>
    <Badge variant={r.status === "Active" ? "success" : "warning"} dot>{r.status}</Badge>
  </label>
))}`,
    },
    {
      id: "table-toolbar-03",
      title: "View tabs",
      description: "Saved views as underline Tabs with count pills, filter and column controls on the same hairline.",
      render: () => <ViewTabs />,
      code: `import { Badge, Button, Input, Tabs, TabsList, TabsTrigger } from "@asbirtech/asbir-ui";

<Tabs value={view} onValueChange={setView}>
  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border">
    <TabsList className="border-b-0">
      {views.map((v) => (
        <TabsTrigger key={v.value} value={v.value}>
          {v.label}
          <span className="ml-1.5 rounded-full bg-overlay/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-fg/55">
            {v.count}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
    <div className="flex items-center gap-2 pb-2">
      <Input size="sm" placeholder="Filter…" prefix={<SearchIcon />} wrapperClassName="w-44" />
      <Button variant="outline" size="sm">Columns</Button>
    </div>
  </div>
</Tabs>

{rows.map((r) => (
  <div key={r.name} className="flex items-center gap-4 border-b border-border/60 px-4 py-2.5 text-sm last:border-0">
    <span className="flex-1 text-fg/80">{r.name}</span>
    <Badge variant={r.status === "Active" ? "success" : "warning"} dot>{r.status}</Badge>
    <span className="w-20 text-right text-fg/50">{r.updated}</span>
  </div>
))}`,
    },
  ],
};
