import { Spinner } from "@/index";
import type { ComponentEntry } from "./entry";

export const spinnerEntry: ComponentEntry = {
  slug: "spinner",
  name: "Spinner",
  tagline:
    "A standalone loading indicator — the same spinning arc the Button uses. Inherits currentColor, and the spin stops under prefers-reduced-motion.",
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
  ],
  render: (v) => (
    <div className="inline-flex items-center gap-2.5 text-fg/70">
      <Spinner size={v.size as "md"} />
      <span className="text-sm">Loading…</span>
    </div>
  ),
  code: (v) => `<Spinner size="${v.size}" />`,
  importPath: `import { Spinner } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "size", type: `"sm" | "md" | "lg"`, description: "Diameter of the arc (default md)." },
    { name: "label", type: "string", description: `Screen-reader label (default "Loading").` },
    { name: "className", type: "string", description: "Sets the color via currentColor — e.g. text-fg/50." },
  ],
};
