"use client";

import PanelForm from "../PanelForm";
import RevealLadder from "../RevealLadder";
import { type PanelSectionFormProps, usePanelForm } from "../usePanelForm";
import WeekGrid from "../WeekGrid";
import { AvailabilityFormHint } from "./AvailabilityForm.style";
import {
  type AvailabilityCopy,
  type AvailabilityValues,
  availabilityFormClasses,
} from "./AvailabilityForm.util";

export type AvailabilityFormProps = PanelSectionFormProps<
  AvailabilityValues,
  never,
  never,
  AvailabilityCopy
> & {
  revealId: string;
};

function sameCells(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((cell) => b.includes(cell));
}

function isDirty(
  values: AvailabilityValues,
  saved: AvailabilityValues,
): boolean {
  return (
    !sameCells(values.availability, saved.availability) ||
    values.reveal !== saved.reveal
  );
}

export default function AvailabilityForm({
  action,
  initial,
  copy,
  titleId,
  revealId,
  nextHref,
}: AvailabilityFormProps) {
  const form = usePanelForm({ action, initial, isDirty });
  const { values, setValues, pending } = form;

  return (
    <PanelForm form={form} copy={copy} titleId={titleId} nextHref={nextHref}>
      <WeekGrid
        name="availability"
        copy={copy.grid}
        value={values.availability}
        onChange={(availability) => setValues({ ...values, availability })}
        disabled={pending}
      />
      <AvailabilityFormHint className={availabilityFormClasses.hint}>
        {copy.hint}
      </AvailabilityFormHint>

      <RevealLadder
        id={revealId}
        name="reveal.availability"
        copy={copy.reveal}
        value={values.reveal}
        onChange={(reveal) => setValues({ ...values, reveal })}
      />
    </PanelForm>
  );
}
