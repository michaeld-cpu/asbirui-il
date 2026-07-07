import * as React from "react";
import { Icons } from "./admin-ui";
import {
  useProjects,
  removeProject,
  projectStatusTone,
  type Project,
} from "./store";
import {
  PageHeader,
  Button,
  Badge,
  inputCls,
  EmptyState,
  ErrorState,
  TableSkeleton,
  ConfirmDialog,
  useToast,
} from "./admin-states";

const STATUS_FILTERS = ["All", "Active", "In review", "Paused", "Archived"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

export function ProjectsPage() {
  const { data, isLoading, error } = useProjects();
  const toast = useToast();

  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("All");
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((p) => {
      const matchesStatus = status === "All" || p.status === status;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [data, query, status]);

  const confirmProject = data.find((p) => p.id === confirmId) ?? null;

  const handleDelete = () => {
    if (confirmId) {
      removeProject(confirmId);
      toast("Project deleted");
    }
    setConfirmId(null);
  };

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Projects"
        subtitle={`${data.length} project${data.length === 1 ? "" : "s"} across the workspace.`}
        action={
          <a
            href="#admin/projects/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-solid px-3.5 py-2 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85"
          >
            {Icons.plus}
            New project
          </a>
        }
      />

      {/* toolbar: search + status filter chips */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg/40">
            {Icons.search}
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className={`${inputCls} pl-9`}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                status === s
                  ? "bg-overlay/[0.08] font-medium text-fg"
                  : "text-fg/60 hover:bg-overlay/[0.04] hover:text-fg"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : error ? (
        <ErrorState message={error.message} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No projects"
          description={
            data.length === 0
              ? "Get started by creating your first project."
              : "No projects match your current search or filters."
          }
          action={
            <a
              href="#admin/projects/new"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-solid px-3.5 py-2 text-sm font-semibold text-fg-invert transition-colors hover:bg-solid/85"
            >
              {Icons.plus}
              New project
            </a>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-panel">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-fg/50">
                  <th className="px-4 py-3 font-normal">Project</th>
                  <th className="px-4 py-3 font-normal">Owner</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 font-normal">Progress</th>
                  <th className="px-4 py-3 font-normal">Updated</th>
                  <th className="px-4 py-3 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <ProjectRow key={p.id} project={p} onDelete={() => setConfirmId(p.id)} />
                ))}
              </tbody>
            </table>
          </div>

          {/* pagination footer (presentational) */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-fg/55">
            <span>
              Showing <span className="text-fg">1–{filtered.length}</span> of {filtered.length}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled>
                Prev
              </Button>
              <Button variant="secondary" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete project"
        description={
          confirmProject
            ? `“${confirmProject.name}” will be permanently removed. This action can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}

function ProjectRow({ project, onDelete }: { project: Project; onDelete: () => void }) {
  return (
    <tr className="border-b border-border/60 transition-colors last:border-0 hover:bg-overlay/[0.03]">
      <td className="px-4 py-3">
        <a
          href={`#admin/projects/${project.id}`}
          className="font-medium text-fg hover:underline"
        >
          {project.name}
        </a>
        <p className="text-xs text-fg/40">{project.id}</p>
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-2">
          <span className="h-6 w-6 shrink-0 rounded-full bg-fg/15" />
          <span className="text-fg/80">{project.owner}</span>
        </span>
      </td>
      <td className="px-4 py-3">
        <Badge className={projectStatusTone[project.status]}>{project.status}</Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-overlay/[0.1]">
            <div className="h-full rounded-full bg-fg/50" style={{ width: `${project.progress}%` }} />
          </div>
          <span className="text-xs tabular-nums text-fg/50">{project.progress}%</span>
        </div>
      </td>
      <td className="px-4 py-3 text-fg/50">{project.updated}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <a
            href={`#admin/projects/${project.id}/edit`}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-fg/60 transition-colors hover:bg-overlay/[0.05] hover:text-fg"
          >
            Edit
          </a>
          <button
            onClick={onDelete}
            aria-label={`Delete ${project.name}`}
            className="rounded-lg px-2 py-1.5 text-fg/50 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            {Icons.trash}
          </button>
        </div>
      </td>
    </tr>
  );
}
