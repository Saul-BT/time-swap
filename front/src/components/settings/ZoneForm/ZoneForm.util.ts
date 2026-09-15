import type {
  Modality,
  RevealMoment,
  ZoneErrorId,
  ZonePrecision,
} from "@/data/types";
import type { PanelActionState } from "@/lib/forms/actionState";
import { createComponentClasses } from "@/lib/mui/componentClasses";
import type { PanelFormCopy } from "../PanelForm";
import type { RevealLadderCopy } from "../RevealLadder";
import type { ZonePickerCopy } from "../ZonePicker";

export const ZONE_FIELD = {
  modality: "zone-modality",
  zone: "zone-picker",
  precision: "zone-precision",
} as const;

export type ZoneFieldId = "modalities" | "zone";

export type ZoneActionState = PanelActionState<ZoneFieldId, ZoneErrorId>;

export type ZoneValues = {
  modalities: Modality[];
  zoneId: string | null;
  precision: ZonePrecision;
  reveal: RevealMoment;
};

export const MODALITIES: readonly Modality[] = ["in_person", "remote"];

export const PRECISIONS: readonly ZonePrecision[] = [
  "city",
  "district",
  "neighborhood",
];

export type ZoneCopy = PanelFormCopy & {
  modalityLegend: string;
  modalityHint: string;
  modality: Record<Modality, string>;
  picker: ZonePickerCopy;
  precisionLegend: string;
  precisionHint: string;
  precision: Record<ZonePrecision, string>;
  revealHint: string;
  errors: Record<ZoneErrorId, string>;
  reveal: RevealLadderCopy;
};

export const zoneFormClasses = createComponentClasses("ZoneForm", [
  "group",
  "legend",
  "options",
  "field",
  "precision",
  "hint",
]);
