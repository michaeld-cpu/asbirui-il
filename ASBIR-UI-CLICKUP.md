# AsbirUI — ClickUp Project Setup

> Paste this into a ClickUp **Doc**, and use the "Task breakdown" section to create
> **Lists → Tasks → Subtasks**. Each `- [ ]` line is meant to become a ClickUp task.

---

## 1. Project Overview

**AsbirUI** is a React-first component library, owned by **AsbirTech**, that gives
developers a solid *foundation* for building accessible, good-looking user interfaces.
It sits in the same space as **Radix UI**, **shadcn/ui**, and **Hero UI** — combining
accessible headless primitives with a clean, themeable default style you can adopt as-is
or fully own.

**Tech stack**
- **React 18+** with full **TypeScript** types
- **Tailwind CSS** for styling and design tokens
- **Radix-style accessible primitives** (keyboard nav, ARIA, focus management)
- Ships as **copy-in components** (own the source, like shadcn) *and* an installable
  package for teams that prefer a dependency

---

## 2. Vision & Goals

- **Who it's for:** React developers and product teams who want production-quality,
  accessible components without fighting a heavy, opinionated framework.
- **What makes it different:**
  - Accessibility is built in, not bolted on.
  - You own the code — components copy into your project so you can customize freely.
  - A coherent design system (tokens + theming) so everything looks like one product.
  - Lightweight, tree-shakeable, no runtime lock-in.
- **North star:** "The dependable base layer every React UI can build on."

---

## 3. ClickUp Space Setup

**Space name:** `AsbirUI`

**Folder / List layout**
- 📁 **Foundations** (repo, tooling, build)
- 📁 **Design System** (tokens, theming)
- 📁 **Components** (one list, tasks per component)
- 📁 **Docs Site**
- 📁 **Release & Publishing**

**Custom statuses (Board view)**
`Backlog` → `Ready` → `In Progress` → `In Review` → `Done`

**Priorities:** Urgent · High · Normal · Low

**Suggested tags:** `a11y`, `breaking-change`, `good-first-issue`, `design`, `docs`,
`ci`, `component`

---

## 4. Task Breakdown (Lists → Tasks)

### List: Foundations
- [ ] Create GitHub repository and set license (MIT)
- [ ] Initialize project (React + TypeScript + Tailwind)
- [ ] Configure ESLint + Prettier + commit hooks
- [ ] Set up build pipeline (tsup / Vite library mode)
- [ ] Configure package exports and `package.json` metadata
- [ ] Set up monorepo or single-package structure (decision task)
- [ ] Add base CI (lint, typecheck, build) — GitHub Actions

### List: Design System
- [ ] Define design tokens (color, spacing, radius, shadow, typography)
- [ ] Implement theming (light/dark + `data-theme` support)
- [ ] Create Tailwind preset that exposes the tokens
- [ ] Document color scales and semantic tokens
- [ ] Define accessibility baseline (contrast, focus rings, motion)

### List: Components (one task each, subtasks = build / a11y / tests / docs)
- [ ] Button
- [ ] Input / Textarea
- [ ] Select
- [ ] Checkbox / Radio / Switch
- [ ] Dialog / Modal
- [ ] Dropdown Menu
- [ ] Tooltip / Popover
- [ ] Tabs
- [ ] Toast / Notifications
- [ ] Accordion
- [ ] Card
- [ ] Table

### List: Docs Site
- [ ] Choose docs framework (Next.js / Astro / Nextra)
- [ ] Set up docs site scaffold
- [ ] Component API reference pages
- [ ] Live examples / code previews
- [ ] Installation & theming guides
- [ ] Deploy docs (Vercel / Netlify)

### List: Release & Publishing
- [ ] Reserve npm name / scope (`asbir-ui` now; migrate to `@asbirtech/*` once the org exists)
- [ ] Create the `asbirtech` npm organization and transfer the package to it
- [ ] Set up versioning (Changesets)
- [ ] Publish `v0.1.0` alpha to npm
- [ ] Write CONTRIBUTING.md and issue templates
- [ ] Set up release CI (automated publish on tag)

---

## 5. Milestones (ClickUp Milestones)

| Milestone | Goal |
|-----------|------|
| **v0.1 — Alpha** | Foundations + design tokens + 3–4 core components, published to npm |
| **v0.5 — Beta** | Full core component set + docs site live |
| **v1.0 — Stable** | Complete component library, stable API, accessibility audited, launched |

---

## 6. Naming & Branding

- **Name:** AsbirUI ✅ (AsbirTech-owned; reflects the owning company)
- **npm:** `asbir-ui` (single package now) → **`@asbirtech/*`** (scoped, recommended once
  the `asbirtech` org is created — enables company ownership + multi-package)
- **Ownership:** Belongs to **AsbirTech**. Currently published under the author's personal
  npm account as an interim step; transfer to the `asbirtech` org once created.
- **GitHub:** rename repo to `asbirtech/asbir-ui` (currently `michaeld-cpu/bedrockui`)
- **Domain ideas:** `asbir-ui.dev` / `asbirui.com`
- **Tagline:** *"The dependable foundation for React UIs."*
