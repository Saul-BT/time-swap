"use client";

import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { IDLE_STATE, type PanelActionState } from "@/lib/forms/actionState";
import { useUnsavedChanges } from "./UnsavedChanges";

export type PanelAction<FieldId extends string, ErrorId extends string> = (
  state: PanelActionState<FieldId, ErrorId>,
  formData: FormData,
) => Promise<PanelActionState<FieldId, ErrorId>>;

export type PanelFormOptions<
  Values,
  FieldId extends string,
  ErrorId extends string,
> = {
  action: PanelAction<FieldId, ErrorId>;
  initial: Values;
  isDirty: (values: Values, saved: Values) => boolean;
  /** Field id and the element to focus, in the order the fields are read. */
  focusOrder?: readonly (readonly [FieldId, string])[];
};

/** What a section page hands to its form; each one adds its own fields. */
export type PanelSectionFormProps<
  Values,
  FieldId extends string,
  ErrorId extends string,
  Copy,
> = {
  action: PanelAction<FieldId, ErrorId>;
  initial: Values;
  copy: Copy;
  titleId: string;
  nextHref: string;
};

const FOCUSABLE = "input, select, textarea, button, [tabindex]";

/** Focuses the element, or the first control inside it when it only groups. */
function focusField(elementId: string): void {
  const target = document.getElementById(elementId);
  const focusable = target?.matches(FOCUSABLE)
    ? target
    : target?.querySelector<HTMLElement>(FOCUSABLE);

  focusable?.focus();
}

export type PanelForm<
  Values,
  FieldId extends string,
  ErrorId extends string,
> = {
  state: PanelActionState<FieldId, ErrorId>;
  fieldErrors: Partial<Record<FieldId, ErrorId>>;
  savedAt: number | undefined;
  failed: boolean;
  pending: boolean;
  values: Values;
  setValues: Dispatch<SetStateAction<Values>>;
  retry: () => void;
  formProps: {
    ref: RefObject<HTMLFormElement | null>;
    action: (formData: FormData) => void;
    onSubmit: () => void;
    ownerState: { pending: boolean };
  };
};

/**
 * The values sent to the server are frozen on submit, so a result that arrives
 * while the reader keeps typing marks the submitted ones as saved, not the
 * current ones.
 */
export function usePanelForm<
  Values,
  FieldId extends string = string,
  ErrorId extends string = string,
>({
  action,
  initial,
  isDirty,
  focusOrder,
}: PanelFormOptions<Values, FieldId, ErrorId>): PanelForm<
  Values,
  FieldId,
  ErrorId
> {
  const [state, submit, pending] = useActionState(action, IDLE_STATE);
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const form = useRef<HTMLFormElement>(null);
  const submitted = useRef(initial);
  const { setDirty } = useUnsavedChanges();
  const focusTargets = useRef(focusOrder);
  focusTargets.current = focusOrder;

  const dirty = isDirty(values, saved);

  useEffect(() => {
    setDirty(dirty);
    return () => setDirty(false);
  }, [dirty, setDirty]);

  useEffect(() => {
    if (state.status === "saved") {
      setSaved(submitted.current);
    }
  }, [state]);

  useEffect(() => {
    if (state.status !== "invalid") {
      return;
    }

    const first = focusTargets.current?.find(
      ([field]) => state.fieldErrors[field],
    );

    if (first) {
      focusField(first[1]);
    }
  }, [state]);

  return {
    state,
    fieldErrors: state.status === "invalid" ? state.fieldErrors : {},
    savedAt: state.status === "saved" ? state.savedAt : undefined,
    failed: state.status === "failed",
    pending,
    values,
    setValues,
    retry: () => form.current?.requestSubmit(),
    formProps: {
      ref: form,
      action: submit,
      onSubmit: () => {
        submitted.current = values;
      },
      ownerState: { pending },
    },
  };
}
