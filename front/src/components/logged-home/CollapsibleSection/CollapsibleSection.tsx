"use client";

import { useId, useState } from "react";
import BoardSectionHead from "../BoardSectionHead";
import { CollapsibleSectionList } from "./CollapsibleSection.style";
import { collapsibleSectionClasses } from "./CollapsibleSection.util";

export type CollapsibleSectionProps = {
  title: string;
  count: number;
  /** `li` elements. */
  children: React.ReactNode;
};

/** A titled list that folds away on phones and stays open from `md` up. */
export default function CollapsibleSection({
  title,
  count,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(true);
  const id = useId();

  return (
    <section
      className={collapsibleSectionClasses.root}
      aria-labelledby={`${id}-title`}
    >
      <BoardSectionHead
        id={`${id}-title`}
        title={title}
        count={count}
        collapsible={{
          open,
          controls: `${id}-list`,
          onToggle: () => setOpen((current) => !current),
        }}
      />
      <CollapsibleSectionList
        className={collapsibleSectionClasses.list}
        id={`${id}-list`}
        ownerState={{ open }}
      >
        {children}
      </CollapsibleSectionList>
    </section>
  );
}
