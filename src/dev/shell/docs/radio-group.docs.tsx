import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/index";
import { accentVars, type ComponentEntry } from "./entry";

function RadioGroupDemo() {
  const [plan, setPlan] = React.useState("pro");
  return (
    <RadioGroup value={plan} onValueChange={setPlan} className="w-64 max-w-full">
      <RadioGroupItem value="free">Free</RadioGroupItem>
      <RadioGroupItem value="pro">Pro</RadioGroupItem>
      <RadioGroupItem value="team">Team</RadioGroupItem>
    </RadioGroup>
  );
}

export const radioGroupEntry: ComponentEntry = {
  slug: "radio-group",
  name: "Radio Group",
  tagline:
    'A single-choice set with the house radio dot. role="radiogroup" with roving arrow-key focus — Tab enters once, arrows move within, and the selected dot fills with the accent.',
  controls: [{ type: "color", key: "accent", label: "Accent", default: "#8b5cf6" }],
  render: (v) => (
    // scope the accent override to the demo — drives the selected dot fill
    <div style={accentVars(v.accent as string)}>
      <RadioGroupDemo />
    </div>
  ),
  code: () => `<RadioGroup value={plan} onValueChange={setPlan}>
  <RadioGroupItem value="free">Free</RadioGroupItem>
  <RadioGroupItem value="pro">Pro</RadioGroupItem>
  <RadioGroupItem value="team">Team</RadioGroupItem>
</RadioGroup>`,
  importPath: `import { RadioGroup, RadioGroupItem } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "value", type: "string", description: "The selected item's value (controlled)." },
    { name: "defaultValue", type: "string", description: "Initial selection when uncontrolled." },
    { name: "onValueChange", type: "(value: string) => void", description: "Called when a choice is made — by click or arrow keys." },
    { name: "disabled", type: "boolean", description: "Disables the whole group." },
    { name: "value (item)", type: "string", description: "Identifies each RadioGroupItem." },
  ],
};
