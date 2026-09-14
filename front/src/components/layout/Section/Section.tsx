import type { SxProps, Theme } from "@mui/material/styles";
import { SectionInner, SectionRoot, type SectionTone } from "./Section.style";
import { sectionClasses } from "./Section.util";

export type SectionProps = {
  id?: string;
  children: React.ReactNode;
  tone?: SectionTone;
  /** Drops the top padding when the previous block already closed the gap. */
  flushTop?: boolean;
  flushBottom?: boolean;
  /** Layout of the inner content only. Tone and rhythm are not overridable. */
  sx?: SxProps<Theme>;
};

/** A toned band with a container inside. Owns the vertical rhythm of a page. */
export default function Section({
  id,
  children,
  tone = "plain",
  flushTop = false,
  flushBottom = false,
  sx,
}: SectionProps) {
  return (
    <SectionRoot className={sectionClasses.root} id={id} ownerState={{ tone }}>
      <SectionInner
        className={sectionClasses.inner}
        ownerState={{ top: !flushTop, bottom: !flushBottom }}
        sx={sx}
      >
        {children}
      </SectionInner>
    </SectionRoot>
  );
}
