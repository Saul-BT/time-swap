import { ChevronDown } from "lucide-react";
import Icon from "@/components/ui/Icon";
import {
  BoardSectionHeadChevron,
  BoardSectionHeadCount,
  BoardSectionHeadEnd,
  BoardSectionHeadRoot,
  BoardSectionHeadStatic,
  BoardSectionHeadTitle,
  BoardSectionHeadToggle,
} from "./BoardSectionHead.style";
import { boardSectionHeadClasses } from "./BoardSectionHead.util";

export type BoardSectionHeadProps = {
  /** Referenced by the section's `aria-labelledby`. */
  id: string;
  title: string;
  count?: number;
  /** Controls aligned to the end of the rule, such as a sort switch. */
  end?: React.ReactNode;
  /** Turns the title into a disclosure button on phones. */
  collapsible?: { open: boolean; controls: string; onToggle: () => void };
};

/** `h3`-sized `h2` over a 2 px ink rule, with an optional count in muted figures. */
export default function BoardSectionHead({
  id,
  title,
  count,
  end,
  collapsible,
}: BoardSectionHeadProps) {
  const label = (
    <>
      {title}
      {count === undefined ? null : (
        <BoardSectionHeadCount className={boardSectionHeadClasses.count}>
          {count}
        </BoardSectionHeadCount>
      )}
    </>
  );

  return (
    <BoardSectionHeadRoot className={boardSectionHeadClasses.root}>
      <BoardSectionHeadTitle
        className={boardSectionHeadClasses.title}
        id={id}
        variant="h3"
        component="h2"
      >
        {collapsible ? (
          <>
            <BoardSectionHeadToggle
              className={boardSectionHeadClasses.toggle}
              type="button"
              aria-expanded={collapsible.open}
              aria-controls={collapsible.controls}
              onClick={collapsible.onToggle}
            >
              {label}
              <BoardSectionHeadChevron
                className={boardSectionHeadClasses.chevron}
                ownerState={{ open: collapsible.open }}
              >
                <Icon icon={ChevronDown} />
              </BoardSectionHeadChevron>
            </BoardSectionHeadToggle>
            <BoardSectionHeadStatic className={boardSectionHeadClasses.static}>
              {label}
            </BoardSectionHeadStatic>
          </>
        ) : (
          label
        )}
      </BoardSectionHeadTitle>
      {end ? (
        <BoardSectionHeadEnd className={boardSectionHeadClasses.end}>
          {end}
        </BoardSectionHeadEnd>
      ) : null}
    </BoardSectionHeadRoot>
  );
}
