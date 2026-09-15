import type { RevealMoment, SkillsErrorId } from "@/data/types";
import type { PanelActionState } from "@/lib/forms/actionState";
import type { CatalogPickerCopy } from "../CatalogPicker";
import type { PanelFormCopy } from "../PanelForm";
import type { RevealLadderCopy } from "../RevealLadder";

export const SKILLS_FIELD = {
  skills: "skills-offer",
  interests: "skills-want",
} as const;

export type SkillsFieldId = "skills";

export type SkillsActionState = PanelActionState<SkillsFieldId, SkillsErrorId>;

export type SkillsValues = {
  skills: string[];
  interests: string[];
  skillsReveal: RevealMoment;
  interestsReveal: RevealMoment;
};

export type SkillsCopy = PanelFormCopy & {
  offerLabel: string;
  offerHint: string;
  wantLabel: string;
  wantHint: string;
  emptyOffer: string;
  picker: CatalogPickerCopy;
  errors: Record<SkillsErrorId, string>;
  skillsReveal: RevealLadderCopy;
  interestsReveal: RevealLadderCopy;
};
