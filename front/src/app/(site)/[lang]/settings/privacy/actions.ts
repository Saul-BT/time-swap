"use server";

import type { PrivacyActionState } from "@/components/settings/PrivacyForm";
import { finishSave } from "@/lib/forms/actionState";

// FIXME(api): pretends to save. Replace `finishSave` with
// PATCH /profile/me { visibleToVisitors, searchable } (#5).
export async function savePrivacy(
  _state: PrivacyActionState,
  formData: FormData,
): Promise<PrivacyActionState> {
  return finishSave(formData);
}
