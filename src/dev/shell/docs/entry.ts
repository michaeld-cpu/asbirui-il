import type * as React from "react";
import type { Control, ControlValues } from "../component-playground";

/*
  Shared shape for a component-docs registry entry. One file per component
  lives next to this (button.docs.tsx, input.docs.tsx, …) and exports a
  ComponentEntry; ComponentDocs.tsx composes them into the COMPONENTS
  registry that drives the #components/<slug> routes.
*/

export type PropRow = { name: string; type: string; description: string };

export type ComponentEntry = {
  slug: string;
  name: string;
  tagline: string;
  /** Customize-panel controls; their values drive `render` and `code`. */
  controls: Control[];
  /** Live demo for the given control values. */
  render: (v: ControlValues) => React.ReactNode;
  /** Copyable code reflecting the current control values. */
  code: (v: ControlValues) => string;
  props: PropRow[];
  importPath: string;
};
