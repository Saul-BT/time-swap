import Typography from "@mui/material/Typography";
import Eyebrow from "../Eyebrow";
import {
  SectionHeaderIntro,
  SectionHeaderRoot,
  SectionHeaderTopRow,
} from "./SectionHeader.style";
import { sectionHeaderClasses } from "./SectionHeader.util";

export type SectionHeaderProps = {
  /** Rendered as an `h2` either way. */
  title: string;
  intro?: string;
  /** Aligned to the opposite edge of the title. */
  note?: string;
  /** Sets the title as a label instead of a display heading. */
  compact?: boolean;
};

export default function SectionHeader({
  title,
  intro,
  note,
  compact,
}: SectionHeaderProps) {
  return (
    <SectionHeaderRoot
      className={sectionHeaderClasses.root}
      ownerState={{ hasIntro: Boolean(intro) }}
    >
      <SectionHeaderTopRow className={sectionHeaderClasses.topRow}>
        {compact ? (
          <Eyebrow component="h2" color="textPrimary">
            {title}
          </Eyebrow>
        ) : (
          <Typography variant="h2">{title}</Typography>
        )}
        {note ? <Eyebrow>{note}</Eyebrow> : null}
      </SectionHeaderTopRow>
      {intro ? (
        <SectionHeaderIntro
          className={sectionHeaderClasses.intro}
          variant="body1"
        >
          {intro}
        </SectionHeaderIntro>
      ) : null}
    </SectionHeaderRoot>
  );
}
