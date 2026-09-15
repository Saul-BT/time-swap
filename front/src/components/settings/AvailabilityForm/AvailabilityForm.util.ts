import type { AvailabilityCell, RevealMoment } from "@/data/types";
import type { PanelActionState } from "@/lib/forms/actionState";
import { createComponentClasses } from "@/lib/mui/componentClasses";
import type { PanelFormCopy } from "../PanelForm";
import type { RevealLadderCopy } from "../RevealLadder";
import type { WeekGridCopy } from "../WeekGrid";

export type AvailabilityActionState = PanelActionState<never, never>;

export type AvailabilityValues = {
  availability: AvailabilityCell[];
  reveal: RevealMoment;
};

export type AvailabilityCopy = PanelFormCopy & {
  hint: string;
  grid: WeekGridCopy;
  reveal: RevealLadderCopy;
};

export const availabilityFormClasses = createComponentClasses(
  "AvailabilityForm",
  ["hint"],
);
