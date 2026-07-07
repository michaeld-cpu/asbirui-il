import "./ai-theme.css";
import { AiLayout } from "./AiLayout";
import { OverviewPage } from "./OverviewPage";
import { PlaygroundPage } from "./PlaygroundPage";
import { KeysPage } from "./KeysPage";
import { PromptsPage } from "./PromptsPage";
import { PromptFormPage } from "./PromptFormPage";
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
    prompts            Prompt library  prompts/new       New prompt
    prompts/:id        Edit prompt     keys              API keys
    logs               Request logs    billing           Usage & Billing
    team               Team            settings[/:tab]   Settings
    (else)             404
*/
export function AiTemplate({ sub }: { sub: string }) {
  const parts = sub.split("/").filter(Boolean);
  let page: React.ReactNode;
  let notFound = false;

  if (sub === "") page = <OverviewPage />;
  else if (sub === "playground") page = <PlaygroundPage />;
  else if (parts[0] === "prompts") {
    if (parts.length === 1) page = <PromptsPage />;
    else if (parts[1] === "new") page = <PromptFormPage />;
    else if (parts.length === 2) page = <PromptFormPage id={parts[1]} />;
    else notFound = true;
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
