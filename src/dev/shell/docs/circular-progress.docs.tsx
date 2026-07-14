import { CircularProgress } from "@/index";
import { accentVars, type ComponentEntry } from "./entry";

export const circularProgressEntry: ComponentEntry = {
  slug: "circular-progress",
  name: "Circular Progress",
  tagline:
    "An SVG ring that reflects value. A faint track under an accent arc drawn via strokeDasharray, rotated so it fills clockwise from the top; the offset eases on change.",
  controls: [
    { type: "slider", key: "value", label: "Value", min: 0, max: 100, step: 1, default: 72 },
    { type: "toggle", key: "showLabel", label: "Show label", default: true },
    { type: "color", key: "accent", label: "Accent", default: "#8b5cf6" },
  ],
  render: (v) => (
    // scope the accent override to the demo — drives the arc color
    <div style={accentVars(v.accent as string)}>
      <CircularProgress value={v.value as number} showLabel={v.showLabel as boolean} />
    </div>
  ),
  code: (v) => `<CircularProgress value={${v.value}}${v.showLabel ? " showLabel" : ""} />`,
  importPath: `import { CircularProgress } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "value", type: "number", description: "Percentage 0–100." },
    { name: "size", type: "number", description: "Diameter in px (default 96)." },
    { name: "strokeWidth", type: "number", description: "Ring thickness in px (default 8)." },
    { name: "showLabel", type: "boolean", description: "Render the percentage in the center." },
  ],
};
