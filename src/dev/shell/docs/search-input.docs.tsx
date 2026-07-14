import * as React from "react";
import { SearchInput } from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function SearchInputDemo({ v }: { v: ControlValues }) {
  const [q, setQ] = React.useState("");
  return (
    <div className="w-64 max-w-full">
      <SearchInput
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onClear={() => setQ("")}
        placeholder="Search projects…"
        kbd={v.kbd ? "⌘K" : undefined}
      />
    </div>
  );
}

export const searchInputEntry: ComponentEntry = {
  slug: "search-input",
  name: "Search Input",
  tagline:
    "A search-flavored preset over Input. A leading search icon; a trailing clear (×) appears once there's a value, and an optional keyboard hint shows in the suffix while empty.",
  controls: [{ type: "toggle", key: "kbd", label: "Show ⌘K hint", default: true }],
  render: (v) => <SearchInputDemo v={v} />,
  code: (v) =>
    `<SearchInput
  value={q}
  onChange={(e) => setQ(e.target.value)}
  onClear={() => setQ("")}${v.kbd ? `\n  kbd="⌘K"` : ""}
/>`,
  importPath: `import { SearchInput } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "value", type: "string", description: "Current query (controlled)." },
    { name: "onChange", type: "(e: ChangeEvent) => void", description: "Standard input change handler." },
    { name: "onClear", type: "() => void", description: "Called when the clear (×) button is pressed." },
    { name: "kbd", type: "React.ReactNode", description: `Keyboard hint shown at the trailing edge while empty (e.g. "⌘K").` },
  ],
};
