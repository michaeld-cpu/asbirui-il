import * as React from "react";
import { Slider } from "@/index";
import { accentVars, type ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function SliderDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = React.useState(60);
  return (
    <div className="w-64 max-w-full">
      <Slider
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
        step={v.step as number}
        showValue={v.showValue as boolean}
      />
    </div>
  );
}

export const sliderEntry: ComponentEntry = {
  slug: "slider",
  name: "Slider",
  tagline:
    'A single-value range control. A real <input type="range"> restyled — a gradient paints the accent fill up to the thumb, so it stays keyboard- and screen-reader-accessible for free.',
  controls: [
    { type: "toggle", key: "showValue", label: "Show value", default: true },
    { type: "slider", key: "step", label: "Step", min: 1, max: 25, step: 1, default: 1 },
    { type: "color", key: "accent", label: "Accent", default: "#8b5cf6" },
  ],
  render: (v) => (
    // scope the accent override to the demo — drives the filled portion
    <div style={accentVars(v.accent as string)}>
      <SliderDemo v={v} />
    </div>
  ),
  code: (v) => {
    const attrs = [v.step !== 1 ? ` step={${v.step}}` : "", v.showValue ? " showValue" : ""].join("");
    return `<Slider value={value} onValueChange={setValue} min={0} max={100}${attrs} />`;
  },
  importPath: `import { Slider } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "value", type: "number", description: "Current value (controlled)." },
    { name: "defaultValue", type: "number", description: "Initial value when uncontrolled." },
    { name: "onValueChange", type: "(value: number) => void", description: "Called as the thumb moves." },
    { name: "min / max / step", type: "number", description: "Range bounds and increment (defaults 0 / 100 / 1)." },
    { name: "showValue", type: "boolean", description: "Show the current value next to the track." },
    { name: "disabled", type: "boolean", description: "Dims and blocks the track." },
  ],
};
