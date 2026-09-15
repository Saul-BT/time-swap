"use server";

import type { SkillsActionState } from "@/components/settings/SkillsForm";
import { SKILLS_CATALOG } from "@/data/catalog";
import type { CatalogEntry } from "@/data/types";
import { finishSave } from "@/lib/forms/actionState";

function parseIds(
  formData: FormData,
  field: string,
  catalog: readonly CatalogEntry[],
): string[] {
  return String(formData.get(field) ?? "")
    .split(",")
    .filter((id) => catalog.some((entry) => entry.id === id));
}

// FIXME(api): checks that at least one skill was chosen, then pretends to save.
// Replace `finishSave` with PATCH /profile/me { skills, interests,
// privacySettings.reveal.skills, privacySettings.reveal.interests } (#5). The
// catalogues and the reveal scale are the API's to enforce.
export async function saveSkills(
  _state: SkillsActionState,
  formData: FormData,
): Promise<SkillsActionState> {
  const skills = parseIds(formData, "skills", SKILLS_CATALOG);

  if (skills.length === 0) {
    return { status: "invalid", fieldErrors: { skills: "skillsRequired" } };
  }

  return finishSave(formData);
}
