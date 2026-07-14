import { AvatarGroup } from "@/index";
import type { ComponentEntry } from "./entry";

const TEAM = [
  { name: "Mikey Django" },
  { name: "Grace Hopper" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson" },
  { name: "Linus Torvalds" },
  { name: "Margaret Hamilton" },
];

export const avatarGroupEntry: ComponentEntry = {
  slug: "avatar-group",
  name: "Avatar Group",
  tagline:
    "Overlapping avatars with a +N overflow chip. The first `max` show as a ringed stack; the rest collapse into a chip styled to match. Pass an avatars array or Avatar children.",
  controls: [
    { type: "slider", key: "max", label: "Max", min: 1, max: 6, step: 1, default: 4 },
    {
      type: "select",
      key: "size",
      label: "Size",
      default: "md",
      options: [
        { value: "xs", label: "xs" },
        { value: "sm", label: "sm" },
        { value: "md", label: "md" },
        { value: "lg", label: "lg" },
      ],
    },
  ],
  render: (v) => (
    <AvatarGroup max={v.max as number} size={v.size as "xs" | "sm" | "md" | "lg"} avatars={TEAM} />
  ),
  code: (v) => {
    const size = v.size !== "md" ? ` size="${v.size}"` : "";
    return `<AvatarGroup max={${v.max}}${size} avatars={team} />`;
  },
  importPath: `import { AvatarGroup } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "max", type: "number", description: "How many avatars to show before the +K chip (default 4)." },
    { name: "size", type: `"xs" | "sm" | "md" | "lg"`, description: "Passed to each Avatar and the +K chip (default md)." },
    { name: "avatars", type: "{ src?: string; name: string }[]", description: "Data-driven alternative to Avatar children; name yields initials." },
    { name: "children", type: "React.ReactNode", description: "Avatar elements, if not using avatars." },
  ],
};
