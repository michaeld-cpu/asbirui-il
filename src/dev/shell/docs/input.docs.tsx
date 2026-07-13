import { Input } from "@/index";
import { hexToHslTriplet, type ComponentEntry } from "./entry";

const SearchIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const inputEntry: ComponentEntry = {
  slug: "input",
  name: "Input",
  tagline:
    "Single-line text field with slots for leading/trailing adornments. The wrapper carries the border and focus ring, so icons sit inside the field.",
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
    { type: "toggle", key: "prefix", label: "Search icon", default: true },
    { type: "toggle", key: "invalid", label: "Invalid", default: false },
    { type: "toggle", key: "disabled", label: "Disabled", default: false },
    { type: "color", key: "ring", label: "Focus ring", default: "#f97316" },
  ],
  render: (v) => (
    // scope the ring override to the demo — shows when the field is focused
    // (the invalid state keeps its red ring on purpose)
    <div style={{ ["--as-ring" as string]: hexToHslTriplet(v.ring as string) }}>
      <Input
        size={v.size as "md"}
        prefix={v.prefix ? SearchIcon : undefined}
        invalid={v.invalid as boolean}
        disabled={v.disabled as boolean}
        placeholder="Search components…"
        wrapperClassName="w-64 max-w-full"
      />
    </div>
  ),
  code: (v) => {
    const lines = [
      `  size="${v.size}"`,
      v.prefix ? "  prefix={<SearchIcon />}" : "",
      v.invalid ? "  invalid" : "",
      v.disabled ? "  disabled" : "",
      `  placeholder="Search components…"`,
    ].filter(Boolean);
    return `<Input\n${lines.join("\n")}\n/>`;
  },
  importPath: `import { Input } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "size", type: `"sm" | "md" | "lg"`, description: "Field height and text size." },
    { name: "prefix", type: "ReactNode", description: "Renders inside the field, before the text — an icon or short label." },
    { name: "suffix", type: "ReactNode", description: "Renders inside the field, after the text — a kbd hint or unit." },
    { name: "invalid", type: "boolean", description: "Switches border/ring to the danger color and sets aria-invalid." },
    { name: "wrapperClassName", type: "string", description: "Class for the outer wrapper; className styles the <input> itself." },
  ],
};
