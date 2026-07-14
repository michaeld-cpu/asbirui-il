import { Timeline, TimelineItem } from "@/index";
import type { ComponentEntry } from "./entry";

export const timelineEntry: ComponentEntry = {
  slug: "timeline",
  name: "Timeline",
  tagline:
    "A vertical list of events on a connector line. Each item shows a status dot (or custom icon) on a line that runs behind the dots; the last item's line stops so the track doesn't dangle.",
  controls: [],
  render: () => (
    <div className="w-72 max-w-full text-left">
      <Timeline>
        <TimelineItem status="success" title="Deployed to production" time="2m ago">
          Build #482 shipped from main.
        </TimelineItem>
        <TimelineItem status="accent" title="Review approved" time="1h ago" />
        <TimelineItem title="Pushed 3 commits" time="3h ago" />
        <TimelineItem title="Opened pull request" time="Yesterday" />
      </Timeline>
    </div>
  ),
  code: () => `<Timeline>
  <TimelineItem status="success" title="Deployed to production" time="2m ago">
    Build #482 shipped from main.
  </TimelineItem>
  <TimelineItem status="accent" title="Review approved" time="1h ago" />
  <TimelineItem title="Pushed 3 commits" time="3h ago" />
  <TimelineItem title="Opened pull request" time="Yesterday" />
</Timeline>`,
  importPath: `import { Timeline, TimelineItem } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "status", type: `"default" | "accent" | "success" | "warning" | "danger"`, description: "Colors the status dot (default gray)." },
    { name: "title", type: "React.ReactNode", description: "The event's headline." },
    { name: "time", type: "React.ReactNode", description: "Optional timestamp shown at the trailing edge." },
    { name: "icon", type: "React.ReactNode", description: "Optional icon that replaces the status dot." },
    { name: "children", type: "React.ReactNode", description: "Optional description below the title." },
  ],
};
