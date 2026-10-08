import { ChevronRight, Flag } from "lucide-react";
import { Fragment } from "react";
import Icon from "@/components/ui/Icon";
import IconBox from "@/components/ui/IconBox";
import {
  OwnListingsBarChevron,
  OwnListingsBarLine,
  OwnListingsBarManage,
  OwnListingsBarPart,
  OwnListingsBarRoot,
  OwnListingsBarText,
  OwnListingsBarTitle,
  OwnListingsBarWide,
} from "./OwnListingsBar.style";
import {
  type OwnListingsPart,
  ownListingsBarClasses,
} from "./OwnListingsBar.util";

export type OwnListingsBarProps = {
  href: string;
  title: string;
  /** Names each listing; shown from `md` up. */
  wide: readonly OwnListingsPart[];
  /** Counts only; shown on phones. */
  narrow: readonly OwnListingsPart[];
  manageLabel: string;
};

const SEPARATOR = " · ";

function renderParts(parts: readonly OwnListingsPart[], leading: boolean) {
  return parts.map((part, index) => (
    <Fragment key={part.text}>
      {leading || index > 0 ? SEPARATOR : null}
      <OwnListingsBarPart
        className={ownListingsBarClasses.part}
        ownerState={{ tone: part.tone }}
      >
        {part.text}
      </OwnListingsBarPart>
    </Fragment>
  ));
}

export default function OwnListingsBar({
  href,
  title,
  wide,
  narrow,
  manageLabel,
}: OwnListingsBarProps) {
  return (
    <OwnListingsBarRoot className={ownListingsBarClasses.root} href={href}>
      <IconBox icon={Flag} tone="quiet" size="sm" />
      <OwnListingsBarText className={ownListingsBarClasses.text}>
        <OwnListingsBarTitle className={ownListingsBarClasses.title}>
          {title}
        </OwnListingsBarTitle>
        <OwnListingsBarWide className={ownListingsBarClasses.wide}>
          {renderParts(wide, true)}
        </OwnListingsBarWide>
        <OwnListingsBarLine className={ownListingsBarClasses.line}>
          {renderParts(narrow, false)}
        </OwnListingsBarLine>
      </OwnListingsBarText>
      <OwnListingsBarManage className={ownListingsBarClasses.manage}>
        {manageLabel}
      </OwnListingsBarManage>
      <OwnListingsBarChevron className={ownListingsBarClasses.chevron}>
        <Icon icon={ChevronRight} />
      </OwnListingsBarChevron>
    </OwnListingsBarRoot>
  );
}
