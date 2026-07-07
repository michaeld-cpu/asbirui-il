import React from "react";
import ReactDOM from "react-dom/client";
import "@/styles/tokens.css";
import { ThemeProvider } from "./shell/theme-context";
import { SidebarProvider } from "./shell/sidebar-context";
import { Navbar } from "./shell/Navbar";
import { DocsSidebar } from "./shell/DocsSidebar";
import { DocsContent } from "./shell/DocsContent";
import { DocsAside } from "./shell/DocsAside";
import { Home } from "./shell/Home";
import { AiTemplate } from "./templates/ai/AiTemplate";
import {
  useHashRoute,
  isDocsRoute,
  isAiRoute,
  aiSubPath,
  isPreviewRoute,
} from "./shell/use-hash-route";

/** Landing view: marketing navbar only, no sidebar. */
function LandingView() {
  return (
    <div className="min-h-screen bg-canvas font-sans antialiased">
      <Navbar active="home" />
      <main className="pt-16 md:pt-0">
        <Home />
      </main>
    </div>
  );
}

/**
 * Bare preview: the AI console with no shell chrome, filling the viewport.
 * Loaded inside the homepage device-frame <iframe>s so each gets its own
 * viewport width and the template's real responsive breakpoints fire.
 */
function PreviewView() {
  return <AiTemplate sub="" />;
}

/** Docs view: full-width navbar + grouped sidebar, content column, right aside. */
function DocsView({ route }: { route: string }) {
  return (
    <div className="min-h-screen bg-canvas font-sans antialiased">
      <Navbar active={route} wide />
      <div className="flex pt-16 md:pt-0">
        <DocsSidebar active={route} />
        <main className="min-w-0 flex-1 px-6 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <DocsContent route={route} />
          </div>
        </main>
        <DocsAside />
      </div>
    </div>
  );
}

function App() {
  const route = useHashRoute();
  const preview = isPreviewRoute(route);

  let view;
  if (preview) {
    view = <PreviewView />;
  } else if (isAiRoute(route)) {
    view = <AiTemplate sub={aiSubPath(route)} />;
  } else if (isDocsRoute(route)) {
    view = <DocsView route={route} />;
  } else {
    view = <LandingView />;
  }

  // In a preview iframe, the parent shell pins the theme via "?t=light|dark"
  // so the frame always matches the page it's embedded in.
  const forcedTheme = preview ? previewThemeParam() : undefined;

  return (
    <ThemeProvider forcedTheme={forcedTheme}>
      <SidebarProvider>{view}</SidebarProvider>
    </ThemeProvider>
  );
}

/** Reads the "t" query param ("light"|"dark") set on preview iframe URLs. */
function previewThemeParam(): "light" | "dark" | undefined {
  const t = new URLSearchParams(window.location.search).get("t");
  return t === "light" || t === "dark" ? t : undefined;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
