"use server";

import type { SkillsActionState } from "@/components/settings/SkillsForm";
import { INTERESTS_CATALOG, SKILLS_CATALOG } from "@/data/catalog";
import type { CatalogEntry } from "@/data/types";
import { saveProfile } from "@/lib/api/profile";
import type { FieldErrors } from "@/lib/forms/actionState";

function parseIds(
  formData: FormData,
  field: string,
  catalog: readonly CatalogEntry[],
): string[] {
  return String(formData.get(field) ?? "")
    .split(",")
    .filter((id) => catalog.some((entry) => entry.id === id));
}

// FIXME(api): checks that at least one skill and one interest were chosen, then
// `saveProfile` will send PATCH /profile/me { skills, interests,
// privacySettings.reveal.skills, privacySettings.reveal.interests } (#5). The
// catalogues and the reveal scale are the API's to enforce.
export async function saveSkills(
  _state: SkillsActionState,
  formData: FormData,
): Promise<SkillsActionState> {
  const fieldErrors: FieldErrors<SkillsActionState> = {};

  if (parseIds(formData, "skills", SKILLS_CATALOG).length === 0) {
    fieldErrors.skills = "skillsRequired";
  }
  if (parseIds(formData, "interests", INTERESTS_CATALOG).length === 0) {
    fieldErrors.interests = "interestsRequired";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "invalid", fieldErrors };
  }

  return saveProfile(formData);
}
