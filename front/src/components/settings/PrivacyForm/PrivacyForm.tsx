"use client";

import type { ReactNode } from "react";
import ConsequenceRow from "../ConsequenceRow";
import PanelForm from "../PanelForm";
import { type PanelSectionFormProps, usePanelForm } from "../usePanelForm";
import {
  PrivacyFormMatrixHead,
  PrivacyFormMatrixHint,
  PrivacyFormMatrixTitle,
  PrivacyFormSwitches,
} from "./PrivacyForm.style";
import {
  type PrivacyCopy,
  type PrivacyValues,
  privacyFormClasses,
} from "./PrivacyForm.util";

export type PrivacyFormProps = PanelSectionFormProps<
  PrivacyValues,
  never,
  never,
  PrivacyCopy
> & {
  /** Rendered on the server: it is read only and carries no state. */
  matrix: ReactNode;
};

function isDirty(values: PrivacyValues, saved: PrivacyValues): boolean {
  return (
    values.visibleToVisitors !== saved.visibleToVisitors ||
    values.searchable !== saved.searchable
  );
}

export default function PrivacyForm({
  action,
  initial,
  matrix,
  copy,
  titleId,
  nextHref,
}: PrivacyFormProps) {
  const form = usePanelForm({ action, initial, isDirty });
  const { values, setValues, pending } = form;

  return (
    <PanelForm form={form} copy={copy} titleId={titleId} nextHref={nextHref}>
      <PrivacyFormSwitches className={privacyFormClasses.switches}>
        <ConsequenceRow
          name="visibleToVisitors"
          title={copy.visibleToVisitors.title}
          body={copy.visibleToVisitors.body}
          nowLabel={copy.now}
          nowValue={
            values.visibleToVisitors
              ? copy.visibleToVisitors.on
              : copy.visibleToVisitors.off
          }
          checked={values.visibleToVisitors}
          onChange={(visibleToVisitors) =>
            setValues({ ...values, visibleToVisitors })
          }
          disabled={pending}
        />
        <ConsequenceRow
          name="searchable"
          title={copy.searchable.title}
          body={copy.searchable.body}
          nowLabel={copy.now}
          nowValue={
            values.searchable ? copy.searchable.on : copy.searchable.off
          }
          checked={values.searchable}
          onChange={(searchable) => setValues({ ...values, searchable })}
          disabled={pending}
        />
      </PrivacyFormSwitches>

      <div className={privacyFormClasses.matrix}>
        <PrivacyFormMatrixHead className={privacyFormClasses.matrixHead}>
          <PrivacyFormMatrixTitle className={privacyFormClasses.matrixTitle}>
            {copy.matrixTitle}
          </PrivacyFormMatrixTitle>
          <PrivacyFormMatrixHint className={privacyFormClasses.matrixHint}>
            {copy.matrixHint}
          </PrivacyFormMatrixHint>
        </PrivacyFormMatrixHead>
        {matrix}
      </div>
    </PanelForm>
  );
}
