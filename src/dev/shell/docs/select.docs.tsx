import * as React from "react";
import { Select } from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

const REGIONS = [
  { value: "us-east", label: "US East (N. Virginia)" },
  { value: "us-west", label: "US West (Oregon)" },
  { value: "eu-west", label: "EU West (Ireland)" },
  { value: "ap-south", label: "Asia Pacific (Singapore)" },
];

function SelectDemo({ v }: { v: ControlValues }) {
  const [region, setRegion] = React.useState("us-east");
  return (
    <div className="w-64 max-w-full">
      <Select
        value={region}
        onValueChange={setRegion}
        options={REGIONS}
        placeholder="Choose a region…"
        size={v.size as "sm" | "md" | "lg"}
        disabled={v.disabled as boolean}
      />
    </div>
  );
}

export const selectEntry: ComponentEntry = {
  slug: "select",
  name: "Select",
  tagline:
    "A styled single-value picker built on DropdownMenu. The trigger reads like an Input; the content lists options with a check on the active one, and keyboard/outside-click come for free.",
  controls: [
    {
      type: "select",
      key: "size",
      label: "Size",
      default: "md",
      options: [
        { value: "sm", label: "sm" },
        { value: "md", label: "md" },
        { value: "lg", label: "lg" },
      ],
    },
    { type: "toggle", key: "disabled", label: "Disabled", default: false },
  ],
  render: (v) => <SelectDemo v={v} />,
  code: (v) => {
    const attrs = [v.size !== "md" ? `\n  size="${v.size}"` : "", v.disabled ? "\n  disabled" : ""].join("");
    return `<Select
  value={region}
  onValueChange={setRegion}
  options={regions}
  placeholder="Choose a region…"${attrs}
/>`;
  },
  importPath: `import { Select } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "value", type: "string", description: "The selected option's value (controlled)." },
    { name: "onValueChange", type: "(value: string) => void", description: "Called when an option is chosen." },
    { name: "options", type: "{ value: string; label: string }[]", description: "The choices to render." },
    { name: "placeholder", type: "string", description: "Shown when nothing is selected." },
    { name: "size", type: `"sm" | "md" | "lg"`, description: "Trigger height/type scale (default md)." },
    { name: "disabled", type: "boolean", description: "Dims and blocks the trigger." },
  ],
};
