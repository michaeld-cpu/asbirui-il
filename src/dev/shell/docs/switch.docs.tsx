import * as React from "react";
import { Switch } from "@/index";
import { accentVars, type ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function SwitchDemo({ v }: { v: ControlValues }) {
  const [checked, setChecked] = React.useState(true);
  return (
    <label className="flex items-center gap-3 text-sm text-fg">
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        size={v.size as "sm" | "md"}
        disabled={v.disabled as boolean}
      />
      Email notifications
    </label>
  );
}

export const switchEntry: ComponentEntry = {
  slug: "switch",
  name: "Switch",
  tagline:
    'An on/off toggle for a single boolean setting. A real role="switch" button — Space/Enter and screen readers work; the track fills with the accent when on.',
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
    { type: "toggle", key: "disabled", label: "Disabled", default: false },
    { type: "color", key: "accent", label: "Accent", default: "#8b5cf6" },
  ],
  render: (v) => (
    // scope the accent override to the demo — drives the on-state track fill
    <div style={accentVars(v.accent as string)}>
      <SwitchDemo v={v} />
    </div>
  ),
  code: (v) => {
    const attrs = [v.size !== "md" ? ` size="${v.size}"` : "", v.disabled ? " disabled" : ""].join("");
    return `<label className="flex items-center gap-3">
  <Switch checked={checked} onCheckedChange={setChecked}${attrs} />
  Email notifications
</label>`;
  },
  importPath: `import { Switch } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "checked", type: "boolean", description: "Controlled on/off state." },
    { name: "defaultChecked", type: "boolean", description: "Initial state when uncontrolled." },
    { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Fired with the next checked value on toggle." },
    { name: "size", type: `"sm" | "md"`, description: "Track/thumb size (default md)." },
    { name: "disabled", type: "boolean", description: "Dims the control and blocks toggling." },
  ],
};
