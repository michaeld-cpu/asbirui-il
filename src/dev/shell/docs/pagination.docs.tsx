import * as React from "react";
import { Pagination } from "@/index";
import { hexToRgbTriplet, type ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function PaginationDemo({ v }: { v: ControlValues }) {
  const [page, setPage] = React.useState(4);
  return (
    <Pagination
      page={page}
      total={v.total as number}
      siblingCount={v.siblingCount as number}
      onPageChange={setPage}
    />
  );
}

export const paginationEntry: ComponentEntry = {
  slug: "pagination",
  name: "Pagination",
  tagline:
    "Prev / windowed page buttons / Next. A sibling window surrounds the current page, gaps collapse to an ellipsis, and the active page carries the accent tint.",
  controls: [
    { type: "slider", key: "total", label: "Total pages", min: 4, max: 20, step: 1, default: 12 },
    { type: "slider", key: "siblingCount", label: "Sibling count", min: 0, max: 2, step: 1, default: 1 },
    { type: "color", key: "accent", label: "Accent", default: "#8b5cf6" },
  ],
  render: (v) => (
    // scope the accent override to the demo — drives the active page tint
    <div style={{ ["--accent" as string]: hexToRgbTriplet(v.accent as string) }}>
      <PaginationDemo v={v} />
    </div>
  ),
  code: (v) =>
    `<Pagination page={page} total={${v.total}} siblingCount={${v.siblingCount}} onPageChange={setPage} />`,
  importPath: `import { Pagination } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "page", type: "number", description: "Current page, 1-based (controlled)." },
    { name: "total", type: "number", description: "Total number of pages." },
    { name: "onPageChange", type: "(page: number) => void", description: "Called with the next page on Prev/Next or a page click." },
    { name: "siblingCount", type: "number", description: "Pages shown on each side of the current page (default 1)." },
  ],
};
