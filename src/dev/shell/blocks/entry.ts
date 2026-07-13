import type * as React from "react";

/*
  Shared shapes for the Blocks registry (shadcn's blocks model): a block is a
  FAMILY of numbered variants — login-01, login-02, … — each a full composed
  section with its own preview and copyable code. One file per family lives
  next to this (login.blocks.tsx, …); BlocksDocs.tsx composes them.
*/

export type BlockVariant = {
  /** Stable id shown as the variant's label, e.g. "login-01". */
  id: string;
  title: string;
  description?: string;
  render: () => React.ReactNode;
  code: string;
};

export type BlockEntry = {
  slug: string;
  name: string;
  tagline: string;
  /** span the full 2-col grid in the overview (for inherently wide blocks). */
  wide?: boolean;
  variants: BlockVariant[];
};
