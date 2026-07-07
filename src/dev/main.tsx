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
import { AdminTemplate } from "./templates/admin/AdminTemplate";
import { AiTemplate } from "./templates/ai/AiTemplate";
import {
  useHashRoute,
  isDocsRoute,
  isAdminRoute,
  adminSubPath,
  isAiRoute,
  aiSubPath,
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

  let view;
  if (isAiRoute(route)) {
    view = <AiTemplate sub={aiSubPath(route)} />;
  } else if (isAdminRoute(route)) {
    view = <AdminTemplate sub={adminSubPath(route)} />;
  } else if (isDocsRoute(route)) {
    view = <DocsView route={route} />;
  } else {
    view = <LandingView />;
  }

  return (
    <ThemeProvider>
      <SidebarProvider>{view}</SidebarProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
