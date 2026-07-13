import * as React from "react";

/**
 * Minimal hash router for the dev shell. Returns the current hash (without the
 * leading '#', defaulting to "home") and stays in sync with back/forward nav.
 */
export function useHashRoute(): string {
  const read = () =>
    (typeof window !== "undefined"
      ? window.location.hash.replace(/^#/, "")
      : "") || "home";

  const [route, setRoute] = React.useState(read);

  React.useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

/** Routes that render inside the sidebar+topbar app shell. */
export const DOCS_ROUTES = new Set([
  "components",
  "blocks",
  "docs",
  "tokens",
  "templates",
  "test-cases",
  "brand-kits",
  "motion",
]);

export function isDocsRoute(route: string): boolean {
  // exact top-level docs routes, plus sub-routes under a docs section
  // (e.g. "components/dropdown-menu", "blocks/stats", "tokens/colors") —
  // all render in the shell
  return (
    DOCS_ROUTES.has(route) ||
    route.startsWith("components/") ||
    route.startsWith("blocks/") ||
    route.startsWith("tokens/") ||
    route.startsWith("brand-kits/") ||
    route.startsWith("motion/")
  );
}

/** The docs section the sidebar/navbar highlights — a sub-route still lives
    under its parent section ("components/…" → "components", "tokens/…" →
    "tokens"). */
export function docsRouteBase(route: string): string {
  return route.replace(/\/.*$/, "");
}

export function blocksSubPath(route: string): string {
  return route.startsWith("blocks/") ? route.replace(/^blocks\//, "") : "";
}

export function motionSubPath(route: string): string {
  return route.startsWith("motion/") ? route.replace(/^motion\//, "") : "";
}

export function componentsSubPath(route: string): string {
  return route.startsWith("components/")
    ? route.replace(/^components\//, "")
    : "";
}

export function tokensSubPath(route: string): string {
  return route.startsWith("tokens/") ? route.replace(/^tokens\//, "") : "";
}

export function brandKitsSubPath(route: string): string {
  return route.startsWith("brand-kits/") ? route.replace(/^brand-kits\//, "") : "";
}

export function isPreviewRoute(route: string): boolean {
  return route === "preview" || route.startsWith("preview/");
}

/** The AI console template owns everything under "ai" / "ai/…". */
export function isAiRoute(route: string): boolean {
  return route === "ai" || route.startsWith("ai/");
}

/** Sub-path within the AI console (e.g. "", "playground", "prompts/new"). */
export function aiSubPath(route: string): string {
  return route === "ai" ? "" : route.replace(/^ai\//, "");
}
