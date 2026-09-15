import { structure } from "@/theme/tokens";
import { RibbonRoot, RibbonSegment } from "../Ribbon/Ribbon.style";
import { ribbonClasses } from "../Ribbon/Ribbon.util";
import {
  CompletionMeterRoot,
  CompletionMeterSentence,
} from "./CompletionMeter.style";
import {
  completionMeterClasses,
  getMeterSegments,
} from "./CompletionMeter.util";

export type CompletionMeterProps = {
  done: number;
  total: number;
  /** Full sentence, such as "3 de 5 listos. Presentación por revisar; falta zona." */
  sentence: string;
};

/** Profile completion as a request ribbon: the accent grows with each section done. */
export default function CompletionMeter({
  done,
  total,
  sentence,
}: CompletionMeterProps) {
  const segments = getMeterSegments(done, total);

  return (
    <CompletionMeterRoot className={completionMeterClasses.root}>
      <RibbonRoot
        className={completionMeterClasses.band}
        ownerState={{ height: structure.cardRibbonHeight }}
        role="img"
        aria-label={sentence}
      >
        {segments.map((segment) => (
          <RibbonSegment
            key={segment.tone}
            className={ribbonClasses.segment}
            ownerState={segment}
          />
        ))}
      </RibbonRoot>
      <CompletionMeterSentence
        className={completionMeterClasses.sentence}
        variant="body2"
        component="p"
      >
        {sentence}
      </CompletionMeterSentence>
    </CompletionMeterRoot>
  );
}
