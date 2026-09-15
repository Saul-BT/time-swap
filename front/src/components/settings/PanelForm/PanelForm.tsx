"use client";

import type { ReactNode } from "react";
import { space } from "@/theme/tokens";
import PanelFooter from "../PanelFooter";
import ServerErrorNotice from "../ServerErrorNotice";
import type { PanelForm as PanelFormState } from "../usePanelForm";
import { PanelFormFields, PanelFormRoot } from "./PanelForm.style";
import { type PanelFormCopy, panelFormClasses } from "./PanelForm.util";

export type PanelFormProps<
  Values,
  FieldId extends string,
  ErrorId extends string,
> = {
  form: PanelFormState<Values, FieldId, ErrorId>;
  copy: PanelFormCopy;
  titleId: string;
  nextHref: string;
  /** Spacing multiplier between fields; `space.md` unless the section packs them. */
  gap?: number;
  children: ReactNode;
};

/**
 * Frame shared by the five section forms: the form element, the failure notice
 * above the fields, the fieldset that disables them while saving, and the footer.
 */
export default function PanelForm<
  Values,
  FieldId extends string,
  ErrorId extends string,
>({
  form,
  copy,
  titleId,
  nextHref,
  gap = space.md,
  children,
}: PanelFormProps<Values, FieldId, ErrorId>) {
  const { pending, failed, savedAt, retry, formProps } = form;

  return (
    <PanelFormRoot
      {...formProps}
      className={panelFormClasses.root}
      aria-labelledby={titleId}
    >
      {failed ? (
        <ServerErrorNotice
          copy={copy.serverError}
          onRetry={retry}
          disabled={pending}
        />
      ) : null}

      <PanelFormFields
        className={panelFormClasses.fields}
        disabled={pending}
        ownerState={{ gap }}
      >
        {children}
      </PanelFormFields>

      <PanelFooter
        copy={copy.footer}
        nextHref={nextHref}
        pending={pending}
        savedAt={savedAt}
      />
    </PanelFormRoot>
  );
}
