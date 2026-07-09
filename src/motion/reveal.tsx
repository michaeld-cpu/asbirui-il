import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

export interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction the content travels from as it reveals. Default "up". */
  direction?: RevealDirection;
  /** Distance in px the content travels. Default 16. */
  distance?: number;
  /** Seconds to delay the animation. Default 0. */
  delay?: number;
  /** Seconds the animation runs. Default 0.5. */
  duration?: number;
  /** Reveal once (default) or every time it re-enters the viewport. */
  once?: boolean;
  /** How much of the element must be visible before revealing (0–1). Default 0.2. */
  amount?: number;
  as?: React.ElementType;
}

const offset = (dir: RevealDirection, d: number) => {
  switch (dir) {
    case "up": return { y: d };
    case "down": return { y: -d };
    case "left": return { x: d };
    case "right": return { x: -d };
    default: return {};
  }
};

/**
 * Reveal — fades and slides its children into view as they scroll into the
 * viewport. Honors `prefers-reduced-motion` (renders visible, no movement).
 */
export function Reveal({
  direction = "up",
  distance = 16,
  delay = 0,
  duration = 0.5,
  once = true,
  amount = 0.2,
  as = "div",
  children,
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion(as as "div");

  if (reduced) {
    const Tag = as as "div";
    return <Tag {...rest}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, ...offset(direction, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...(rest as object)}
    >
      {children}
    </MotionTag>
  );
}

/* shared variants for the Stagger container/items */
const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export interface StaggerProps extends React.HTMLAttributes<HTMLDivElement> {
  once?: boolean;
  amount?: number;
  /** Seconds between each child's entrance. Default 0.08. */
  gap?: number;
  as?: React.ElementType;
}

/**
 * Stagger — reveals its <StaggerItem> children one after another as the group
 * scrolls into view. Pair with StaggerItem for each animated child.
 */
export function Stagger({
  once = true,
  amount = 0.2,
  gap = 0.08,
  as = "div",
  children,
  ...rest
}: StaggerProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion(as as "div");

  if (reduced) {
    const Tag = as as "div";
    return <Tag {...rest}>{children}</Tag>;
  }

  return (
    <MotionTag
      variants={{
        ...containerVariants,
        show: { transition: { staggerChildren: gap, delayChildren: 0.05 } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      {...(rest as object)}
    >
      {children}
    </MotionTag>
  );
}

export interface StaggerItemProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

/** A single item inside a <Stagger>. */
export function StaggerItem({ as = "div", children, ...rest }: StaggerItemProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion(as as "div");

  if (reduced) {
    const Tag = as as "div";
    return <Tag {...rest}>{children}</Tag>;
  }

  return (
    <MotionTag variants={itemVariants} {...(rest as object)}>
      {children}
    </MotionTag>
  );
}
 