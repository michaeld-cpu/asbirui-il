import { UsageMeter } from "@/index";
import { hexToRgbTriplet, type ComponentEntry } from "./entry";

export const usageMeterEntry: ComponentEntry = {
  slug: "usage-meter",
  name: "Usage Meter",
  tagline:
    "A labeled quota bar with a value / max readout. The accent fill turns amber past ~75% and red past ~90%, so a near-limit quota reads at a glance.",
  controls: [
    { type: "slider", key: "value", label: "Value", min: 0, max: 2000, step: 20, default: 1284 },
    { type: "color", key: "accent", label: "Accent", default: "#8b5cf6" },
  ],
  render: (v) => (
    // scope the accent override to the demo — drives the fill below 75%
    <div className="w-72 max-w-full" style={{ ["--accent" as string]: hexToRgbTriplet(v.accent as string) }}>
      <UsageMeter label="Renders" value={v.value as number} max={2000} unit="renders" />
    </div>
  ),
  code: (v) => `<UsageMeter label="Renders" value={${v.value}} max={2000} unit="renders" />`,
  importPath: `import { UsageMeter } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "value", type: "number", description: "Current amount used." },
    { name: "max", type: "number", description: "The quota ceiling; the fill ratio is value / max." },
    { name: "label", type: "React.ReactNode", description: "Left-side label in the readout row." },
    { name: "unit", type: "string", description: "Appended after the value / max numbers (e.g. renders, GB)." },
    { name: "format", type: "(n: number) => string", description: "Format the readout numbers (default toLocaleString)." },
    { name: "hideReadout", type: "boolean", description: "Hide the numeric readout row, showing just the bar." },
  ],
};
