"use client";

import { SUGGESTION_COUNT } from "@/data/settings";
import type { CatalogEntry, SkillsErrorId } from "@/data/types";
import { space } from "@/theme/tokens";
import FormField, { formFieldIds } from "../../ui/FormField";
import CatalogPicker from "../CatalogPicker";
import PanelForm from "../PanelForm";
import RevealLadder from "../RevealLadder";
import { type PanelSectionFormProps, usePanelForm } from "../usePanelForm";
import {
  SKILLS_FIELD,
  type SkillsCopy,
  type SkillsFieldId,
  type SkillsValues,
} from "./SkillsForm.util";

export type SkillsFormProps = PanelSectionFormProps<
  SkillsValues,
  SkillsFieldId,
  SkillsErrorId,
  SkillsCopy
> & {
  skillsCatalog: readonly CatalogEntry[];
  interestsCatalog: readonly CatalogEntry[];
  skillsRevealId: string;
  interestsRevealId: string;
};

const FOCUS_ORDER = [["skills", SKILLS_FIELD.skills]] as const;

function sameIds(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

function isDirty(values: SkillsValues, saved: SkillsValues): boolean {
  return (
    !sameIds(values.skills, saved.skills) ||
    !sameIds(values.interests, saved.interests) ||
    values.skillsReveal !== saved.skillsReveal ||
    values.interestsReveal !== saved.interestsReveal
  );
}

export default function SkillsForm({
  action,
  initial,
  skillsCatalog,
  interestsCatalog,
  copy,
  titleId,
  skillsRevealId,
  interestsRevealId,
  nextHref,
}: SkillsFormProps) {
  const form = usePanelForm({
    action,
    initial,
    isDirty,
    focusOrder: FOCUS_ORDER,
  });
  const { values, setValues, pending, fieldErrors } = form;

  const skillsError = fieldErrors.skills
    ? copy.errors[fieldErrors.skills]
    : undefined;
  const skillsIds = formFieldIds(SKILLS_FIELD.skills);
  const interestsIds = formFieldIds(SKILLS_FIELD.interests);

  return (
    <PanelForm
      form={form}
      copy={copy}
      titleId={titleId}
      nextHref={nextHref}
      gap={space.sm}
    >
      <FormField
        htmlFor={SKILLS_FIELD.skills}
        label={copy.offerLabel}
        hint={copy.offerHint}
        error={skillsError}
      >
        <CatalogPicker
          id={SKILLS_FIELD.skills}
          name="skills"
          catalog={skillsCatalog}
          value={values.skills}
          onChange={(skills) => setValues({ ...values, skills })}
          copy={copy.picker}
          suggestionCount={SUGGESTION_COUNT}
          emptyMessage={copy.emptyOffer}
          disabled={pending}
          describedBy={
            skillsError
              ? `${skillsIds.error} ${skillsIds.hint}`
              : skillsIds.hint
          }
        />
      </FormField>

      <RevealLadder
        id={skillsRevealId}
        name="reveal.skills"
        copy={copy.skillsReveal}
        value={values.skillsReveal}
        onChange={(skillsReveal) => setValues({ ...values, skillsReveal })}
      />

      <FormField
        htmlFor={SKILLS_FIELD.interests}
        label={copy.wantLabel}
        hint={copy.wantHint}
      >
        <CatalogPicker
          id={SKILLS_FIELD.interests}
          name="interests"
          catalog={interestsCatalog}
          value={values.interests}
          onChange={(interests) => setValues({ ...values, interests })}
          copy={copy.picker}
          suggestionCount={SUGGESTION_COUNT}
          disabled={pending}
          describedBy={interestsIds.hint}
        />
      </FormField>

      <RevealLadder
        id={interestsRevealId}
        name="reveal.interests"
        copy={copy.interestsReveal}
        value={values.interestsReveal}
        onChange={(interestsReveal) =>
          setValues({ ...values, interestsReveal })
        }
      />
    </PanelForm>
  );
}
