import React from "react";
import ReactDOM from "react-dom/client";
import { Button } from "@/index";

function App() {
  const [dark, setDark] = React.useState(false);

  return (
    <div
      data-theme={dark ? "dark" : "light"}
      className="min-h-screen bg-background text-foreground p-10"
    >
      <div className="mx-auto max-w-xl space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AsbirUI</h1>
          <Button variant="outline" size="sm" onClick={() => setDark((d) => !d)}>
            Toggle {dark ? "light" : "dark"}
          </Button>
        </header>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Button variants
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
