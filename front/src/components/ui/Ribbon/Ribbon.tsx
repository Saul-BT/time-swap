import { RibbonRoot, RibbonSegment } from "./Ribbon.style";
import {
  getRibbonSpec,
  type RibbonVariant,
  ribbonClasses,
} from "./Ribbon.util";

export type RibbonProps = {
  variant: RibbonVariant;
};

/**
 * Full-bleed band that opens a screen or a card. The signature element of the
 * Relevo system, so it is a component of its own rather than a `Paper` variant.
 */
export default function Ribbon({ variant }: RibbonProps) {
  const { height, segments } = getRibbonSpec(variant);

  return (
    <RibbonRoot
      aria-hidden
      className={ribbonClasses.root}
      ownerState={{ height }}
    >
      {segments.map((segment) => (
        <RibbonSegment
          key={segment.tone}
          className={ribbonClasses.segment}
          ownerState={segment}
        />
      ))}
    </RibbonRoot>
  );
}
