import * as React from "react";
import { Textarea } from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

function TextareaDemo({ v }: { v: ControlValues }) {
  const [value, setValue] = React.useState("");
  return (
    <div className="w-72 max-w-full">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Share your feedback…"
        invalid={v.invalid as boolean}
        autoGrow={v.autoGrow as boolean}
        disabled={v.disabled as boolean}
      />
    </div>
  );
}

export const textareaEntry: ComponentEntry = {
  slug: "textarea",
  name: "Textarea",
  tagline:
    "A multiline field matching Input's chrome. The wrapper carries the border and focus-within ring; invalid switches it to the danger color, and autoGrow expands to fit content up to maxRows.",
  controls: [
    { type: "toggle", key: "invalid", label: "Invalid", default: false },
    { type: "toggle", key: "autoGrow", label: "Auto grow", default: false },
    { type: "toggle", key: "disabled", label: "Disabled", default: false },
  ],
  render: (v) => <TextareaDemo v={v} />,
  code: (v) => {
    const attrs = [v.invalid ? " invalid" : "", v.autoGrow ? " autoGrow" : "", v.disabled ? " disabled" : ""].join("");
    return `<Textarea placeholder="Share your feedback…"${attrs} />`;
  },
  importPath: `import { Textarea } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "invalid", type: "boolean", description: "Danger border/ring and sets aria-invalid." },
    { name: "autoGrow", type: "boolean", description: "Grow to fit content up to maxRows, then scroll." },
    { name: "maxRows", type: "number", description: "Cap for autoGrow, in text rows (default 8)." },
    { name: "disabled", type: "boolean", description: "Dims the field and blocks input." },
    { name: "wrapperClassName", type: "string", description: "Class for the outer wrapper; className styles the <textarea>." },
  ],
};
