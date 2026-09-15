"use client";

import { Component, type ReactNode } from "react";
import { reportError } from "@/lib/observability/reportError";

export type SlotBoundaryProps = {
  /** Rendered in place of the slot. Degraded, not an apology. */
  fallback: ReactNode;
  children: ReactNode;
};

type SlotBoundaryState = { failed: boolean };

/**
 * Contains a failure inside one piece of a layout. A route's `error.tsx` cannot
 * do this: it renders below the layout, so a layout that throws escapes to the
 * boundary above and takes the whole page with it.
 */
export default class SlotBoundary extends Component<
  SlotBoundaryProps,
  SlotBoundaryState
> {
  state: SlotBoundaryState = { failed: false };

  static getDerivedStateFromError(): SlotBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    reportError(error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
