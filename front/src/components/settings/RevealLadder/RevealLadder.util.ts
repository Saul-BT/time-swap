import type { RevealMoment } from "@/data/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export type RevealLadderCopy = {
  legend: string;
  moments: Record<RevealMoment, string>;
  hints: Record<RevealMoment, string>;
};

export const revealLadderClasses = createComponentClasses("RevealLadder", [
  "root",
  "legend",
  "steps",
  "step",
  "input",
  "label",
  "hint",
]);

/** How long the arrival mark stays before the ladder clears it. */
export const ARRIVAL_MS = 2400;
