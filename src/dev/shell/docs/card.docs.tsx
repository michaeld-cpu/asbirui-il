import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/index";
import type { ComponentEntry } from "./entry";

export const cardEntry: ComponentEntry = {
  slug: "card",
  name: "Card",
  tagline:
    "The panel surface, composed from slots — header, title, description, content, footer. Every part takes className, so any card in the products can be reproduced without wrapper divs.",
  controls: [
    { type: "toggle", key: "description", label: "Description", default: true },
    { type: "toggle", key: "footer", label: "Footer", default: true },
  ],
  render: (v) => (
    <Card className="w-72 max-w-full">
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        {v.description && <CardDescription>Renders used this billing cycle</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">
          1,284 <span className="text-sm font-normal text-fg/45">/ 2,000</span>
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-overlay/[0.08]">
          <div className="h-full w-[64%] rounded-full bg-accent" />
        </div>
      </CardContent>
      {v.footer && (
        <CardFooter>
          <Button variant="outline" size="sm">
            Manage plan
          </Button>
        </CardFooter>
      )}
    </Card>
  ),
  code: (v) => {
    const desc = v.description
      ? `\n    <CardDescription>Renders used this billing cycle</CardDescription>`
      : "";
    const footer = v.footer
      ? `\n  <CardFooter>\n    <Button variant="outline" size="sm">Manage plan</Button>\n  </CardFooter>`
      : "";
    return `<Card>
  <CardHeader>
    <CardTitle>Usage</CardTitle>${desc}
  </CardHeader>
  <CardContent>1,284 / 2,000</CardContent>${footer}
</Card>`;
  },
  importPath: `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@asbirtech/asbir-ui";`,
  props: [
    { name: "<Card>", type: "div", description: "Rounded, bordered panel surface (bg-panel)." },
    { name: "<CardHeader>", type: "div", description: "Stacked title/description block with the house padding." },
    { name: "<CardTitle>", type: "h3", description: "Small semibold heading." },
    { name: "<CardDescription>", type: "p", description: "Muted supporting line under the title." },
    { name: "<CardContent>", type: "div", description: "The body slot." },
    { name: "<CardFooter>", type: "div", description: "Actions row separated by a top hairline." },
  ],
};
