# Admin dashboard template

A generic, Filament-style admin panel skeleton — layout shell + dashboard,
resource list, and resource form pages. It's intentionally **basic**: the
structure and the wiring are the product. Copy the folder, swap the sample
data, restyle via tokens, and grow it into your app.

## What's here

| File | Role |
| --- | --- |
| `AdminTemplate.tsx` | Entry — picks the page from the `sub` path. Swap this for your real router. |
| `AdminLayout.tsx` | Collapsible grouped sidebar + topbar (search / notifications / user). |
| `DashboardPage.tsx` | Stat widgets + activity area chart + recent-activity feed. |
| `ProjectsPage.tsx` | Resource index — search, filter chips, table, progress, pagination, row actions. |
| `ProjectFormPage.tsx` | Resource create/edit — sectioned form, inputs, save/cancel. |
| `admin-data.ts` | All sample data + status tones. **Replace with your data source.** |
| `admin-ui.tsx` | Shared icons, the area chart, and small primitives. |

## Adopting it

1. **Copy** `src/dev/templates/admin/` into your project.
2. **Routing** — this repo drives it with a hash sub-path (`#admin`,
   `#admin/projects`, `#admin/projects/new`) via `AdminTemplate`. Replace
   `AdminTemplate.tsx`'s switch with your router (React Router / TanStack /
   Next app dir); every page and the layout are router-agnostic.
3. **Data** — everything in `admin-data.ts` is placeholder. Point the pages at
   real fetches / server data. Form inputs are presentational — wire them to
   your form library (react-hook-form, etc.).
4. **Theming** — built entirely on the shell's semantic tokens
   (`canvas` / `panel` / `border` / `fg` / `overlay` / `solid`). It inherits
   light + dark automatically; change the tokens to rebrand.

## Not included (on purpose)

Auth, real data fetching, form validation, and toasts are left to the adopter —
this is a skeleton, not a framework.
