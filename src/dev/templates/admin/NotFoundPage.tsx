import { Button } from "./admin-states";
import { Icons } from "./admin-ui";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-border bg-panel text-fg/55">
          {Icons.alert}
        </div>
        <p className="mt-6 text-5xl font-semibold tracking-tight text-fg">404</p>
        <h1 className="mt-3 text-lg font-semibold text-fg">Page not found</h1>
        <p className="mt-1 text-sm text-fg/55">
          The page you are looking for doesn’t exist or may have been moved.
        </p>
        <div className="mt-6 flex justify-center">
          <a href="#admin">
            <Button variant="primary">Back to dashboard</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
