import * as React from "react";
import { PageHeader, Button, Badge, inputCls, Field, Modal, CodeBlock } from "./ai-states";
import { Icons } from "./ai-ui";
import { MODELS, fakeCompletion, type ChatMessage } from "./store";

type Turn = ChatMessage & { tokens?: number; latencyMs?: number };

const chatModels = MODELS.filter((m) => m.kind === "chat");

export function PlaygroundPage() {
  const [messages, setMessages] = React.useState<Turn[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm Aurora. Ask me anything, or drop in a system prompt on the right to shape my behavior. This is a sandbox, so nothing here is saved.",
      tokens: 46,
      latencyMs: 520,
    },
  ]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);

  // settings (cosmetic but controlled)
  const [model, setModel] = React.useState(chatModels[0]?.id ?? "");
  const [temperature, setTemperature] = React.useState(0.7);
  const [maxTokens, setMaxTokens] = React.useState(1024);
  const [system, setSystem] = React.useState("You are a helpful, concise assistant.");
  const [showCode, setShowCode] = React.useState(false);
  const [codeLang, setCodeLang] = React.useState<"python" | "curl">("python");

  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    const reply = fakeCompletion(text);
    const tokens = Math.floor(reply.length / 3.6) + 40;
    const latencyMs = 480 + Math.floor(Math.random() * 520);
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: reply, tokens, latencyMs }]);
      setSending(false);
    }, 260);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => {
    setTemperature(0.7);
    setMaxTokens(1024);
    setSystem("You are a helpful, concise assistant.");
    setModel(chatModels[0]?.id ?? "");
  };

  const modelLabel = MODELS.find((m) => m.id === model)?.label ?? model;

  const pythonCode = `from lumina import Lumina

client = Lumina(api_key="sk-live-…")

resp = client.chat.completions.create(
    model="${model}",
    temperature=${temperature},
    max_tokens=${maxTokens},
    messages=[
        {"role": "system", "content": ${JSON.stringify(system)}},
        {"role": "user", "content": "Hello, Aurora!"},
    ],
)

print(resp.choices[0].message.content)`;

  const curlCode = `curl https://api.lumina.ai/v1/chat/completions \\
  -H "Authorization: Bearer $LUMINA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "temperature": ${temperature},
    "max_tokens": ${maxTokens},
    "messages": [
      {"role": "system", "content": ${JSON.stringify(system)}},
      {"role": "user", "content": "Hello, Aurora!"}
    ]
  }'`;

  return (
    <div>
      <PageHeader
        title="Playground"
        subtitle="Prototype prompts against the Aurora model family in a live sandbox."
        action={
          <Button variant="secondary" onClick={() => setShowCode(true)}>
            {Icons.copy}
            View code
          </Button>
        }
      />

      <div className="flex flex-col gap-5 lg:flex-row">
        {/* LEFT — chat */}
        <div className="flex min-h-[560px] flex-1 flex-col overflow-hidden rounded-xl border border-border bg-panel">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2 text-sm text-fg/60">
              <span className="ai-accent">{Icons.playground}</span>
              <span className="font-medium text-fg">{modelLabel}</span>
              <span className="text-fg/55 dark:text-fg/35">·</span>
              <span>temp {temperature.toFixed(2)}</span>
            </div>
            <Badge className="ai-bg-accent-soft ai-accent">Sandbox</Badge>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[80%] rounded-xl rounded-br-sm ai-bg-accent-soft px-3.5 py-2.5 text-sm text-fg">
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start gap-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ai-bg-accent-soft ai-accent text-[11px]">
                    {Icons.logo}
                  </span>
                  <div className="max-w-[80%]">
                    <div className="rounded-xl rounded-tl-sm border border-border bg-canvas px-3.5 py-2.5 text-sm text-fg">
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    </div>
                    {m.tokens != null && m.latencyMs != null && (
                      <p className="mt-1.5 pl-1 text-[11px] text-fg/60 dark:text-fg/40">
                        {m.tokens} tokens · {m.latencyMs}ms · {modelLabel}
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
            {sending && (
              <div className="flex justify-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ai-bg-accent-soft ai-accent text-[11px]">
                  {Icons.logo}
                </span>
                <div className="flex items-center gap-1 rounded-xl rounded-tl-sm border border-border bg-canvas px-3.5 py-3">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fg/40" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fg/40 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fg/40 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          {/* composer */}
          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder="Send a message…  (Enter to send, Shift+Enter for newline)"
                className={`${inputCls} max-h-40 resize-none`}
              />
              <Button onClick={send} disabled={!input.trim() || sending} className="shrink-0">
                {Icons.send}
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT — settings */}
        <aside className="w-full shrink-0 space-y-4 rounded-xl border border-border bg-panel p-4 lg:w-72">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">Parameters</h2>
            <Button variant="ghost" size="sm" onClick={reset}>
              Reset
            </Button>
          </div>

          <Field label="Model">
            <select value={model} onChange={(e) => setModel(e.target.value)} className={inputCls}>
              {chatModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} · {m.context}
                </option>
              ))}
            </select>
          </Field>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-fg">Temperature</span>
              <span className="rounded-md bg-overlay/[0.06] px-1.5 py-0.5 text-xs tabular-nums text-fg/70">
                {temperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-[rgb(var(--accent))]"
            />
            <div className="mt-1 flex justify-between text-[11px] text-fg/60 dark:text-fg/40">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          <Field label="Max tokens" hint="Upper bound on the response length.">
            <input
              type="number"
              min={1}
              max={8192}
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className={inputCls}
            />
          </Field>

          <Field label="System prompt" hint="Sets the assistant's behavior for this session.">
            <textarea
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              rows={5}
              className={`${inputCls} resize-none`}
            />
          </Field>
        </aside>
      </div>

      <Modal open={showCode} title="View code" onClose={() => setShowCode(false)}>
        <div className="mb-3 inline-flex rounded-lg border border-border p-0.5">
          {(["python", "curl"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setCodeLang(l)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                codeLang === l ? "ai-bg-accent text-white" : "text-fg/60 hover:text-fg"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <CodeBlock code={codeLang === "python" ? pythonCode : curlCode} lang={codeLang} />
        <p className="mt-3 text-xs text-fg/65 dark:text-fg/45">Reflects your current model and parameter selections.</p>
      </Modal>
    </div>
  );
}
