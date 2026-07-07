import * as React from "react";

/*
  In-memory mock data store for the admin template. It stands in for a real
  API/query layer: hooks expose { data, isLoading, error }, and mutations
  actually change the in-memory collections so lists update live. Adopters
  replace this file with their data layer (TanStack Query, RTK, server
  actions) and keep every page/component unchanged.

  A tiny pub/sub keeps it dependency-free; `simulate` lets pages demo the
  loading / empty / error states without real latency.
*/

export type Project = {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: "Active" | "In review" | "Paused" | "Archived";
  progress: number;
  tags: string[];
  updated: string;
  visibility: "workspace" | "private";
};

export type Member = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  status: "Active" | "Invited";
  joined: string;
};

type DB = { projects: Project[]; members: Member[] };

const seedProjects: Project[] = [
  { id: "PRJ-1001", name: "Marketing website", description: "Public marketing site and blog.", owner: "Leslie Alexander", status: "Active", progress: 82, tags: ["frontend", "marketing"], updated: "2h ago", visibility: "workspace" },
  { id: "PRJ-1002", name: "Mobile app", description: "iOS + Android client.", owner: "Michael Foster", status: "In review", progress: 64, tags: ["mobile"], updated: "5h ago", visibility: "workspace" },
  { id: "PRJ-1003", name: "Design system", description: "Shared component library and tokens.", owner: "Dries Vincent", status: "Active", progress: 91, tags: ["design", "frontend"], updated: "1d ago", visibility: "workspace" },
  { id: "PRJ-1004", name: "Internal tools", description: "Ops dashboards and admin utilities.", owner: "Lindsay Walton", status: "Paused", progress: 38, tags: ["internal"], updated: "3d ago", visibility: "private" },
  { id: "PRJ-1005", name: "API platform", description: "Public REST + GraphQL gateway.", owner: "Courtney Henry", status: "Active", progress: 55, tags: ["backend", "api"], updated: "3d ago", visibility: "workspace" },
  { id: "PRJ-1006", name: "Docs portal", description: "Developer documentation site.", owner: "Tom Cook", status: "Archived", progress: 100, tags: ["docs"], updated: "1w ago", visibility: "workspace" },
  { id: "PRJ-1007", name: "Billing rework", description: "Usage-based billing migration.", owner: "Whitney Francis", status: "In review", progress: 47, tags: ["backend", "billing"], updated: "1w ago", visibility: "private" },
];

const seedMembers: Member[] = [
  { id: "USR-01", name: "Eric Sander", email: "eric@acme.dev", role: "Owner", status: "Active", joined: "Jan 2024" },
  { id: "USR-02", name: "Leslie Alexander", email: "leslie@acme.dev", role: "Admin", status: "Active", joined: "Feb 2024" },
  { id: "USR-03", name: "Michael Foster", email: "michael@acme.dev", role: "Member", status: "Active", joined: "Mar 2024" },
  { id: "USR-04", name: "Dries Vincent", email: "dries@acme.dev", role: "Member", status: "Active", joined: "Apr 2024" },
  { id: "USR-05", name: "Lindsay Walton", email: "lindsay@acme.dev", role: "Viewer", status: "Invited", joined: "—" },
];

// module-level mutable db + subscribers
const db: DB = {
  projects: seedProjects.map((p) => ({ ...p })),
  members: seedMembers.map((m) => ({ ...m })),
};
const subs = new Set<() => void>();
const emit = () => subs.forEach((fn) => fn());

function useDb<T>(select: (db: DB) => T): T {
  return React.useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => select(db),
    () => select(db)
  );
}

/* ---- optional state simulation, toggled per hook via query flag ---- */
type Sim = "ok" | "loading" | "empty" | "error";
function useSimulated<T>(data: T, sim: Sim, empty: T) {
  // `sim` lets demo pages exercise non-happy states without real latency.
  return {
    data: sim === "empty" ? empty : data,
    isLoading: sim === "loading",
    error: sim === "error" ? new Error("Failed to load. Please try again.") : null,
  };
}

/* ---- projects ---- */
export function useProjects(sim: Sim = "ok") {
  const projects = useDb((d) => d.projects);
  return useSimulated(projects, sim, [] as Project[]);
}

export function useProject(id: string | null) {
  const project = useDb((d) => d.projects.find((p) => p.id === id) ?? null);
  return { data: project, isLoading: false, error: null as Error | null };
}

export function createProject(input: Omit<Project, "id" | "updated">) {
  const id = `PRJ-${1000 + db.projects.length + 1}`;
  db.projects = [{ ...input, id, updated: "just now" }, ...db.projects];
  emit();
  return id;
}

export function updateProject(id: string, patch: Partial<Project>) {
  db.projects = db.projects.map((p) =>
    p.id === id ? { ...p, ...patch, updated: "just now" } : p
  );
  emit();
}

export function removeProject(id: string) {
  db.projects = db.projects.filter((p) => p.id !== id);
  emit();
}

/* ---- members ---- */
export function useMembers(sim: Sim = "ok") {
  const members = useDb((d) => d.members);
  return useSimulated(members, sim, [] as Member[]);
}

export function inviteMember(input: { name: string; email: string; role: Member["role"] }) {
  const id = `USR-${String(db.members.length + 1).padStart(2, "0")}`;
  db.members = [...db.members, { ...input, id, status: "Invited", joined: "—" }];
  emit();
  return id;
}

export function removeMember(id: string) {
  db.members = db.members.filter((m) => m.id !== id);
  emit();
}

/* ---- shared tone maps ---- */
export const projectStatusTone: Record<Project["status"], string> = {
  Active: "bg-emerald-500/15 text-emerald-400",
  "In review": "bg-amber-500/15 text-amber-400",
  Paused: "bg-sky-500/15 text-sky-400",
  Archived: "bg-fg/10 text-fg/50",
};

export const memberStatusTone: Record<Member["status"], string> = {
  Active: "bg-emerald-500/15 text-emerald-400",
  Invited: "bg-amber-500/15 text-amber-400",
};
