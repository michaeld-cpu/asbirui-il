import * as React from "react";
import { Button, PageHeader, Field, EmptyState, inputCls, useToast } from "./ai-states";
import { Icons } from "./ai-ui";
import { usePrompt, savePrompt, MODELS } from "./store";

export function PromptFormPage({ id }: { id?: string }) {
  const existing = usePrompt(id ?? "");
  const toast = useToast();
  const editing = Boolean(id);

  if (editing && !existing) {
    return (
      <div>
        <PageHeader title="Prompt not found" back={{ href: "#ai/prompts", label: "Prompts" }} />
        <div className="mt-8">
          <EmptyState
            title="Prompt not found"
            description="The prompt you're looking for doesn't exist or was deleted."
            action={
              <Button variant="secondary" size="sm" onClick={() => (location.hash = "#ai/prompts")}>
                {Icons.arrowLeft}
                Back to prompts
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const [title, setTitle] = React.useState(existing?.title ?? "");
  const [model, setModel] = React.useState(existing?.model ?? MODELS[0]?.id ?? "");
  const [tags, setTags] = React.useState((existing?.tags ?? []).join(", "));
  const [body, setBody] = React.useState(existing?.body ?? "");
  const [favorite, setFavorite] = React.useState(existing?.favorite ?? false);
  const [touched, setTouched] = React.useState(false);

  const titleError = touched && !title.trim() ? "Title is required." : undefined;
  const bodyError = touched && !body.trim() ? "Prompt body is required." : undefined;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!title.trim() || !body.trim()) return;
    savePrompt({
      id: existing?.id,
      title: title.trim(),
      body,
      model,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      favorite,
    });
    toast(editing ? "Prompt updated" : "Prompt created");
    location.hash = "#ai/prompts";
  };

  return (
    <div>
      <PageHeader
        title={editing ? "Edit prompt" : "New prompt"}
        subtitle={editing ? "Update this prompt template." : "Create a reusable prompt template."}
        back={{ href: "#ai/prompts", label: "Prompts" }}
      />

      <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Field label="Title" error={titleError}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summarize support ticket"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Model">
              <select value={model} onChange={(e) => setModel(e.target.value)} className={inputCls}>
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tags" hint="Comma-separated">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="support, summarization"
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Prompt body" error={bodyError}>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="You are Aurora, a helpful assistant. Given the following ticket, produce a concise summary…"
              className={`${inputCls} min-h-64 resize-y font-mono text-xs leading-relaxed`}
            />
          </Field>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg">
            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-[rgb(var(--accent))]"
            />
            Mark as favorite
          </label>

          <div className="flex items-center gap-3 border-t border-border pt-5">
            <Button variant="primary" size="md" type="submit">
              {editing ? "Save changes" : "Create prompt"}
            </Button>
            <a
              href="#ai/prompts"
              className="rounded-lg px-3 py-2 text-sm font-medium text-fg/70 transition-colors hover:bg-overlay/[0.05] hover:text-fg"
            >
              Cancel
            </a>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-panel p-4">
            <div className="flex items-center gap-2 ai-accent">
              {Icons.star}
              <span className="text-sm font-semibold">Prompt tips</span>
            </div>
            <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-fg/70 dark:text-fg/55">
              <li>Lead with the assistant's role and objective so Aurora anchors on intent.</li>
              <li>Use clear delimiters for injected content, e.g. triple backticks or XML tags.</li>
              <li>Specify the desired output format explicitly (JSON, bullets, length).</li>
              <li>Tag prompts by use-case to keep the library searchable.</li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}
