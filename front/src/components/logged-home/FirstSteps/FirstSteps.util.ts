import type { FirstStepId } from "@/data/types";
import type { LinkTarget } from "@/i18n/routes";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export const FIRST_STEP_IDS: readonly FirstStepId[] = [
  "area",
  "publish",
  "discover",
];

// TODO(routes): the area step points at "#" until profile editing has a route.
export const FIRST_STEP_TARGET: Record<FirstStepId, LinkTarget> = {
  area: "#",
  publish: "createAd",
  discover: "listings",
};

export const firstStepsClasses = createComponentClasses("FirstSteps", [
  "root",
  "main",
  "lead",
  "steps",
  "step",
  "number",
  "stepText",
  "aside",
  "facts",
  "fact",
  "figure",
  "description",
]);
