"use client";

import type { ComponentProps, ComponentType, ElementType } from "react";
import { useUnsavedChanges } from "../UnsavedChanges";

type NavigateEvent = { preventDefault: () => void };

export type GuardedLinkProps<L extends ElementType> = ComponentProps<L> & {
  /** The styled `next/link` slot to render; the guard only adds behaviour. */
  link: L;
  href: string;
  onNavigate?: (event: NavigateEvent) => void;
};

/** A link that asks before leaving a section with unsaved changes. */
export default function GuardedLink<L extends ElementType>({
  link,
  href,
  onNavigate,
  ...props
}: GuardedLinkProps<L>) {
  const { guard } = useUnsavedChanges();
  const Link = link as unknown as ComponentType<
    ComponentProps<L> & { onNavigate: (event: NavigateEvent) => void }
  >;

  return (
    <Link
      {...(props as ComponentProps<L>)}
      href={href}
      onNavigate={(event: NavigateEvent) => {
        guard(href, event);
        onNavigate?.(event);
      }}
    />
  );
}
