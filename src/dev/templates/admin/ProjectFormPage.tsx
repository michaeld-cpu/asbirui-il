import * as React from "react";
import { Icons } from "./admin-ui";
import {
  useProject,
  createProject,
  updateProject,
  type Project,
} from "./store";
import { Field, inputCls, Button, useToast, EmptyState } from "./admin-states";

/*
  Resource form page (Filament-style create/edit): grouped sections, labeled
  fields, real controlled state, and basic validation.
*/

const STATUSES: Project["status"][] = ["Active", "In review", "Paused", "Archived"];
const OWNERS = ["Leslie Alexander", "Michael Foster", "Dries Vincent", "Courtney Henry", "Tom Cook"];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 border-b border-border py-6 first:pt-0 lg:grid-cols-3 lg:gap-8">
      <div>
        <h2 className="text-sm font-semibold text-fg">{title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-fg/50">{description}</p>
      </div>
      <div className="space-y-4 lg:col-span-2">{children}</div>
    </div>
  );
}

type FormState = {
  name: string;
  description: string;
  status: Project["status"];
  owner: string;
  tags: string;
  progress: number;
  workspace: boolean;
};

export function ProjectFormPage({ id }: { id?: string }) {
  const isEdit = Boolean(id);
  const { data } = useProject(id ?? null);
  const toast = useToast();

  const [form, setForm] = React.useState<FormState>({
    name: "",
    description: "",
    status: "Active",
    owner: OWNERS[0],
    tags: "",
    progress: 0,
    workspace: true,
  });
  const [nameError, setNameError] = React.useState<string | undefined>();
  const prefilled = React.useRef(false);

  React.useEffect(() => {
    if (isEdit && data && !prefilled.current) {
      prefilled.current = true;
      setForm({
        name: data.name,
        description: data.description,
        status: data.status,
        owner: data.owner,
        tags: data.tags.join(", "),
        progress: data.progress,
        workspace: data.visibility === "workspace",
      });
    }
  }, [isEdit, data]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (isEdit && !data) {
    return (
      <div className="animate-fade-up">
        <EmptyState
          title="Project not found"
          description="This project may have been deleted or the link is incorrect."
          action={
            <a
              href="#admin/projects"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-fg transition-colors hover:bg-overlay/[0.05]"
            >
              Back to projects
            </a>
          }
        />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setNameError("Name is required.");
      return;
    }
    setNameError(undefined);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      owner: form.owner,
      progress: form.progress,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      visibility: (form.workspace ? "workspace" : "private") as Project["visibility"],
    };

    if (isEdit && id) {
      updateProject(id, payload);
      toast("Project updated");
    } else {
      createProject(payload);
      toast("Project created");
    }
    location.hash = "#admin/projects";
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-up">
      <a
        href="#admin/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-fg/55 transition-colors hover:text-fg"
      >
        {Icons.arrowLeft}
        Back to projects
      </a>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isEdit ? "Edit project" : "New project"}
        </h1>
      </div>

      <div className="rounded-xl border border-border bg-panel px-5 sm:px-6">
        <Section title="Details" description="Basic information about the project.">
          <Field label="Name" error={nameError}>
            <input
              className={inputCls}
              placeholder="e.g. Marketing website"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Description" hint="A short summary shown in listings.">
            <textarea
              className={`${inputCls} min-h-[88px] resize-y`}
              placeholder="What is this project about?"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Configuration" description="How the project is categorized and tracked.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Status">
              <div className="relative">
                <select
                  className={`${inputCls} appearance-none pr-9`}
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as Project["status"])}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg/40">
                  {Icons.chevronDown}
                </span>
              </div>
            </Field>
            <Field label="Owner">
              <div className="relative">
                <select
                  className={`${inputCls} appearance-none pr-9`}
                  value={form.owner}
                  onChange={(e) => set("owner", e.target.value)}
                >
                  {OWNERS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-fg/40">
                  {Icons.chevronDown}
                </span>
              </div>
            </Field>
          </div>
          <Field label="Tags" hint="Comma-separated.">
            <input
              className={inputCls}
              placeholder="frontend, marketing"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
            />
          </Field>
          <Field label="Progress" hint="Completion percentage (0–100).">
            <input
              type="number"
              min={0}
              max={100}
              className={inputCls}
              value={form.progress}
              onChange={(e) =>
                set("progress", Math.max(0, Math.min(100, Number(e.target.value) || 0)))
              }
            />
          </Field>
        </Section>

        <Section title="Visibility" description="Control who can see this project.">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-border"
              checked={form.workspace}
              onChange={(e) => set("workspace", e.target.checked)}
            />
            <span className="text-sm text-fg/80">
              Visible to the whole workspace
              <span className="block text-xs text-fg/45">
                Uncheck to restrict to invited members only.
              </span>
            </span>
          </label>
        </Section>

        <div className="flex items-center justify-end gap-3 py-5">
          <a
            href="#admin/projects"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-overlay/[0.05]"
          >
            Cancel
          </a>
          <Button type="submit">{isEdit ? "Save changes" : "Create project"}</Button>
        </div>
      </div>
    </form>
  );
}
