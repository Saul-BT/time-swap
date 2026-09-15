import type { PresentationErrorId, RevealMoment } from "@/data/types";
import type { PanelActionState } from "@/lib/forms/actionState";
import { createComponentClasses } from "@/lib/mui/componentClasses";
import type { PanelFormCopy } from "../PanelForm";
import type { RevealLadderCopy } from "../RevealLadder";

export const PRESENTATION_FIELD = {
  displayName: "presentation-display-name",
  pronouns: "presentation-pronouns",
  bio: "presentation-bio",
  bioCount: "presentation-bio-count",
} as const;

export type PresentationFieldId = "displayName" | "bio";

export type PresentationActionState = PanelActionState<
  PresentationFieldId,
  PresentationErrorId
>;

export type PresentationValues = {
  displayName: string;
  pronouns: string;
  bio: string;
  reveal: RevealMoment;
};

/** Every string the client form shows, resolved by the server page. */
export type PresentationCopy = PanelFormCopy & {
  photo: string;
  changePhoto: string;
  displayName: string;
  displayNameHint: string;
  pronouns: string;
  optional: string;
  pronounsPlaceholder: string;
  bio: string;
  counter: string;
  errors: Record<PresentationErrorId, string>;
  reveal: RevealLadderCopy;
};

export const presentationFormClasses = createComponentClasses(
  "PresentationForm",
  ["identity", "avatar", "photoAction"],
);
