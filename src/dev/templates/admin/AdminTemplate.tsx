import { AdminLayout } from "./AdminLayout";
import { DashboardPage } from "./DashboardPage";
import { ProjectsPage } from "./ProjectsPage";
import { ProjectDetailPage } from "./ProjectDetailPage";
import { ProjectFormPage } from "./ProjectFormPage";
import { MembersPage } from "./MembersPage";
import { SettingsPage } from "./SettingsPage";
import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";
import { NotFoundPage } from "./NotFoundPage";
import { ToastProvider } from "./admin-states";

/*
  Admin template router. Receives the admin sub-path (everything after
  "#admin/") and renders the matching page. Auth screens and 404 render
  standalone (no chrome); everything else renders inside AdminLayout.

  This switch is the ONLY routing glue — adopters swap it for their real router
  (React Router / TanStack / Next app dir) and keep every page + the layout
  unchanged. Route table:
    ""                       -> Dashboard
    projects                 -> Projects list
    projects/new             -> Project create form
    projects/:id             -> Project detail
    projects/:id/edit        -> Project edit form
    members                  -> Members list
    settings|settings/:tab   -> Settings (tabbed)
    login | signup           -> Auth (standalone)
    (anything else)          -> 404
*/
export function AdminTemplate({ sub }: { sub: string }) {
  // Standalone routes (no admin chrome).
  if (sub === "login") return withToast(<LoginPage />);
  if (sub === "signup") return withToast(<SignupPage />);

  const parts = sub.split("/").filter(Boolean);
  let page: React.ReactNode;
  let notFound = false;

  if (sub === "") {
    page = <DashboardPage />;
  } else if (parts[0] === "projects") {
    if (parts.length === 1) {
      page = <ProjectsPage />;
    } else if (parts[1] === "new") {
      page = <ProjectFormPage />;
    } else if (parts.length === 2) {
      page = <ProjectDetailPage id={parts[1]} />;
    } else if (parts.length === 3 && parts[2] === "edit") {
      page = <ProjectFormPage id={parts[1]} />;
    } else {
      notFound = true;
    }
  } else if (parts[0] === "members" && parts.length === 1) {
    page = <MembersPage />;
  } else if (parts[0] === "settings") {
    page = <SettingsPage tab={parts[1] ?? ""} />;
  } else {
    notFound = true;
  }

  if (notFound) return withToast(<NotFoundPage />);

  return withToast(<AdminLayout sub={sub}>{page}</AdminLayout>);
}

// Toasts are used across pages; provider wraps the whole template once.
function withToast(node: React.ReactNode) {
  return <ToastProvider>{node}</ToastProvider>;
}
