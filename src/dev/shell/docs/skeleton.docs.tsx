import { Skeleton, SkeletonText } from "@/index";
import type { ComponentEntry } from "./entry";

export const skeletonEntry: ComponentEntry = {
  slug: "skeleton",
  name: "Skeleton",
  tagline:
    "Loading placeholder shapes with a gentle opacity pulse — no shimmer sweep. Size them with utility classes; SkeletonText fakes a paragraph.",
  controls: [
    { type: "toggle", key: "avatar", label: "Avatar circle", default: true },
    { type: "slider", key: "lines", label: "Text lines", min: 1, max: 5, step: 1, default: 3 },
  ],
  render: (v) => (
    <div className="flex w-64 max-w-full items-start gap-3">
      {v.avatar && <Skeleton variant="circle" className="h-9 w-9 shrink-0" />}
      <SkeletonText lines={v.lines as number} className="flex-1 pt-0.5" />
    </div>
  ),
  code: (v) => {
    const avatar = v.avatar ? `<Skeleton variant="circle" className="h-9 w-9" />\n` : "";
    return `${avatar}<SkeletonText lines={${v.lines}} />`;
  },
  importPath: `import { Skeleton, SkeletonText } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "variant", type: `"block" | "circle"`, description: "Rounded rectangle (default) or a full circle for avatars." },
    { name: "className", type: "string", description: "Sets the shape's size — e.g. h-4 w-40." },
    { name: "lines", type: "number", description: "SkeletonText only — placeholder lines; the last is shortened like real prose." },
  ],
};
