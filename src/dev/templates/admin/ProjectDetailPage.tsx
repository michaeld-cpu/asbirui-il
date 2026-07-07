import * as React from "react";
import { useProject, removeProject, projectStatusTone } from "./store";
import {
  PageHeader,
  Button,
  Badge,
  EmptyState,
  ConfirmDialog,
  useToast,
} from "./admin-states";

const activity = [
  { who: "Leslie Alexander", what: "updated the project status", when: "2h ago" },
  { who: "Michael Foster", what: "added 3 tasks", when: "Yesterday" },
  { who: "Dries Vincent", what: "commented on a task", when: "2 days ago" },
  { who: "Courtney Henry", what: "created the project", when: "Last week" },
];

export function ProjectDetailPage({ id }: { id: string }) {
  const { data } = useProject(id);
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (!data) {
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

  const handleDelete = () => {
    removeProject(data.id);
    setConfirmOpen(false);
    toast("Project deleted");
    location.hash = "#admin/projects";
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        title={data.name}
        subtitle={data.id}
        back={{ href: "#admin/projects", label: "Back to projects" }}
        action={
          <div className="flex items-center gap-2">
            <a
              href={`#admin/projects/${data.id}/edit`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-fg transition-colors hover:bg-overlay/[0.05]"
            >
              Edit
            </a>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* left: details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-panel p-5">
            <h2 className="text-sm font-semibold text-fg">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg/70">{data.description}</p>
            {data.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {data.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-overlay/[0.06] px-2 py-0.5 text-xs font-medium text-fg/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-panel p-5">
            <h2 className="mb-4 text-sm font-semibold text-fg">Activity</h2>
            <ul className="space-y-4">
              {activity.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-fg/15" />
                  <div className="min-w-0 text-sm">
                    <p className="text-fg/80">
                      <span className="font-medium text-fg">{a.who}</span> {a.what}
                    </p>
                    <p className="text-xs text-fg/40">{a.when}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* right: summary */}
        <div className="rounded-xl border border-border bg-panel p-5">
          <h2 className="mb-4 text-sm font-semibold text-fg">Summary</h2>
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-fg/55">Status</dt>
              <dd>
                <Badge className={projectStatusTone[data.status]}>{data.status}</Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-fg/55">Owner</dt>
              <dd className="flex items-center gap-2">
                <span className="h-6 w-6 shrink-0 rounded-full bg-fg/15" />
                <span className="text-fg/80">{data.owner}</span>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-fg/55">Visibility</dt>
              <dd className="capitalize text-fg/80">{data.visibility}</dd>
            </div>
            <div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-fg/55">Progress</dt>
                <dd className="text-xs tabular-nums text-fg/70">{data.progress}%</dd>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-overlay/[0.1]">
                <div className="h-full rounded-full bg-fg/50" style={{ width: `${data.progress}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-fg/55">Updated</dt>
              <dd className="text-fg/80">{data.updated}</dd>
            </div>
          </dl>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete project"
        description={`“${data.name}” will be permanently removed. This action can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
