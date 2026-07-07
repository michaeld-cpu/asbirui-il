import * as React from "react";

/*
  Domain store for Lumina — a provider-agnostic AI gateway & observability
  platform. Users CONNECT providers (OpenAI, Anthropic, Google, …) with their
  own API keys, then define AGENTS on top of those connections. Lumina routes
  requests and surfaces KPIs three ways: platform-wide, per-provider, per-agent.

  In-memory mock; adopters swap for their real API. Dependency-free pub/sub.
  NOTE: this file also keeps the earlier prompt/member/invoice/log exports so
  existing pages keep compiling while the UI is revamped.
*/

/* ============================ providers ============================ */

export type ProviderId = "openai" | "anthropic" | "google" | "mistral" | "meta" | "xai";

export type ProviderModel = {
  id: string; // provider-native id, e.g. "gpt-4o"
  label: string;
  kind: "chat" | "embedding" | "image";
  context: string;
  inPrice: number; // $/1M input tokens
  outPrice: number; // $/1M output tokens
};

export type Provider = {
  id: ProviderId;
  name: string;
  keyFormat: string; // hint shown in the connect form, e.g. "sk-…"
  docsUrl: string;
  models: ProviderModel[];
};

// Supported provider catalog (what the platform can talk to).
export const PROVIDERS: Provider[] = [
  {
    id: "openai",
    name: "OpenAI",
    keyFormat: "sk-…",
    docsUrl: "https://platform.openai.com/api-keys",
    models: [
      { id: "gpt-4o", label: "GPT-4o", kind: "chat", context: "128K", inPrice: 2.5, outPrice: 10 },
      { id: "gpt-4.1", label: "GPT-4.1", kind: "chat", context: "1M", inPrice: 2, outPrice: 8 },
      { id: "o3", label: "o3", kind: "chat", context: "200K", inPrice: 10, outPrice: 40 },
      { id: "text-embedding-3-large", label: "Embedding 3 Large", kind: "embedding", context: "8K", inPrice: 0.13, outPrice: 0 },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    keyFormat: "sk-ant-…",
    docsUrl: "https://console.anthropic.com/settings/keys",
    models: [
      { id: "claude-opus-4", label: "Claude Opus 4", kind: "chat", context: "200K", inPrice: 15, outPrice: 75 },
      { id: "claude-sonnet-4", label: "Claude Sonnet 4", kind: "chat", context: "200K", inPrice: 3, outPrice: 15 },
      { id: "claude-haiku-4", label: "Claude Haiku 4", kind: "chat", context: "200K", inPrice: 0.8, outPrice: 4 },
    ],
  },
  {
    id: "google",
    name: "Google",
    keyFormat: "AIza…",
    docsUrl: "https://aistudio.google.com/app/apikey",
    models: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", kind: "chat", context: "2M", inPrice: 1.25, outPrice: 10 },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", kind: "chat", context: "1M", inPrice: 0.3, outPrice: 2.5 },
    ],
  },
  {
    id: "mistral",
    name: "Mistral",
    keyFormat: "…",
    docsUrl: "https://console.mistral.ai/api-keys",
    models: [
      { id: "mistral-large", label: "Mistral Large", kind: "chat", context: "128K", inPrice: 2, outPrice: 6 },
      { id: "mistral-embed", label: "Mistral Embed", kind: "embedding", context: "8K", inPrice: 0.1, outPrice: 0 },
    ],
  },
  {
    id: "meta",
    name: "Meta",
    keyFormat: "…",
    docsUrl: "https://llama.developer.meta.com",
    models: [{ id: "llama-4-maverick", label: "Llama 4 Maverick", kind: "chat", context: "1M", inPrice: 0.2, outPrice: 0.6 }],
  },
  {
    id: "xai",
    name: "xAI",
    keyFormat: "xai-…",
    docsUrl: "https://console.x.ai",
    models: [{ id: "grok-4", label: "Grok 4", kind: "chat", context: "256K", inPrice: 3, outPrice: 15 }],
  },
];

export function getProvider(id: ProviderId): Provider {
  return PROVIDERS.find((p) => p.id === id)!;
}
export function allModels(): (ProviderModel & { provider: ProviderId })[] {
  return PROVIDERS.flatMap((p) => p.models.map((m) => ({ ...m, provider: p.id })));
}
export function findModel(modelId: string): (ProviderModel & { provider: ProviderId }) | null {
  return allModels().find((m) => m.id === modelId) ?? null;
}

/* ============================ connections ============================ */
// A user's connected provider account (BYO key).
export type Connection = {
  id: string;
  provider: ProviderId;
  label: string; // "Prod OpenAI", "Team Anthropic"
  keyPreview: string; // "sk-…f4a2"
  status: "connected" | "error" | "disabled";
  connected: string; // when
  monthlySpend: number;
  monthlyRequests: number;
};

/* ============================ agents ============================ */
// An agent is a user-defined assistant bound to a connection + model.
export type Agent = {
  id: string;
  name: string;
  description: string;
  connectionId: string; // which provider connection it runs on
  model: string; // provider-native model id
  systemPrompt: string;
  status: "active" | "paused";
  // curated per-agent metrics
  requests7d: number;
  requestsDelta: string;
  spend30d: number;
  avgLatency: number; // ms
  errorRate: number; // 0..1
  successRate: number; // 0..1
  tokens30d: string;
  updated: string;
  // 14-pt sparkline series (0..1)
  series: number[];
};

/* ============================ logs / misc (kept) ============================ */
export type RequestLog = {
  id: string;
  time: string;
  agent: string; // agent name (routed-through)
  provider: ProviderId;
  model: string;
  endpoint: "chat" | "completions" | "embeddings" | "images";
  status: 200 | 400 | 429 | 500;
  latencyMs: number;
  tokens: number;
  cost: number;
};

export type Invoice = { id: string; date: string; amount: number; status: "Paid" | "Due" | "Failed" };
export type Member = { id: string; name: string; email: string; role: "Owner" | "Admin" | "Developer" | "Billing"; status: "Active" | "Invited" };
export type Prompt = { id: string; title: string; body: string; model: string; tags: string[]; updated: string; favorite: boolean };
export type ChatMessage = { role: "user" | "assistant"; content: string };

/* ---- back-compat: some pages still import Model/MODELS/ApiKey ---- */
export type Model = ProviderModel;
export const MODELS: Model[] = allModels();
export type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  scopes: string[];
  status: "active" | "revoked";
};

/* ============================ seed ============================ */
const seedConnections: Connection[] = [
  { id: "cxn_01", provider: "openai", label: "Production OpenAI", keyPreview: "sk-…f4a2", status: "connected", connected: "Jan 12, 2026", monthlySpend: 214.6, monthlyRequests: 21400 },
  { id: "cxn_02", provider: "anthropic", label: "Team Anthropic", keyPreview: "sk-ant-…9b1c", status: "connected", connected: "Feb 3, 2026", monthlySpend: 88.2, monthlyRequests: 12800 },
  { id: "cxn_03", provider: "google", label: "Gemini (staging)", keyPreview: "AIza…7d33", status: "error", connected: "Mar 20, 2026", monthlySpend: 9.7, monthlyRequests: 2100 },
];

// Daily trend series with distinct shapes so charts read as different agents,
// not the same ramp shifted. A dense point count plus layered deterministic
// noise gives each line real day-to-day texture — peaks and dips — instead of
// a lazy smooth wave. Values are clamped to [0.08, 1]; no Math.random, so the
// series is stable across renders.
type SeriesShape = "rising" | "dip" | "spike" | "wave" | "declining" | "steady";
const s = (base: number, shape: SeriesShape = "rising"): number[] => {
  const N = 30; // ~a month of daily points — enough density to look alive
  // deterministic pseudo-noise in [-1, 1] from an index + seed
  const rnd = (i: number, seed: number) => {
    const h = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
    return (h - Math.floor(h)) * 2 - 1;
  };
  const seed = shape.length + base * 100;
  return Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1); // 0..1 across the window
    let v: number;
    switch (shape) {
      case "rising": // steady climb
        v = base + t * 0.55;
        break;
      case "dip": // sags in the middle, recovers
        v = base + 0.4 * Math.abs(t - 0.5) * 2;
        break;
      case "spike": // flat, then a sharp mid-window peak that settles
        v = base + 0.6 * Math.exp(-Math.pow((t - 0.6) / 0.16, 2));
        break;
      case "wave": // multiple humps — busy/quiet cycling
        v = base + 0.3 + 0.24 * Math.sin(t * Math.PI * 3.2);
        break;
      case "declining": // starts high, tapers off
        v = base + 0.5 * (1 - t);
        break;
      case "steady": // undulating plateau
        v = base + 0.14 * Math.sin(t * Math.PI * 2.5);
        break;
    }
    // layered noise: a slow swell + fast daily jitter + occasional spikes/dips,
    // so the line has genuine texture rather than one smooth arc
    const swell = rnd(Math.floor(i / 4), seed) * 0.07;
    const jitter = rnd(i, seed) * 0.09;
    const burst = rnd(i, seed + 9) > 0.72 ? 0.14 : rnd(i, seed + 3) < -0.78 ? -0.12 : 0;
    return Math.min(1, Math.max(0.08, v + swell + jitter + burst));
  });
};

const seedAgents: Agent[] = [
  { id: "agt_01", name: "Support Triage", description: "Classifies and routes inbound support tickets.", connectionId: "cxn_01", model: "gpt-4o", systemPrompt: "You are a support triage agent…", status: "active", requests7d: 18240, requestsDelta: "+14.2%", spend30d: 142.3, avgLatency: 720, errorRate: 0.004, successRate: 0.981, tokens30d: "24.1M", updated: "2h ago", series: s(0.3, "rising") },
  { id: "agt_02", name: "Code Reviewer", description: "Reviews pull requests for bugs and style.", connectionId: "cxn_02", model: "claude-sonnet-4", systemPrompt: "You are a senior code reviewer…", status: "active", requests7d: 9120, requestsDelta: "+6.1%", spend30d: 61.4, avgLatency: 1180, errorRate: 0.011, successRate: 0.964, tokens30d: "12.8M", updated: "5h ago", series: s(0.28, "wave") },
  { id: "agt_03", name: "Docs Assistant", description: "Answers questions from the product docs (RAG).", connectionId: "cxn_02", model: "claude-haiku-4", systemPrompt: "Answer only from the provided context…", status: "active", requests7d: 15600, requestsDelta: "+21.7%", spend30d: 19.9, avgLatency: 410, errorRate: 0.006, successRate: 0.99, tokens30d: "9.4M", updated: "1d ago", series: s(0.22, "spike") },
  { id: "agt_04", name: "SQL Copilot", description: "Turns natural-language questions into SQL.", connectionId: "cxn_01", model: "gpt-4.1", systemPrompt: "Given a schema, write safe SQL…", status: "paused", requests7d: 3020, requestsDelta: "-4.0%", spend30d: 33.8, avgLatency: 640, errorRate: 0.028, successRate: 0.93, tokens30d: "5.2M", updated: "3d ago", series: s(0.2, "declining") },
  { id: "agt_05", name: "Content Drafter", description: "Drafts marketing copy and blog outlines.", connectionId: "cxn_03", model: "gemini-2.5-flash", systemPrompt: "You are a marketing copywriter…", status: "active", requests7d: 2100, requestsDelta: "+3.3%", spend30d: 9.7, avgLatency: 520, errorRate: 0.009, successRate: 0.978, tokens30d: "3.1M", updated: "6h ago", series: s(0.24, "dip") },
];

const endpoints: RequestLog["endpoint"][] = ["chat", "completions", "embeddings", "images"];
const statuses: RequestLog["status"][] = [200, 200, 200, 200, 200, 429, 400, 500];
function seededLogs(agents: Agent[]): RequestLog[] {
  const rows: RequestLog[] = [];
  let st = 987654321;
  const rnd = () => ((st = (st * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  for (let i = 0; i < 48; i++) {
    const a = agents[Math.floor(rnd() * agents.length)];
    rows.push({
      id: `req_${1000 + i}`,
      time: `${Math.floor(rnd() * 59) + 1}m ago`,
      agent: a.name,
      provider: connProvider(a.connectionId),
      model: a.model,
      endpoint: endpoints[Math.floor(rnd() * endpoints.length)],
      status: statuses[Math.floor(rnd() * statuses.length)],
      latencyMs: Math.floor(rnd() * 1800) + 120,
      tokens: Math.floor(rnd() * 4000) + 50,
      cost: Number((rnd() * 0.12).toFixed(4)),
    });
  }
  return rows;
}
function connProvider(cxnId: string): ProviderId {
  return seedConnections.find((c) => c.id === cxnId)?.provider ?? "openai";
}

const seedInvoices: Invoice[] = [
  { id: "inv_2026_06", date: "Jun 1, 2026", amount: 312.44, status: "Paid" },
  { id: "inv_2026_05", date: "May 1, 2026", amount: 288.1, status: "Paid" },
  { id: "inv_2026_04", date: "Apr 1, 2026", amount: 401.92, status: "Paid" },
  { id: "inv_2026_07", date: "Jul 1, 2026", amount: 96.2, status: "Due" },
];
const seedMembers: Member[] = [
  { id: "usr_01", name: "Mike Sander", email: "mike@lumina.ai", role: "Owner", status: "Active" },
  { id: "usr_02", name: "Leslie Alexander", email: "leslie@lumina.ai", role: "Admin", status: "Active" },
  { id: "usr_03", name: "Michael Foster", email: "michael@lumina.ai", role: "Developer", status: "Active" },
  { id: "usr_04", name: "Dana Kim", email: "dana@lumina.ai", role: "Billing", status: "Invited" },
];
const seedPrompts: Prompt[] = [
  { id: "pmt_01", title: "Support triage", body: "You are a support agent. Classify the ticket by urgency…", model: "gpt-4o", tags: ["support"], updated: "2h ago", favorite: true },
  { id: "pmt_02", title: "SQL generator", body: "Given a schema, write a safe SQL query…", model: "gpt-4.1", tags: ["data"], updated: "1d ago", favorite: false },
  { id: "pmt_03", title: "PR reviewer", body: "Review this diff for bugs and security…", model: "claude-sonnet-4", tags: ["engineering"], updated: "1w ago", favorite: false },
];

type DB = {
  connections: Connection[];
  agents: Agent[];
  logs: RequestLog[];
  invoices: Invoice[];
  members: Member[];
  prompts: Prompt[];
};
const db: DB = {
  connections: seedConnections.map((c) => ({ ...c })),
  agents: seedAgents.map((a) => ({ ...a })),
  logs: seededLogs(seedAgents),
  invoices: seedInvoices.map((i) => ({ ...i })),
  members: seedMembers.map((m) => ({ ...m })),
  prompts: seedPrompts.map((p) => ({ ...p })),
};

const subs = new Set<() => void>();
const emit = () => subs.forEach((fn) => fn());
function useDb<T>(select: (db: DB) => T): T {
  return React.useSyncExternalStore(
    (cb) => (subs.add(cb), () => subs.delete(cb)),
    () => select(db),
    () => select(db)
  );
}

/* ============================ platform KPIs (cross-provider) ============================ */
export const platform = {
  totalRequests7d: 48080,
  requestsDelta: "+12.5%",
  totalSpend30d: 267.1,
  spendDelta: "+8.1%",
  avgLatency: 690,
  successRate: 0.976,
  activeAgents: 4,
  connectedProviders: 3,
  // 14-day platform series (0..1)
  requestsSeries: [0.3, 0.36, 0.32, 0.44, 0.4, 0.52, 0.48, 0.6, 0.55, 0.7, 0.64, 0.78, 0.72, 0.9],
  spendSeries: [0.2, 0.28, 0.24, 0.34, 0.3, 0.42, 0.38, 0.5, 0.46, 0.58, 0.54, 0.66, 0.62, 0.8],

  /* back-compat fields for pages awaiting the UI revamp (old `usage` shape) */
  creditsUsed: 6820,
  creditsTotal: 10000,
  spendMonth: 312.44,
  requests7d: 48210,
  errorRate: "0.42%",
  byModel: [
    { model: "GPT-4o", requests: 21400, tokens: "38.2M", cost: 214.6 },
    { model: "Claude Sonnet 4", requests: 12800, tokens: "22.1M", cost: 88.2 },
    { model: "Gemini 2.5 Flash", requests: 2100, tokens: "3.1M", cost: 9.7 },
    { model: "GPT-4.1", requests: 3020, tokens: "5.2M", cost: 33.8 },
  ],
};

// spend split by provider, derived from connections
export function useProviderBreakdown() {
  const connections = useDb((d) => d.connections);
  const total = connections.reduce((sum, c) => sum + c.monthlySpend, 0) || 1;
  return connections.map((c) => ({
    provider: c.provider,
    name: getProvider(c.provider).name,
    spend: c.monthlySpend,
    requests: c.monthlyRequests,
    share: c.monthlySpend / total,
    status: c.status,
  }));
}

/* ============================ hooks ============================ */
export const useConnections = () => useDb((d) => d.connections);
export const useAgents = () => useDb((d) => d.agents);
export const useAgent = (id: string | null) => useDb((d) => d.agents.find((a) => a.id === id) ?? null);
export const useLogs = () => useDb((d) => d.logs);
export const useInvoices = () => useDb((d) => d.invoices);
export const useMembers = () => useDb((d) => d.members);
export const usePrompts = () => useDb((d) => d.prompts);
export const usePrompt = (id: string | null) => useDb((d) => d.prompts.find((p) => p.id === id) ?? null);

/* ============================ mutations ============================ */
export function connectProvider(input: { provider: ProviderId; label: string; key: string }) {
  const id = `cxn_${String(db.connections.length + 1).padStart(2, "0")}`;
  db.connections = [
    ...db.connections,
    { id, provider: input.provider, label: input.label, keyPreview: `${input.key.slice(0, 6)}…${input.key.slice(-4)}`, status: "connected", connected: "just now", monthlySpend: 0, monthlyRequests: 0 },
  ];
  emit();
  return id;
}
export function disconnectProvider(id: string) {
  db.connections = db.connections.filter((c) => c.id !== id);
  db.agents = db.agents.map((a) => (a.connectionId === id ? { ...a, status: "paused" } : a));
  emit();
}
export function setConnectionStatus(id: string, status: Connection["status"]) {
  db.connections = db.connections.map((c) => (c.id === id ? { ...c, status } : c));
  emit();
}

export function saveAgent(input: Omit<Agent, "id" | "updated" | "requests7d" | "requestsDelta" | "spend30d" | "avgLatency" | "errorRate" | "successRate" | "tokens30d" | "series"> & { id?: string }) {
  if (input.id) {
    db.agents = db.agents.map((a) => (a.id === input.id ? { ...a, ...input, updated: "just now" } : a));
    emit();
    return input.id;
  }
  const id = `agt_${String(db.agents.length + 1).padStart(2, "0")}`;
  db.agents = [
    { id, updated: "just now", requests7d: 0, requestsDelta: "—", spend30d: 0, avgLatency: 0, errorRate: 0, successRate: 1, tokens30d: "0", series: Array(14).fill(0.05), ...input },
    ...db.agents,
  ];
  emit();
  return id;
}
export function toggleAgentStatus(id: string) {
  db.agents = db.agents.map((a) => (a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a));
  emit();
}
export function deleteAgent(id: string) {
  db.agents = db.agents.filter((a) => a.id !== id);
  emit();
}

export function inviteMember(input: { name: string; email: string; role: Member["role"] }) {
  const id = `usr_${String(db.members.length + 1).padStart(2, "0")}`;
  db.members = [...db.members, { ...input, id, status: "Invited" }];
  emit();
}
export function removeMember(id: string) {
  db.members = db.members.filter((m) => m.id !== id);
  emit();
}
export function savePrompt(input: Omit<Prompt, "id" | "updated"> & { id?: string }) {
  if (input.id) {
    db.prompts = db.prompts.map((p) => (p.id === input.id ? { ...p, ...input, updated: "just now" } : p));
    emit();
    return input.id;
  }
  const id = `pmt_${String(db.prompts.length + 1).padStart(2, "0")}`;
  db.prompts = [{ ...input, id, updated: "just now" }, ...db.prompts];
  emit();
  return id;
}
export function togglePromptFavorite(id: string) {
  db.prompts = db.prompts.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p));
  emit();
}
export function deletePrompt(id: string) {
  db.prompts = db.prompts.filter((p) => p.id !== id);
  emit();
}

/* ---- back-compat shims for pages not yet revamped ---- */
export const useApiKeys = (): ApiKey[] =>
  useDb((d) =>
    d.connections.map((c) => ({
      id: c.id,
      name: c.label,
      prefix: c.keyPreview,
      created: c.connected,
      lastUsed: "recently",
      scopes: [getProvider(c.provider).name],
      status: c.status === "connected" ? "active" : "revoked",
    }))
  );
// signature-compatible with the old KeysPage (superseded by connectProvider)
export function createApiKey(_name?: string, _scopes?: string[]) {/* no-op shim */}
export function revokeApiKey(id: string) { setConnectionStatus(id, "disabled"); }
export function deleteApiKey(id: string) { disconnectProvider(id); }

export const usage = platform; // old name → platform KPIs

/* ============================ tone maps ============================ */
export const providerTone: Record<Connection["status"], string> = {
  connected: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  error: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  disabled: "bg-fg/10 text-fg/70 dark:text-fg/50",
};
export const agentTone: Record<Agent["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  paused: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};
export const httpTone: Record<number, string> = {
  200: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  400: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  429: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  500: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};
export const invoiceTone: Record<Invoice["status"], string> = {
  Paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Due: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Failed: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};
export const memberTone: Record<Member["status"], string> = {
  Active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Invited: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};
// back-compat: KeysPage uses active/revoked
export const keyStatusTone: Record<"active" | "revoked", string> = {
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  revoked: "bg-fg/10 text-fg/70 dark:text-fg/50",
};

/* ============================ playground completion ============================ */
export function fakeCompletion(prompt: string): string {
  const p = prompt.trim();
  if (!p) return "";
  return `Response to "${p.slice(0, 48)}${p.length > 48 ? "…" : ""}".\n\nSimulated completion routed through your connected provider. In production, Lumina forwards this to the agent's bound model (OpenAI, Anthropic, Google, …) using your key and streams tokens back — the playground UI is wired and ready.`;
}
