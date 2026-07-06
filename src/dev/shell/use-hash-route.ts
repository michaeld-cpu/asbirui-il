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
export const DOCS_ROUTES = new Set(["components", "docs", "tokens"]);

export function isDocsRoute(route: string): boolean {
  return DOCS_ROUTES.has(route);
}
