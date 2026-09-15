"use server";

import type { PresentationActionState } from "@/components/settings/PresentationForm";
import { BIO_MAX_LENGTH, DISPLAY_NAME_MAX_LENGTH } from "@/data/settings";
import { type FieldErrors, finishSave } from "@/lib/forms/actionState";
import { containsContactData } from "@/lib/profile/validation";

// FIXME(api): validates and pretends to save. Replace `finishSave` with
// PATCH /profile/me { displayName, pronouns, bio, privacySettings.reveal.bio }
// (#5) and map its validation errors onto `PresentationErrorId`.
export async function savePresentation(
  _state: PresentationActionState,
  formData: FormData,
): Promise<PresentationActionState> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const bio = String(formData.get("bio") ?? "");
  const fieldErrors: FieldErrors<PresentationActionState> = {};

  if (displayName === "" || displayName.length > DISPLAY_NAME_MAX_LENGTH) {
    fieldErrors.displayName = "displayNameRequired";
  }
  if (bio.length > BIO_MAX_LENGTH) {
    fieldErrors.bio = "bioTooLong";
  } else if (containsContactData(bio)) {
    fieldErrors.bio = "bioContainsContact";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "invalid", fieldErrors };
  }

  return finishSave(formData);
}
