"use server";

import type { AvailabilityActionState } from "@/components/settings/AvailabilityForm";
import { finishSave } from "@/lib/forms/actionState";

// FIXME(api): pretends to save. Replace `finishSave` with
// PATCH /profile/me { availability, privacySettings.reveal.availability } (#5).
// Cells and reveal moment are not checked here: the API owns both scales.
export async function saveAvailability(
  _state: AvailabilityActionState,
  formData: FormData,
): Promise<AvailabilityActionState> {
  return finishSave(formData);
}
