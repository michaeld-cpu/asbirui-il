import * as React from "react";
import { ThemeToggle } from "@/index";
import type { ComponentEntry } from "./entry";

/* Controlled here so the demo doesn't flip the docs site's own theme. */
function ThemeToggleDemo() {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle theme={theme} onThemeChange={setTheme} />
      <span className="font-mono text-xs text-fg/50">theme: {theme}</span>
    </div>
  );
}

export const themeToggleEntry: ComponentEntry = {
  slug: "theme-toggle",
  name: "Theme Toggle",
  tagline:
    "The navbar-style segmented pill — sun and moon, active theme highlighted. Uncontrolled, it owns the dark class on <html> and persists to localStorage; controlled, it just reports the flip.",
  controls: [],
  render: () => <ThemeToggleDemo />,
  code: () => `// uncontrolled — owns <html class="dark"> + localStorage
<ThemeToggle />

// controlled — you own the theme state
<ThemeToggle theme={theme} onThemeChange={setTheme} />`,
  importPath: `import { ThemeToggle } from "@asbirtech/asbir-ui";`,
  props: [
    { name: "theme", type: `"light" | "dark"`, description: "Controlled theme; omit to let the toggle manage <html> itself." },
    { name: "onThemeChange", type: "(theme) => void", description: "Fires with the next theme on every flip." },
    { name: "storageKey", type: "string", description: `localStorage key for uncontrolled mode (default "asbir-theme").` },
  ],
};
