"use server";

import type { PrivacyActionState } from "@/components/settings/PrivacyForm";
import { saveProfile } from "@/lib/api/profile";

// FIXME(api): `saveProfile` will send
// PATCH /profile/me { visibleToVisitors, searchable } (#5).
export async function savePrivacy(
  _state: PrivacyActionState,
  formData: FormData,
): Promise<PrivacyActionState> {
  return saveProfile(formData);
}
