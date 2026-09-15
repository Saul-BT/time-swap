import Eyebrow from "../../ui/Eyebrow";
import {
  PanelHeaderLead,
  PanelHeaderRoot,
  PanelHeaderTitle,
} from "./PanelHeader.style";
import { panelHeaderClasses } from "./PanelHeader.util";

export type PanelHeaderProps = {
  /** Already interpolated: "Apartado 1 de 5". */
  step: string;
  title: string;
  lead: string;
  /** Id for the form's `aria-labelledby`. */
  titleId: string;
};

export default function PanelHeader({
  step,
  title,
  lead,
  titleId,
}: PanelHeaderProps) {
  return (
    <PanelHeaderRoot className={panelHeaderClasses.root}>
      <Eyebrow className={panelHeaderClasses.step}>{step}</Eyebrow>
      <PanelHeaderTitle
        className={panelHeaderClasses.title}
        id={titleId}
        variant="h3"
        component="h2"
      >
        {title}
      </PanelHeaderTitle>
      <PanelHeaderLead className={panelHeaderClasses.lead} variant="body1">
        {lead}
      </PanelHeaderLead>
    </PanelHeaderRoot>
  );
}
