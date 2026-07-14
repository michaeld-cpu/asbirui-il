import * as React from "react";
import { cn } from "../../lib/cn";

/*
  Breadcrumbs — a navigational path trail.

    <Breadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: "AsbirUI" },
      ]}
    />

  Or with children for full control:

    <Breadcrumbs>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
      <BreadcrumbItem current>AsbirUI</BreadcrumbItem>
    </Breadcrumbs>

  Renders <nav aria-label="Breadcrumb"> > <ol>, with a chevron separator drawn
  between items. The last item is the current page (aria-current="page", not a
  link). When there are more than `maxItems`, the middle collapses to an "…"
  that keeps the first crumb and the trailing `itemsAfterCollapse`.
*/

export interface BreadcrumbEntry {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Data-driven items; the last one is treated as the current page. */
  items?: BreadcrumbEntry[];
  /** Or supply <BreadcrumbItem> children instead of `items`. */
  children?: React.ReactNode;
  /** Collapse the middle once the trail exceeds this many crumbs (default 4). */
  maxItems?: number;
  /** How many trailing crumbs to keep visible when collapsed (default 1). */
  itemsAfterCollapse?: number;
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0 text-fg/35"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function Breadcrumbs({
  items,
  children,
  maxItems = 4,
  itemsAfterCollapse = 1,
  className,
  ...props
}: BreadcrumbsProps) {
  // Normalise both APIs to a flat list of rendered crumbs.
  let crumbs: React.ReactNode[];

  if (items && items.length > 0) {
    const rendered = items.map((it, i) => (
      <BreadcrumbItem key={i} href={it.href} current={i === items.length - 1}>
        {it.label}
      </BreadcrumbItem>
    ));
    crumbs = collapse(rendered, maxItems, itemsAfterCollapse);
  } else {
    crumbs = collapse(React.Children.toArray(children), maxItems, itemsAfterCollapse);
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)} {...props}>
      <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <li key={i} className="inline-flex min-w-0 items-center gap-1.5">
            {i > 0 && <Chevron />}
            {crumb}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Collapse the middle of a crumb list into a single "…" ellipsis when it runs
    longer than `maxItems`, always keeping the first crumb and the last
    `itemsAfterCollapse`. */
function collapse(crumbs: React.ReactNode[], maxItems: number, itemsAfterCollapse: number): React.ReactNode[] {
  if (crumbs.length <= maxItems || crumbs.length <= itemsAfterCollapse + 1) return crumbs;
  const head = crumbs.slice(0, 1);
  const tail = crumbs.slice(crumbs.length - itemsAfterCollapse);
  const ellipsis = (
    <span key="ellipsis" aria-hidden="true" className="select-none px-1 text-fg/45">
      …
    </span>
  );
  return [...head, ellipsis, ...tail];
}

export interface BreadcrumbItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Link target. Omit for a plain-text crumb. */
  href?: string;
  /** The current page — renders as text with aria-current="page". */
  current?: boolean;
  children: React.ReactNode;
}

export function BreadcrumbItem({ href, current, className, children, ...props }: BreadcrumbItemProps) {
  if (current || !href) {
    return (
      <span
        aria-current={current ? "page" : undefined}
        className={cn("truncate", current ? "font-medium text-fg" : "text-fg/60", className)}
      >
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      className={cn(
        "truncate rounded-sm text-fg/60 outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
