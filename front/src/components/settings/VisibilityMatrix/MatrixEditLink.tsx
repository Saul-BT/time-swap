"use client";

import { Pencil } from "lucide-react";
import type { ReactNode } from "react";
import Icon from "../../ui/Icon";
import GuardedLink from "../GuardedLink";
import { VisibilityMatrixEditLink } from "./VisibilityMatrix.style";
import { visibilityMatrixClasses } from "./VisibilityMatrix.util";

export type MatrixEditLinkProps = {
  href: string;
  /** Accessible name; it opens with the visible label so both agree. */
  label: string;
  children: ReactNode;
};

export default function MatrixEditLink({
  href,
  label,
  children,
}: MatrixEditLinkProps) {
  return (
    <GuardedLink
      link={VisibilityMatrixEditLink}
      className={visibilityMatrixClasses.edit}
      href={href}
      aria-label={label}
    >
      {children}
      <Icon icon={Pencil} size="sm" />
    </GuardedLink>
  );
}
