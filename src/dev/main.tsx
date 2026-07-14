import React from "react";
import ReactDOM from "react-dom/client";
import "@/styles/tokens.css";
import "@/motion/styles.css";
import { ThemeProvider } from "./shell/theme-context";
import { SidebarProvider } from "./shell/sidebar-context";
import { Navbar } from "./shell/Navbar";
import { DocsSidebar } from "./shell/DocsSidebar";
import { DocsContent } from "./shell/DocsContent";
import { DocsAside } from "./shell/DocsAside";
import { ComponentDocs } from "./shell/ComponentDocs";
import { BlocksDocs } from "./shell/BlocksDocs";
import { ColorsDocs } from "./shell/ColorsDocs";
import { MotionDocs } from "./shell/MotionDocs";
import { TemplatesPage } from "./shell/TemplatesPage";
import { Home } from "./shell/Home";
import { AiTemplate } from "./templates/ai/AiTemplate";
import { TripketPreview } from "./templates/tripket/TripketPreview";
import { landingRouteFor } from "./shell/docs-nav";
import {
  useHashRoute,
  isDocsRoute,
  isAiRoute,
  aiSubPath,
  isPreviewRoute,
  docsRouteBase,
  componentsSubPath,
  blocksSubPath,
  motionSubPath,
  tokensSubPath,
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
 * Bare preview: a template with no shell chrome, filling the viewport. Loaded
 * inside the templates/homepage device-frame <iframe>s so each gets its own
 * viewport width and the template's real responsive breakpoints fire.
 *
 *   preview / preview/ai  → Lumina AI console
 *   preview/tripket       → Tripket admin dashboard
 */
function PreviewView({ route }: { route: string }) {
  const sub = route.replace(/^preview\/?/, "");
  if (sub === "tripket") return <TripketPreview />;
  return <AiTemplate sub="" />;
}

/** Docs view: full-width navbar + grouped sidebar, content column, right aside.
    A sub-route swaps the prose body for a dedicated page: "components/<slug>"
    → that component's live docs, "tokens/colors" → the Colors reference;
    everything else renders the section's prose page. */
function DocsView({ route }: { route: string }) {
  const base = docsRouteBase(route);
  const componentSlug = componentsSubPath(route);
  const tokensSub = tokensSubPath(route);
  const isTemplates = route === "templates";
  const isComponents = base === "components";
  const isBlocks = base === "blocks";
  const isMotion = base === "motion";

  let body: React.ReactNode;
  // bare "#components" → gallery index (empty slug); "#components/<slug>" → detail
  if (isComponents) body = <ComponentDocs slug={componentSlug} />;
  else if (isBlocks) body = <BlocksDocs slug={blocksSubPath(route)} />;
  else if (tokensSub === "colors") body = <ColorsDocs />;
  else if (isTemplates) body = <TemplatesPage />;
  else if (isMotion) body = <MotionDocs slug={motionSubPath(route)} />;
  else body = <DocsContent route={route} />;

  return (
    <div className="min-h-screen bg-canvas font-sans antialiased">
      <Navbar active={base} wide />
      <div className="flex pt-16 md:pt-0">
        <DocsSidebar active={route} />
        {/* the components GALLERY index is wide; a component DETAIL page is not */}
        {(() => {
          const wide = isTemplates || isBlocks || isMotion || (isComponents && !componentSlug);
          return (
            <>
              <main className="min-w-0 flex-1 px-6 lg:px-10 xl:px-14">
                {/* wide pages (galleries, templates, blocks, motion, the
                    components index) get a roomy column so 3-col grids + live
                    previews breathe; prose/detail pages stay a comfortable
                    reading measure */}
                <div className={`mx-auto ${wide ? "max-w-[88rem]" : "max-w-4xl"}`}>{body}</div>
              </main>
              {/* wide, full-width pages get no right promo aside */}
              {!wide && <DocsAside />}
            </>
          );
        })()}
      </div>
    </div>
  );
}

/* Route-aware document chrome: the browser tab shows the app you're actually
   in. The Lumina AI console (#ai/…) gets its own title + violet diamond
   favicon; everywhere else falls back to AsbirUI. */
const FAVICONS = {
  // Real AsbirUI mark — the swooping "A" monogram (src/assets/logo), in white
  // so it reads on a dark browser tab. NOT the stacked-diamond glyph (that
  // shape belongs to Lumina below).
  asbir:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='24' viewBox='0 0 26 24' fill='%23FFFFFF'%3E%3Cpath d='M16.5205 8.94012L14.6933 5.28149C14.1219 6.42815 13.3659 7.92302 13.2099 8.2437L13.5647 8.93742H13.5673L13.5657 8.94012L19.0029 19.8685C15.2648 18.5809 10.3785 18.5804 6.63992 19.8668C6.87398 19.3972 7.10909 18.9253 7.34367 18.454C5.23767 18.8303 4.19547 19.2406 3.93927 19.3507C3.5418 20.1497 3.14485 20.9471 2.75 21.7418L2.80535 21.8098C2.81537 21.8222 4.57187 23.9892 4.58083 24C8.35371 21.0049 17.2854 21.0065 21.0588 24C21.0656 23.9914 22.8221 21.8179 22.8306 21.8076L22.8875 21.7374L16.5205 8.94012Z'/%3E%3Cpath d='M25.0622 17.1719C22.3489 11.7182 19.5534 6.09987 16.839 0.644592C16.1458 0.50153 13.7588 0.0620839 13.5759 0L6.27051 14.6669C7.04754 14.5141 8.13454 14.3306 9.46984 14.1832C9.98119 13.1558 14.6661 3.73853 15.0446 2.97625L21.3874 15.725C21.0574 15.6316 20.7231 15.5442 20.3858 15.4621L22.0964 18.9048C22.884 19.1817 23.6615 19.504 24.3995 19.8668C24.5319 19.6806 25.4359 18.4211 25.5403 18.2672L25.0622 17.1719Z'/%3E%3Cpath d='M15.8274 14.71C13.6466 14.5092 11.344 14.5313 9.17575 14.7731C7.88526 14.9297 6.97433 15.0825 5.95743 15.2941L5.95532 15.2984C5.37756 15.4248 4.80928 15.5662 4.2526 15.7244C5.37861 13.4629 6.50673 11.196 7.62589 8.9378C7.62906 8.93996 7.6338 8.92593 7.6338 8.92593C8.58638 7.02238 9.57111 5.03948 10.5453 3.07979L10.9633 3.79618L12.4468 0.83397L12.0546 0.0317383C11.6824 0.0949019 9.08507 0.592112 8.80832 0.634221C6.60953 5.05351 2.36537 13.5779 0.225624 17.8811L0 18.3346C0 18.3346 0.00737998 18.3492 0.0195047 18.3735L1.23303 19.8705C3.55095 18.8189 4.67749 18.3616 7.65014 17.8412L7.65173 17.8385C10.6866 17.2916 14.257 17.2522 17.3283 17.731L15.828 14.7116L15.8274 14.71Z'/%3E%3C/svg%3E",
  // Lumina mark = the sidebar iconmark: a rounded violet square with the white
  // two-layer diamond glyph centered (glyph scaled to ~62% and re-centered).
  lumina:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='6' fill='%238B5CF6'/%3E%3Cg transform='translate(12 12) scale(0.62) translate(-12 -12)'%3E%3Cpath d='M12 2 2 7l10 5 10-5-10-5Zm0 7L2 14l10 5 10-5-10-5Z' fill='%23fff'/%3E%3C/g%3E%3C/svg%3E",
};

function useDocumentChrome(route: string) {
  React.useEffect(() => {
    const lumina = isAiRoute(route);
    document.title = lumina ? "Lumina AI" : "AsbirUI";
    const link = document.getElementById("favicon") as HTMLLinkElement | null;
    if (link) link.href = lumina ? FAVICONS.lumina : FAVICONS.asbir;
  }, [route]);
}

function App() {
  const route = useHashRoute();
  const preview = isPreviewRoute(route);
  useDocumentChrome(route);

  // Categories no longer have an "Overview" landing — a bare category route
  // (e.g. "components") redirects to its first real item ("components/…").
  React.useEffect(() => {
    const target = landingRouteFor(route);
    if (target) window.location.replace(`#${target}`);
  }, [route]);

  let view;
  if (preview) {
    view = <PreviewView route={route} />;
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
