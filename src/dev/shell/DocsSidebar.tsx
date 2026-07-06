import { docsNav } from "./docs-nav";

/*
  Grouped docs sidebar (React-Bits-style): category headings with a stack of
  links under each. The active item is highlighted; `soon` items render dimmed
  and unclickable. `active` is the current route without the leading '#'.
*/
export function DocsSidebar({ active }: { active: string }) {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r border-border py-6 pl-6 pr-3 md:block lg:pl-8">
      <nav className="space-y-6">
        {docsNav.map((group) => (
          <div key={group.heading}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item, i) => {
                // first non-soon item of the matching route reads as active
                const routeMatch = item.href.replace(/^#/, "") === active;
                const isActive = routeMatch && !item.soon && i === 0;

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
