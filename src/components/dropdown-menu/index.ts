import {
  DropdownMenu as Root,
  DropdownMenuTrigger as Trigger,
  DropdownMenuContent as Content,
  DropdownMenuItem as Item,
  DropdownMenuLabel as Label,
  DropdownMenuSeparator as Separator,
} from "./dropdown-menu";

// ---- named exports (primary API) ----
// The compound-component pattern: import only the parts you use and compose
// them. Matches Radix / shadcn conventions.
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./dropdown-menu";
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
} from "./dropdown-menu";

// ---- namespace export (convenience) ----
// One import, dotted access — for call sites that prefer fewer lines:
//   import { Dropdown } from "@asbirtech/asbir-ui";
//   <Dropdown.Root><Dropdown.Trigger>…</Dropdown.Trigger>…</Dropdown.Root>
// Same components as above, just re-exposed under short names.
export const Dropdown = {
  Root,
  Trigger,
  Content,
  Item,
  Label,
  Separator,
} as const;
