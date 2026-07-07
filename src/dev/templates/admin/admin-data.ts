/*
  Generic admin-panel skeleton data + nav config (Filament-style).
  Everything here is placeholder sample data — the point of the template is the
  STRUCTURE. Swap these arrays for real data sources when adopting it.
*/

import type * as React from "react";

export type AdminNavItem = {
  label: string;
  href: string; // "#admin", "#admin/projects", …
  icon: React.ReactNode;
  match: string; // sub-path this item is active for
};

export type AdminNavGroup = {
  heading: string;
  items: AdminNavItem[];
};

// Icons are passed in from the component file to keep this data-only.

export const stats = [
  { label: "Total revenue", value: "$48,290", delta: "+12.5%", up: true },
  { label: "Active projects", value: "24", delta: "+3", up: true },
  { label: "Team members", value: "58", delta: "+4", up: true },
  { label: "Open tasks", value: "132", delta: "-8.1%", up: false },
];

// weekly series (0..1) for the dashboard area chart
export const activitySeries = [
  0.28, 0.34, 0.3, 0.42, 0.38, 0.5, 0.46, 0.6, 0.54, 0.7, 0.64, 0.82,
];
export const activityLabels = [
  "W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12",
];

export type Project = {
  id: string;
  name: string;
  owner: string;
  status: "Active" | "In review" | "Paused" | "Archived";
  progress: number; // 0..100
  updated: string;
};

export const projects: Project[] = [
  { id: "PRJ-1001", name: "Marketing website", owner: "Leslie Alexander", status: "Active", progress: 82, updated: "2h ago" },
  { id: "PRJ-1002", name: "Mobile app", owner: "Michael Foster", status: "In review", progress: 64, updated: "5h ago" },
  { id: "PRJ-1003", name: "Design system", owner: "Dries Vincent", status: "Active", progress: 91, updated: "1d ago" },
  { id: "PRJ-1004", name: "Internal tools", owner: "Lindsay Walton", status: "Paused", progress: 38, updated: "3d ago" },
  { id: "PRJ-1005", name: "API platform", owner: "Courtney Henry", status: "Active", progress: 55, updated: "3d ago" },
  { id: "PRJ-1006", name: "Docs portal", owner: "Tom Cook", status: "Archived", progress: 100, updated: "1w ago" },
  { id: "PRJ-1007", name: "Billing rework", owner: "Whitney Francis", status: "In review", progress: 47, updated: "1w ago" },
];

export const statusTone: Record<Project["status"], string> = {
  Active: "bg-emerald-500/15 text-emerald-400",
  "In review": "bg-amber-500/15 text-amber-400",
  Paused: "bg-sky-500/15 text-sky-400",
  Archived: "bg-fg/10 text-fg/50",
};

export const recentActivity = [
  { who: "Leslie A.", what: "deployed", target: "Marketing website", when: "2h ago" },
  { who: "Michael F.", what: "opened a PR on", target: "Mobile app", when: "4h ago" },
  { who: "Dries V.", what: "closed 3 tasks in", target: "Design system", when: "6h ago" },
  { who: "Courtney H.", what: "invited a member to", target: "API platform", when: "1d ago" },
];
