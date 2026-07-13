import * as React from "react";
import { Checkbox } from "@/index";
import { accentVars, type ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function CheckboxDemo({ v }: { v: ControlValues }) {
  const [checked, setChecked] = React.useState(true);
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg/80">
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        indeterminate={v.indeterminate as boolean}
        disabled={v.disabled as boolean}
      />
      Email me deploy notifications
    </label>
  );
}

export const checkboxEntry: ComponentEntry = {
  slug: "checkbox",
  name: "Checkbox",
  tagline:
    "The house checkbox — a native input under a custom box, so the check is a smooth stroke glyph instead of the thick OS-native one. Keyboard, forms, and screen readers stay fully native.",
  controls: [
    { type: "toggle", key: "indeterminate", label: "Indeterminate", default: false },
    { type: "toggle", key: "disabled", label: "Disabled", default: false },
    { type: "color", key: "accent", label: "Accent", default: "#8b5cf6" },
  ],
  render: (v) => (
    // scope the accent override to the demo — drives the checked fill + glyph
    <div style={accentVars(v.accent as string)}>
      <CheckboxDemo v={v} />
    </div>
  ),
  code: (v) => {
    const flags = [
      v.indeterminate ? "\n  indeterminate" : "",
      v.disabled ? "\n  disabled" : "",
    ].join("");
    return `<label className="flex items-center gap-2.5">
  <Checkbox checked={checked} onCheckedChange={setChecked}${flags} />
  Email me deploy notifications
</label>`;
  },
  importPath: `import { Checkbox } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "checked", type: "boolean", description: "Controlled state; omit and use defaultChecked for uncontrolled." },
    { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Convenience handler; the native onChange fires too." },
    { name: "indeterminate", type: "boolean", description: "Shows a minus and sets the native flag — for tri-state select-alls." },
    { name: "disabled", type: "boolean", description: "Native disabled — dimmed and inert." },
    { name: "className", type: "string", description: "Sizes the box (default h-4 w-4)." },
  ],
};
