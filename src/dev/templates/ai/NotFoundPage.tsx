import { Button } from "./ai-states";
import { Icons } from "./ai-ui";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ai-bg-accent-soft ai-accent">
          {Icons.alert}
        </div>

        <div className="mt-8 text-7xl font-semibold tracking-tight text-fg">404</div>

        <h1 className="mt-4 text-xl font-semibold text-fg">Page not found</h1>

        <p className="mt-3 text-sm leading-relaxed text-fg/70 dark:text-fg/55">
          The page you're looking for doesn't exist, was moved, or the link is
          out of date. Head back to your Lumina AI console to keep going.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <a href="#ai">
            <Button variant="primary" size="md">
              Back to console
            </Button>
          </a>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          Lumina AI · Aurora model family
        </div>
      </div>
    </div>
  );
}
