import "./ai-theme.css";
import { AiLayout } from "./AiLayout";
import { OverviewPage } from "./OverviewPage";
import { PlaygroundPage } from "./PlaygroundPage";
import { KeysPage } from "./KeysPage";
import { LogsPage } from "./LogsPage";
import { BillingPage } from "./BillingPage";
import { TeamPage } from "./TeamPage";
import { SettingsPage } from "./SettingsPage";
import { NotFoundPage } from "./NotFoundPage";
import { ToastProvider } from "./ai-states";

/*
  AI console router. `sub` is everything after "#ai/". The whole console is
  wrapped in `.ai-console` (violet theme) + ToastProvider. Swap this switch for
  a real router when adopting; pages + layout are router-agnostic.

  Routes:
    ""                 Overview        playground        Playground
    keys               API keys        logs              Request logs
    billing            Usage & Billing team              Team
    settings[/:tab]    Settings        (else)            404

  Note: the Playground owns conversation history — the session's Runs are nested
  under Playground in the sidebar (ChatGPT-style). Any legacy "#ai/prompts…"
  link redirects to the Playground; there's no prompt-library surface.
*/
export function AiTemplate({ sub }: { sub: string }) {
  const parts = sub.split("/").filter(Boolean);
  let page: React.ReactNode;
  let notFound = false;

  if (sub === "") page = <OverviewPage />;
  else if (sub === "playground") page = <PlaygroundPage />;
  else if (parts[0] === "prompts") {
    // prompts were removed — redirect any lingering link to the Playground
    if (typeof window !== "undefined") window.location.replace("#ai/playground");
    page = <PlaygroundPage />;
  } else if (sub === "keys") page = <KeysPage />;
  else if (sub === "logs") page = <LogsPage />;
  else if (sub === "billing") page = <BillingPage />;
  else if (sub === "team") page = <TeamPage />;
  else if (parts[0] === "settings") page = <SettingsPage tab={parts[1] ?? ""} />;
  else notFound = true;

  return (
    <div className="ai-console">
      <ToastProvider>
        {notFound ? <NotFoundPage /> : <AiLayout sub={sub}>{page}</AiLayout>}
      </ToastProvider>
    </div>
  );
}
