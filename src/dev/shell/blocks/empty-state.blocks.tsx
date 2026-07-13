import { Button, EmptyState } from "@/index";
import type { BlockEntry } from "./entry";

const InboxIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5Z" />
  </svg>
);
const CheckIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ---- 01 · call to action --------------------------------------------------- */

function CallToAction() {
  return (
    <EmptyState
      className="mx-auto w-full max-w-md"
      icon={InboxIcon}
      title="No projects yet"
      description="Create your first project to start routing requests and tracking usage"
      action={<Button size="sm">New project</Button>}
    />
  );
}

/* ---- 02 · onboarding steps --------------------------------------------------- */

const STEPS = [
  { title: "Create a project", detail: "Name it and pick a region", done: true },
  { title: "Add an API key", detail: "Scope it to the environments you need", done: false },
  { title: "Send your first request", detail: "Use the quickstart snippet", done: false },
];

function OnboardingSteps() {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-dashed border-border px-6 py-8">
      <h2 className="text-sm font-semibold text-fg">Finish setting up</h2>
      <p className="mt-1 text-xs leading-relaxed text-fg/55">
        Your workspace is empty until the first request lands
      </p>
      <ol className="mt-5 space-y-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                s.done
                  ? "bg-accent text-accent-fg"
                  : "border border-border text-fg/50"
              }`}
            >
              {s.done ? CheckIcon : i + 1}
            </span>
            <span>
              <span className={`block text-sm font-medium ${s.done ? "text-fg/45 line-through" : "text-fg"}`}>
                {s.title}
              </span>
              <span className="block text-xs text-fg/50">{s.detail}</span>
            </span>
          </li>
        ))}
      </ol>
      <Button size="sm" variant="secondary" className="mt-5">
        Continue setup
      </Button>
    </div>
  );
}

/* ---- 03 · error retry -------------------------------------------------------------- */

const AlertIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01" />
  </svg>
);

function ErrorRetry() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center rounded-xl border border-border bg-panel px-6 py-12 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/15 text-red-500 [&_svg]:h-5 [&_svg]:w-5">
        {AlertIcon}
      </span>
      <h2 className="mt-4 text-sm font-semibold text-fg">Couldn't load deployments</h2>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-fg/55">
        The request timed out — your data is safe, this one's on us
      </p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="secondary">
          Contact support
        </Button>
        <Button size="sm">Retry</Button>
      </div>
    </div>
  );
}

/* ---- 04 · no search results ---------------------------------------------------------- */

const SearchIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3-3" />
  </svg>
);

function NoResults() {
  return (
    <EmptyState
      className="mx-auto w-full max-w-md"
      icon={SearchIcon}
      title={<>No results for &ldquo;webhok&rdquo;</>}
      description="Check the spelling or try a broader term — search covers names, tags, and ids"
      action={
        <Button size="sm" variant="ghost">
          Clear search
        </Button>
      }
    />
  );
}

/* ---- registry ------------------------------------------------------------------ */

export const emptyStateBlock: BlockEntry = {
  slug: "empty-state",
  name: "Empty state",
  tagline: "The nothing-here-yet moment — a single call to action, or an onboarding checklist that walks users in.",
  variants: [
    {
      id: "empty-state-01",
      title: "Call to action",
      description: "The library EmptyState component: icon tile, title, description, primary action.",
      render: () => <CallToAction />,
      code: `import { Button, EmptyState } from "@asbirtech/asbir-ui";

<EmptyState
  icon={<InboxIcon />}
  title="No projects yet"
  description="Create your first project to start routing requests and tracking usage"
  action={<Button size="sm">New project</Button>}
/>`,
    },
    {
      id: "empty-state-02",
      title: "Onboarding steps",
      description: "A numbered checklist with completed steps struck through — for empty states users can work their way out of.",
      render: () => <OnboardingSteps />,
      code: `import { Button } from "@asbirtech/asbir-ui";

const steps = [
  { title: "Create a project", detail: "Name it and pick a region", done: true },
  { title: "Add an API key", detail: "Scope it to the environments you need", done: false },
  { title: "Send your first request", detail: "Use the quickstart snippet", done: false },
];

<div className="mx-auto w-full max-w-md rounded-xl border border-dashed border-border px-6 py-8">
  <h2 className="text-sm font-semibold text-fg">Finish setting up</h2>
  <p className="mt-1 text-xs text-fg/55">Your workspace is empty until the first request lands</p>
  <ol className="mt-5 space-y-3">
    {steps.map((s, i) => (
      <li key={s.title} className="flex items-start gap-3">
        <span className={cn("mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
          s.done ? "bg-accent text-accent-fg" : "border border-border text-fg/50")}>
          {s.done ? <CheckIcon /> : i + 1}
        </span>
        <span>
          <span className={cn("block text-sm font-medium", s.done ? "text-fg/45 line-through" : "text-fg")}>
            {s.title}
          </span>
          <span className="block text-xs text-fg/50">{s.detail}</span>
        </span>
      </li>
    ))}
  </ol>
  <Button size="sm" variant="secondary" className="mt-5">Continue setup</Button>
</div>`,
    },
    {
      id: "empty-state-03",
      title: "Error with retry",
      description: "For failed loads — a danger-tinted icon, a blameless message, and a way back.",
      render: () => <ErrorRetry />,
      code: `import { Button } from "@asbirtech/asbir-ui";

<div className="mx-auto flex w-full max-w-md flex-col items-center rounded-xl border border-border bg-panel px-6 py-12 text-center">
  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/15 text-red-500">
    <AlertIcon />
  </span>
  <h2 className="mt-4 text-sm font-semibold text-fg">Couldn't load deployments</h2>
  <p className="mt-1 max-w-xs text-xs leading-relaxed text-fg/55">
    The request timed out — your data is safe, this one's on us
  </p>
  <div className="mt-4 flex gap-2">
    <Button size="sm" variant="secondary">Contact support</Button>
    <Button size="sm">Retry</Button>
  </div>
</div>`,
    },
    {
      id: "empty-state-04",
      title: "No search results",
      description: "The zero-hits state — echo the query, suggest a fix, offer to clear.",
      render: () => <NoResults />,
      code: `import { Button, EmptyState } from "@asbirtech/asbir-ui";

<EmptyState
  icon={<SearchIcon />}
  title={<>No results for "{query}"</>}
  description="Check the spelling or try a broader term — search covers names, tags, and ids"
  action={<Button size="sm" variant="ghost" onClick={clearSearch}>Clear search</Button>}
/>`,
    },
  ],
};
