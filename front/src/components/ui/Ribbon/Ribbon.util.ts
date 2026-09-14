import { createComponentClasses } from "@/lib/mui/componentClasses";
import { structure } from "@/theme/tokens";

/** Palette roles a segment may take. */
export type RibbonTone = "accent" | "ink" | "brake" | "line";

export type RibbonSegment = {
  tone: RibbonTone;
  /** Proportion of the band, expressed as `flex-grow`. Never a fixed width. */
  weight: number;
};

type RibbonSpec = {
  height: number;
  segments: readonly RibbonSegment[];
};

const RIBBON_SPECS = {
  page: {
    height: structure.pageRibbonHeight,
    segments: [
      { tone: "accent", weight: 3 },
      { tone: "ink", weight: 1 },
      { tone: "brake", weight: 2 },
    ],
  },
  offer: {
    height: structure.cardRibbonHeight,
    segments: [{ tone: "accent", weight: 1 }],
  },
  /** The accent starts; the line stands for what is still missing. */
  request: {
    height: structure.cardRibbonHeight,
    segments: [
      { tone: "accent", weight: 1 },
      { tone: "line", weight: 4 },
    ],
  },
  /** Stopped or under review: the only variant the brake leads. */
  stopped: {
    height: structure.cardRibbonHeight,
    segments: [
      { tone: "brake", weight: 3 },
      { tone: "ink", weight: 1 },
      { tone: "line", weight: 4 },
    ],
  },
} satisfies Record<string, RibbonSpec>;

export type RibbonVariant = keyof typeof RIBBON_SPECS;

export function getRibbonSpec(variant: RibbonVariant): RibbonSpec {
  return RIBBON_SPECS[variant];
}

export const ribbonClasses = createComponentClasses("Ribbon", [
  "root",
  "segment",
]);
