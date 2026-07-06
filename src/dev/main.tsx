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
import { useHashRoute, isDocsRoute } from "./shell/use-hash-route";

/** Landing view: marketing navbar only, no sidebar. */
function LandingView() {
  return (
    <div className="min-h-screen bg-canvas font-sans antialiased">
      <Navbar active="home" />
      <main>
        <Home />
      </main>
    </div>
  );
}

/** Docs view: full-width navbar + grouped sidebar, content column, right aside. */
function DocsView({ route }: { route: string }) {
  return (
    <div className="min-h-screen bg-canvas font-sans antialiased">
      <Navbar active={route} wide />
      <div className="flex">
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

  return (
    <ThemeProvider>
      <SidebarProvider>
        {isDocsRoute(route) ? <DocsView route={route} /> : <LandingView />}
      </SidebarProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
