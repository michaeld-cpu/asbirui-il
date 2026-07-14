import { DescriptionList } from "@/index";
import type { ComponentEntry } from "./entry";

export const descriptionListEntry: ComponentEntry = {
  slug: "description-list",
  name: "Description List",
  tagline:
    "A dl of label→value rows for detail panels. Rows stack on mobile; with columns they become a label/value grid on sm+. Terms read muted, details at full contrast.",
  controls: [
    { type: "toggle", key: "columns", label: "Columns", default: true },
    { type: "toggle", key: "divided", label: "Divided", default: true },
  ],
  render: (v) => (
    <div className="w-72 max-w-full">
      <DescriptionList
        columns={v.columns as boolean}
        divided={v.divided as boolean}
        items={[
          { term: "Plan", details: "Team" },
          { term: "Seats", details: "12 of 20" },
          { term: "Region", details: "us-east-1" },
          { term: "Renewal", details: "Aug 1" },
        ]}
      />
    </div>
  ),
  code: (v) => `<DescriptionList${v.columns ? " columns" : ""}${v.divided ? " divided" : ""}
  items={[
    { term: "Plan", details: "Team" },
    { term: "Seats", details: "12 of 20" },
    { term: "Region", details: "us-east-1" },
    { term: "Renewal", details: "Aug 1" },
  ]}
/>`,
  importPath: `import {
  DescriptionList,
  DescriptionRow,
  DescriptionTerm,
  DescriptionDetails,
} from "@asbirtech/asbir-ui";`,
  props: [
    { name: "items", type: "{ term: React.ReactNode; details: React.ReactNode }[]", description: "Convenience data path; renders a DescriptionRow per item." },
    { name: "columns", type: "boolean", description: "Two-column label/value grid on sm+ (rows stack on mobile)." },
    { name: "divided", type: "boolean", description: "Draws a hairline divider between rows." },
    { name: "children", type: "React.ReactNode", description: "Alternative to items — compose DescriptionRow / DescriptionTerm / DescriptionDetails." },
  ],
};
