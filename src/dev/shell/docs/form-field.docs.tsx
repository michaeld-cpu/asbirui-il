import { FormField, Input } from "@/index";
import type { ComponentEntry } from "./entry";

export const formFieldEntry: ComponentEntry = {
  slug: "form-field",
  name: "Form Field",
  tagline:
    "Wraps a control with a label, description, and error, wiring up the id, aria-describedby, and aria-invalid for you. The single child is cloned with those attributes automatically.",
  controls: [
    { type: "toggle", key: "error", label: "Show error", default: false },
    { type: "toggle", key: "required", label: "Required", default: false },
  ],
  render: (v) => (
    <div className="w-64 max-w-full">
      <FormField
        label="Email"
        description="We'll never share it."
        required={v.required as boolean}
        error={v.error ? "Enter a valid email address." : undefined}
      >
        <Input type="email" placeholder="mikey@example.com" />
      </FormField>
    </div>
  ),
  code: (v) => {
    const attrs = [v.required ? "\n  required" : "", v.error ? `\n  error="Enter a valid email address."` : ""].join("");
    return `<FormField
  label="Email"
  description="We'll never share it."${attrs}
>
  <Input type="email" />
</FormField>`;
  },
  importPath: `import { FormField, Input } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "label", type: "React.ReactNode", description: "Field label, tied to the control via htmlFor/id." },
    { name: "description", type: "React.ReactNode", description: "Helper text; hidden while an error shows." },
    { name: "error", type: "React.ReactNode", description: "Error message; when present the control is marked invalid." },
    { name: "required", type: "boolean", description: "Adds a subtle asterisk to the label." },
    { name: "children", type: "ReactElement | (props) => ReactNode", description: "The control — cloned with id/aria, or a render function to wire it yourself." },
  ],
};
