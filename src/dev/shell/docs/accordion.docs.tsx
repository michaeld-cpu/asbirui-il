import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/index";
import type { ComponentEntry } from "./entry";
import type { ControlValues } from "../component-playground";

const ITEMS = [
  { value: "included", q: "What's included?", a: "Every core component, the token system, and free updates for the life of the plan." },
  { value: "cancel", q: "Can I cancel?", a: "Any time from billing settings — you keep access until the period ends." },
  { value: "refunds", q: "Do you offer refunds?", a: "Full refund within 14 days, no questions asked." },
];

function AccordionDemo({ v }: { v: ControlValues }) {
  const type = v.type as "single" | "multiple";
  const body = ITEMS.map((it) => (
    <AccordionItem key={it.value} value={it.value}>
      <AccordionTrigger>{it.q}</AccordionTrigger>
      <AccordionContent>{it.a}</AccordionContent>
    </AccordionItem>
  ));
  return (
    <div className="w-72 max-w-full text-left">
      {type === "single" ? (
        <Accordion type="single" collapsible defaultValue="included">
          {body}
        </Accordion>
      ) : (
        <Accordion type="multiple" defaultValue={["included"]}>
          {body}
        </Accordion>
      )}
    </div>
  );
}

export const accordionEntry: ComponentEntry = {
  slug: "accordion",
  name: "Accordion",
  tagline:
    "Collapsible sections, single- or multiple-open. Content eases with the grid-rows 0fr→1fr trick — no measuring JS — with real button + aria-expanded/aria-controls wiring.",
  controls: [
    {
      type: "select",
      key: "type",
      label: "Type",
      default: "single",
      options: [
        { value: "single", label: "single" },
        { value: "multiple", label: "multiple" },
      ],
    },
  ],
  render: (v) => <AccordionDemo v={v} />,
  code: (v) => {
    const open = v.type === "single" ? ` collapsible defaultValue="included"` : ` defaultValue={["included"]}`;
    return `<Accordion type="${v.type}"${open}>
  <AccordionItem value="included">
    <AccordionTrigger>What's included?</AccordionTrigger>
    <AccordionContent>Every core component…</AccordionContent>
  </AccordionItem>
  <AccordionItem value="cancel">
    <AccordionTrigger>Can I cancel?</AccordionTrigger>
    <AccordionContent>Any time from billing settings…</AccordionContent>
  </AccordionItem>
</Accordion>`;
  },
  importPath: `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@asbirtech/asbir-ui";`,
  props: [
    { name: "type", type: `"single" | "multiple"`, description: "One open section at a time, or many." },
    { name: "collapsible", type: "boolean", description: "single only — lets the open item close itself." },
    { name: "value / defaultValue", type: "string | string[]", description: "Open item(s), controlled or initial (shape follows type)." },
    { name: "onValueChange", type: "(v: string | string[]) => void", description: "Called when the open set changes." },
    { name: "value (item)", type: "string", description: "Identifies each AccordionItem." },
  ],
};
