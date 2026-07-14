import { Progress } from "@/index";
import { accentVars, type ComponentEntry } from "./entry";

export const progressEntry: ComponentEntry = {
  slug: "progress",
  name: "Progress",
  tagline:
    "A linear determinate or indeterminate bar. The accent fill eases on width change; indeterminate mode breathes a partial bar and degrades under reduced motion.",
  controls: [
    { type: "slider", key: "value", label: "Value", min: 0, max: 100, step: 1, default: 64 },
    { type: "toggle", key: "indeterminate", label: "Indeterminate", default: false },
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
    { type: "color", key: "accent", label: "Accent", default: "#8b5cf6" },
  ],
  render: (v) => (
    // scope the accent override to the demo — drives the fill color
    <div className="w-64 max-w-full" style={accentVars(v.accent as string)}>
      <Progress value={v.value as number} indeterminate={v.indeterminate as boolean} size={v.size as "sm" | "md"} />
    </div>
  ),
  code: (v) => {
    const size = v.size !== "md" ? ` size="${v.size}"` : "";
    if (v.indeterminate) return `<Progress indeterminate${size} aria-label="Loading" />`;
    return `<Progress value={${v.value}}${size} />`;
  },
  importPath: `import { Progress } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "value", type: "number", description: "0–100. Ignored when indeterminate." },
    { name: "indeterminate", type: "boolean", description: "Unknown-duration mode: a breathing partial bar." },
    { name: "size", type: `"sm" | "md"`, description: "Track thickness (default md)." },
  ],
};
