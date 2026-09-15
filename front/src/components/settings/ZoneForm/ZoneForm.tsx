"use client";

import ToggleButton from "@mui/material/ToggleButton";
import { Building2, MapIcon, MapPin, Users, Wifi } from "lucide-react";
import type { Modality, Zone, ZoneErrorId, ZonePrecision } from "@/data/types";
import Checkbox from "../../ui/Checkbox";
import FieldError from "../../ui/FieldError";
import Icon from "../../ui/Icon";
import PanelForm from "../PanelForm";
import RevealLadder from "../RevealLadder";
import { type PanelSectionFormProps, usePanelForm } from "../usePanelForm";
import ZonePicker from "../ZonePicker";
import {
  ZoneFormField,
  ZoneFormGroup,
  ZoneFormHint,
  ZoneFormLegend,
  ZoneFormOptions,
  ZoneFormPrecision,
} from "./ZoneForm.style";
import {
  MODALITIES,
  PRECISIONS,
  ZONE_FIELD,
  type ZoneCopy,
  type ZoneFieldId,
  type ZoneValues,
  zoneFormClasses,
} from "./ZoneForm.util";

export type ZoneFormProps = PanelSectionFormProps<
  ZoneValues,
  ZoneFieldId,
  ZoneErrorId,
  ZoneCopy
> & {
  zones: readonly Zone[];
  revealId: string;
};

const MODALITY_ICON = { in_person: Users, remote: Wifi } as const;
const PRECISION_ICON = {
  city: Building2,
  district: MapIcon,
  neighborhood: MapPin,
} as const;

const FOCUS_ORDER = [
  ["modalities", ZONE_FIELD.modality],
  ["zone", ZONE_FIELD.zone],
] as const;

function sameModalities(a: readonly Modality[], b: readonly Modality[]) {
  return a.length === b.length && a.every((m) => b.includes(m));
}

function isDirty(values: ZoneValues, saved: ZoneValues): boolean {
  return (
    !sameModalities(values.modalities, saved.modalities) ||
    values.zoneId !== saved.zoneId ||
    values.precision !== saved.precision ||
    values.reveal !== saved.reveal
  );
}

export default function ZoneForm({
  action,
  initial,
  zones,
  copy,
  titleId,
  revealId,
  nextHref,
}: ZoneFormProps) {
  const form = usePanelForm({
    action,
    initial,
    isDirty,
    focusOrder: FOCUS_ORDER,
  });
  const { values, setValues, pending, fieldErrors } = form;

  const modalityError = fieldErrors.modalities
    ? copy.errors[fieldErrors.modalities]
    : undefined;
  const zoneError = fieldErrors.zone
    ? copy.errors[fieldErrors.zone]
    : undefined;
  const zone =
    zones.find((candidate) => candidate.id === values.zoneId) ?? null;

  const toggleModality = (modality: Modality, checked: boolean) =>
    setValues({
      ...values,
      modalities: checked
        ? [...values.modalities, modality]
        : values.modalities.filter((current) => current !== modality),
    });

  return (
    <PanelForm form={form} copy={copy} titleId={titleId} nextHref={nextHref}>
      <ZoneFormGroup
        id={ZONE_FIELD.modality}
        className={zoneFormClasses.group}
        aria-describedby={
          modalityError ? `${ZONE_FIELD.modality}-error` : undefined
        }
        aria-invalid={Boolean(modalityError)}
      >
        <ZoneFormLegend className={zoneFormClasses.legend}>
          {copy.modalityLegend}
        </ZoneFormLegend>
        <ZoneFormOptions className={zoneFormClasses.options}>
          {MODALITIES.map((modality) => (
            <Checkbox
              key={modality}
              id={`${ZONE_FIELD.modality}-${modality}`}
              name="modalities"
              value={modality}
              label={copy.modality[modality]}
              icon={<Icon icon={MODALITY_ICON[modality]} />}
              checked={values.modalities.includes(modality)}
              onChange={(_, checked) => toggleModality(modality, checked)}
            />
          ))}
        </ZoneFormOptions>
        {modalityError ? (
          <FieldError id={`${ZONE_FIELD.modality}-error`}>
            {modalityError}
          </FieldError>
        ) : null}
        <ZoneFormHint className={zoneFormClasses.hint}>
          {copy.modalityHint}
        </ZoneFormHint>
      </ZoneFormGroup>

      <ZoneFormField id={ZONE_FIELD.zone} className={zoneFormClasses.field}>
        <ZonePicker
          id={`${ZONE_FIELD.zone}-search`}
          name="zoneId"
          zones={zones}
          value={zone}
          onChange={(next) =>
            setValues({ ...values, zoneId: next?.id ?? null })
          }
          copy={copy.picker}
          disabled={pending}
          describedBy={zoneError ? `${ZONE_FIELD.zone}-error` : undefined}
        />
        {zoneError ? (
          <FieldError id={`${ZONE_FIELD.zone}-error`}>{zoneError}</FieldError>
        ) : null}
      </ZoneFormField>

      <ZoneFormGroup className={zoneFormClasses.group}>
        <ZoneFormLegend className={zoneFormClasses.legend}>
          {copy.precisionLegend}
        </ZoneFormLegend>
        <ZoneFormPrecision
          id={ZONE_FIELD.precision}
          className={zoneFormClasses.precision}
          exclusive
          value={values.precision}
          onChange={(_, precision: ZonePrecision | null) => {
            if (precision) {
              setValues({ ...values, precision });
            }
          }}
          aria-label={copy.precisionLegend}
          disabled={pending}
        >
          {PRECISIONS.map((precision) => (
            <ToggleButton key={precision} value={precision}>
              <Icon icon={PRECISION_ICON[precision]} />
              {copy.precision[precision]}
            </ToggleButton>
          ))}
        </ZoneFormPrecision>
        <input type="hidden" name="precision" value={values.precision} />
        <ZoneFormHint className={zoneFormClasses.hint}>
          {copy.precisionHint}
        </ZoneFormHint>
      </ZoneFormGroup>

      <ZoneFormField className={zoneFormClasses.field}>
        <RevealLadder
          id={revealId}
          name="reveal.neighborhood"
          copy={copy.reveal}
          value={values.reveal}
          onChange={(reveal) => setValues({ ...values, reveal })}
        />
        <ZoneFormHint className={zoneFormClasses.hint}>
          {copy.revealHint}
        </ZoneFormHint>
      </ZoneFormField>
    </PanelForm>
  );
}
