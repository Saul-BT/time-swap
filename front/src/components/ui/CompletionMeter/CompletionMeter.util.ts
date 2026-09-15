import { createComponentClasses } from "@/lib/mui/componentClasses";
import type { RibbonSegment } from "../Ribbon/Ribbon.util";

/** Accent for what is done, line for what is still missing; weights, never widths. */
export function getMeterSegments(
  done: number,
  total: number,
): readonly RibbonSegment[] {
  const clamped = Math.min(Math.max(done, 0), total);

  if (clamped === 0) {
    return [{ tone: "line", weight: 1 }];
  }
  if (clamped === total) {
    return [{ tone: "accent", weight: 1 }];
  }

  return [
    { tone: "accent", weight: clamped },
    { tone: "line", weight: total - clamped },
  ];
}

export const completionMeterClasses = createComponentClasses(
  "CompletionMeter",
  ["root", "band", "sentence"],
);
