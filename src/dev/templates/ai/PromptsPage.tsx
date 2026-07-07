import * as React from "react";
import { Button, Badge, PageHeader, EmptyState, ConfirmDialog, inputCls, useToast } from "./ai-states";
import { Icons } from "./ai-ui";
import { usePrompts, togglePromptFavorite, deletePrompt, type Prompt } from "./store";

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return iso;
  const diff = Date.now() - d;
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function PromptCard({ prompt, onDelete }: { prompt: Prompt; onDelete: (p: Prompt) => void }) {
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-panel p-4 transition-colors hover:[border-color:rgb(var(--accent)/0.4)]">
      <div className="flex items-start justify-between gap-3">
        <a
          href={`#ai/prompts/${prompt.id}`}
          className="min-w-0 flex-1 text-sm font-semibold text-fg hover:ai-accent"
        >
          <span className="line-clamp-1">{prompt.title}</span>
        </a>
        <button
          type="button"
          aria-label={prompt.favorite ? "Unfavorite" : "Favorite"}
          onClick={() => togglePromptFavorite(prompt.id)}
          className={`shrink-0 rounded-lg p-1 transition-colors hover:bg-overlay/[0.05] ${prompt.favorite ? "text-amber-700 dark:text-amber-400" : "text-fg/60 dark:text-fg/40 hover:text-fg/70"}`}
        >
          {prompt.favorite ? Icons.star : Icons.starOff}
        </button>
      </div>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-fg/70 dark:text-fg/55">{prompt.body}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge className="ai-bg-accent-soft ai-accent">{prompt.model}</Badge>
        {prompt.tags.map((t) => (
          <span key={t} className="rounded-md bg-overlay/[0.05] px-2 py-0.5 text-[11px] text-fg/70 dark:text-fg/55">
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-[11px] text-fg/70 dark:text-fg/55">Updated {timeAgo(prompt.updated)}</span>
        <div className="flex items-center gap-1">
          <a
            href={`#ai/prompts/${prompt.id}`}
            className="rounded-lg px-2 py-1 text-xs font-medium text-fg/70 transition-colors hover:bg-overlay/[0.05] hover:text-fg"
          >
            Edit
          </a>
          <button
            type="button"
            onClick={() => onDelete(prompt)}
            className="rounded-lg p-1.5 text-fg/70 dark:text-fg/50 transition-colors hover:bg-rose-500/15 hover:text-rose-700 dark:hover:text-rose-400"
            aria-label="Delete prompt"
          >
            {Icons.trash}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PromptsPage() {
  const prompts = usePrompts();
  const toast = useToast();
  const [query, setQuery] = React.useState("");
  const [pending, setPending] = React.useState<Prompt | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return prompts;
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [prompts, query]);

  const confirmDelete = () => {
    if (!pending) return;
    deletePrompt(pending.id);
    toast(`Deleted "${pending.title}"`);
    setPending(null);
  };

  return (
    <div>
      <PageHeader
        title="Prompts"
        subtitle="Reusable prompt templates for the Aurora model family."
        action={
          <Button variant="primary" size="md" onClick={() => (location.hash = "#ai/prompts/new")}>
            {Icons.plus}
            New prompt
          </Button>
        }
      />

      <div className="mt-6 max-w-sm">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg/60 dark:text-fg/40">
            {Icons.search}
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts by title or tag…"
            className={`${inputCls} pl-9`}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={query ? "No matching prompts" : "No prompts yet"}
            description={
              query
                ? "Try a different search term or clear the filter."
                : "Create your first prompt template to get started."
            }
            action={
              query ? (
                <Button variant="secondary" size="sm" onClick={() => setQuery("")}>
                  Clear search
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => (location.hash = "#ai/prompts/new")}>
                  {Icons.plus}
                  New prompt
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PromptCard key={p.id} prompt={p} onDelete={setPending} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pending !== null}
        title="Delete prompt"
        description={pending ? `"${pending.title}" will be permanently removed. This cannot be undone.` : ""}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
