import { docsNav } from "./docs-nav";

/*
  Grouped docs sidebar (React-Bits-style): category headings with a stack of
  links under each. The active item is highlighted; `soon` items render dimmed
  and unclickable. `active` is the current route without the leading '#'.

  `always` groups (Get Started, Foundations) show on every page; section groups
  (Components, Templates, Test Cases) only show when you're inside that section.
  The owning group is matched by the route's base segment (e.g.
  "components/dropdown-menu" → the group with a "#components…" item). Order is
  preserved from docsNav.
*/
export function DocsSidebar({ active }: { active: string }) {
  const base = active.split("/")[0]; // "components/dropdown-menu" → "components"
  const owns = (group: (typeof docsNav)[number]) =>
    group.items.some((it) => it.href.replace(/^#/, "").split("/")[0] === base);
  const groups = docsNav.filter((g) => g.always || owns(g));

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r border-border py-6 pl-6 pr-3 md:block lg:pl-8">
      <nav className="space-y-6">
        {groups.map((group) => (
          <div key={group.heading}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item, i) => {
                // exact route match — sub-routes (e.g. components/dropdown-menu)
                // highlight their own link; the bare "#components" Overview is
                // active only on the base route
                const target = item.href.replace(/^#/, "");
                const isActive = !item.soon && target === active;

                if (item.soon) {
                  return (
                    <li key={item.label + i}>
                      <span className="block cursor-default rounded-md px-2.5 py-1.5 text-sm text-fg/30">
                        {item.label}
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={item.label + i}>
                    <a
                      href={item.href}
                      className={`block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "bg-overlay/[0.07] font-medium text-fg"
                          : "text-fg/70 hover:bg-overlay/[0.04] hover:text-fg"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
