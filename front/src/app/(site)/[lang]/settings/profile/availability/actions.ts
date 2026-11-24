"use server";

import type { AvailabilityActionState } from "@/components/settings/AvailabilityForm";
import { saveProfile } from "@/lib/api/profile";

// FIXME(api): `saveProfile` will send
// PATCH /profile/me { availability, privacySettings.reveal.availability } (#5).
// Cells and reveal moment are not checked here: the API owns both scales.
export async function saveAvailability(
  _state: AvailabilityActionState,
  formData: FormData,
): Promise<AvailabilityActionState> {
  return saveProfile(formData);
}
