import * as React from "react";
import type { ChatMessage } from "./store";

/*
  Session-local run history for the Playground. A "run" is one conversation,
  persisted under a stable id as it grows. Ephemeral by design (memory only, for
  the session) — mirrors the "nothing here is saved" sandbox note.

  Runs are surfaced as the nested sub-list under Playground in the sidebar
  (ChatGPT-style history); `activeRunId` is the shared selection so the sidebar
  and the Playground page agree on which run is open. Same subscribe/snapshot
  pattern as store.tsx so both plug into useSyncExternalStore.
*/

export type Turn = ChatMessage & { tokens?: number; latencyMs?: number };

export type Run = {
  id: string;
  title: string; // first user message, trimmed
  model: string; // model label at capture time
  at: number; // ms timestamp for ordering + relative time
  turns: Turn[];
};

let runs: Run[] = [];
let activeRunId: string | null = null;
let seq = 0;

const subs = new Set<() => void>();
const emit = () => {
  runs = runs.slice(); // new identity so useSyncExternalStore sees the change
  subs.forEach((fn) => fn());
};
const subscribe = (cb: () => void) => (subs.add(cb), () => subs.delete(cb));

function titleOf(turns: Turn[]): string {
  const firstUser = turns.find((t) => t.role === "user");
  return (firstUser?.content ?? "Untitled").trim().slice(0, 80) || "Untitled";
}

/** Mint a fresh run id for a new, not-yet-persisted conversation. */
export function newRunId(): string {
  return `run_${++seq}`;
}

/**
 * Persist a conversation under a STABLE id — create the first time, update in
 * place afterwards (so growing a run never spawns a duplicate). No-op for empty
 * threads. Touched runs bubble to the top (most-recent first).
 */
export function upsertRun(id: string, turns: Turn[], model: string): void {
  if (turns.length === 0) return;
  const entry: Run = { id, title: titleOf(turns), model, at: Date.now(), turns };
  runs = [entry, ...runs.filter((r) => r.id !== id)];
  emit();
}

/** The run the Playground currently has open (drives sidebar highlight). */
export function setActiveRunId(id: string | null): void {
  if (id === activeRunId) return;
  activeRunId = id;
  subs.forEach((fn) => fn());
}

/** Delete a run from history. If it was the open one, clear the selection so
    the Playground drops back to a blank thread. */
export function removeRun(id: string): void {
  runs = runs.filter((r) => r.id !== id);
  if (activeRunId === id) activeRunId = null;
  emit();
}

export function clearRuns(): void {
  runs = [];
  activeRunId = null;
  emit();
}

export const useRuns = (): Run[] =>
  React.useSyncExternalStore(subscribe, () => runs, () => runs);

export const useActiveRunId = (): string | null =>
  React.useSyncExternalStore(subscribe, () => activeRunId, () => activeRunId);

export const useRun = (id: string | null): Run | null =>
  React.useSyncExternalStore(
    subscribe,
    () => (id ? runs.find((r) => r.id === id) ?? null : null),
    () => (id ? runs.find((r) => r.id === id) ?? null : null),
  );
