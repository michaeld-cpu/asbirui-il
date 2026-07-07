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
  "docs",
  "tokens",
  "templates",
  "test-cases",
]);

export function isDocsRoute(route: string): boolean {
  return DOCS_ROUTES.has(route);
}

/** The admin template owns everything under "admin" / "admin/…". */
export function isAdminRoute(route: string): boolean {
  return route === "admin" || route.startsWith("admin/");
}

/** Sub-path within the admin template (e.g. "", "projects", "projects/new"). */
export function adminSubPath(route: string): string {
  return route === "admin" ? "" : route.replace(/^admin\//, "");
}

/** The AI console template owns everything under "ai" / "ai/…". */
export function isAiRoute(route: string): boolean {
  return route === "ai" || route.startsWith("ai/");
}

/** Sub-path within the AI console (e.g. "", "playground", "prompts/new"). */
export function aiSubPath(route: string): string {
  return route === "ai" ? "" : route.replace(/^ai\//, "");
}
