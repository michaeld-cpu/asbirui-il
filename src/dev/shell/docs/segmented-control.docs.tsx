import * as React from "react";
import { SegmentedControl } from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function SegmentedControlDemo({ v }: { v: ControlValues }) {
  const [range, setRange] = React.useState("week");
  return (
    <SegmentedControl
      value={range}
      onValueChange={setRange}
      size={v.size as "md"}
      aria-label="Date range"
      options={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
    />
  );
}

export const segmentedControlEntry: ComponentEntry = {
  slug: "segmented-control",
  name: "Segmented Control",
  tagline:
    "A single-select control in a bordered track — a pure radiogroup (no panels), styled like the Tabs pills. Roving arrow-key focus moves and selects between segments.",
  controls: [
    {
      type: "select",
      key: "size",
      label: "Size",
      default: "md",
      options: [
        { value: "sm", label: "sm" },
        { value: "md", label: "md" },
      ],
    },
  ],
  render: (v) => <SegmentedControlDemo v={v} />,
  code: (v) => `<SegmentedControl
  value={range}
  onValueChange={setRange}
  size="${v.size}"
  options={[
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ]}
/>`,
  importPath: `import { SegmentedControl } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "value", type: "string", description: "The active segment's value (controlled)." },
    { name: "onValueChange", type: "(value: string) => void", description: "Called when a segment is chosen — by click or arrow keys." },
    { name: "options", type: "{ value; label; icon?; disabled? }[]", description: "The segments; each may carry a leading icon and be disabled." },
    { name: "size", type: `"sm" | "md"`, description: "Track and segment height (default md)." },
  ],
};
