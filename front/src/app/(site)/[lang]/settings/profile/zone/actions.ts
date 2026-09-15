"use server";

import {
  MODALITIES,
  type ZoneActionState,
} from "@/components/settings/ZoneForm";
import type { Modality } from "@/data/types";
import { findZone } from "@/data/zones";
import { type FieldErrors, finishSave } from "@/lib/forms/actionState";

// FIXME(api): checks the rule that crosses two fields — in person needs a zone —
// then pretends to save. Replace `finishSave` with PATCH /profile/me
// { modalities, approximateLocation, privacySettings.reveal.neighborhood } (#5).
// The zone catalogue and the precision scale are the API's to enforce.
export async function saveZone(
  _state: ZoneActionState,
  formData: FormData,
): Promise<ZoneActionState> {
  const modalities = formData
    .getAll("modalities")
    .map(String)
    .filter((value): value is Modality =>
      MODALITIES.includes(value as Modality),
    );
  const zoneId = String(formData.get("zoneId") ?? "");
  const fieldErrors: FieldErrors<ZoneActionState> = {};

  if (modalities.length === 0) {
    fieldErrors.modalities = "modalityRequired";
  }
  if (modalities.includes("in_person") && !findZone(zoneId)) {
    fieldErrors.zone = "zoneRequiredInPerson";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "invalid", fieldErrors };
  }

  return finishSave(formData);
}
