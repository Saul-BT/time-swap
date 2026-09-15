"use client";

import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import { BIO_MAX_LENGTH, DISPLAY_NAME_MAX_LENGTH } from "@/data/settings";
import type { PresentationErrorId } from "@/data/types";
import { interpolate } from "@/lib/i18n/interpolate";
import CharacterCount from "../../ui/CharacterCount";
import FormField, { formFieldIds } from "../../ui/FormField";
import PanelForm from "../PanelForm";
import RevealLadder from "../RevealLadder";
import { type PanelSectionFormProps, usePanelForm } from "../usePanelForm";
import {
  PresentationFormAvatar,
  PresentationFormIdentity,
} from "./PresentationForm.style";
import {
  PRESENTATION_FIELD,
  type PresentationCopy,
  type PresentationFieldId,
  type PresentationValues,
  presentationFormClasses,
} from "./PresentationForm.util";

export type PresentationFormProps = PanelSectionFormProps<
  PresentationValues,
  PresentationFieldId,
  PresentationErrorId,
  PresentationCopy
> & {
  initials: string;
  revealId: string;
};

const FOCUS_ORDER = [
  ["displayName", PRESENTATION_FIELD.displayName],
  ["bio", PRESENTATION_FIELD.bio],
] as const;

function isDirty(
  values: PresentationValues,
  saved: PresentationValues,
): boolean {
  return (
    values.displayName !== saved.displayName ||
    values.pronouns !== saved.pronouns ||
    values.bio !== saved.bio ||
    values.reveal !== saved.reveal
  );
}

export default function PresentationForm({
  action,
  initial,
  initials,
  copy,
  titleId,
  revealId,
  nextHref,
}: PresentationFormProps) {
  const form = usePanelForm({
    action,
    initial,
    isDirty,
    focusOrder: FOCUS_ORDER,
  });
  const { values, setValues, fieldErrors } = form;

  const nameError = fieldErrors.displayName
    ? copy.errors[fieldErrors.displayName]
    : undefined;
  const bioError = fieldErrors.bio
    ? interpolate(copy.errors[fieldErrors.bio], { max: BIO_MAX_LENGTH })
    : undefined;
  const nameIds = formFieldIds(PRESENTATION_FIELD.displayName);
  const bioIds = formFieldIds(PRESENTATION_FIELD.bio);

  return (
    <PanelForm
      form={form}
      copy={copy}
      titleId={titleId}
      nextHref={nextHref}
      gap={0}
    >
      <PresentationFormIdentity className={presentationFormClasses.identity}>
        <PresentationFormAvatar
          className={presentationFormClasses.avatar}
          alt={copy.photo}
        >
          {initials}
        </PresentationFormAvatar>
        {/* TODO(media): photo upload needs the media endpoint. Until then the
              control is visible but inert, as in the design. */}
        <Button
          className={presentationFormClasses.photoAction}
          variant="outlined"
          type="button"
          disabled
        >
          {copy.changePhoto}
        </Button>
      </PresentationFormIdentity>

      <FormField
        htmlFor={PRESENTATION_FIELD.displayName}
        label={copy.displayName}
        hint={copy.displayNameHint}
        error={nameError}
      >
        <OutlinedInput
          id={PRESENTATION_FIELD.displayName}
          name="displayName"
          value={values.displayName}
          onChange={(event) =>
            setValues({ ...values, displayName: event.target.value })
          }
          required
          fullWidth
          error={Boolean(nameError)}
          aria-invalid={Boolean(nameError)}
          aria-describedby={
            nameError ? `${nameIds.error} ${nameIds.hint}` : nameIds.hint
          }
          slotProps={{
            input: {
              maxLength: DISPLAY_NAME_MAX_LENGTH,
              autoComplete: "nickname",
            },
          }}
        />
      </FormField>

      <FormField
        htmlFor={PRESENTATION_FIELD.pronouns}
        label={
          <>
            {copy.pronouns} <span aria-hidden>{copy.optional}</span>
          </>
        }
      >
        <OutlinedInput
          id={PRESENTATION_FIELD.pronouns}
          name="pronouns"
          value={values.pronouns}
          onChange={(event) =>
            setValues({ ...values, pronouns: event.target.value })
          }
          placeholder={copy.pronounsPlaceholder}
          fullWidth
          slotProps={{ input: { maxLength: 30 } }}
        />
      </FormField>

      <FormField
        htmlFor={PRESENTATION_FIELD.bio}
        label={copy.bio}
        error={bioError}
        hint={
          <CharacterCount
            id={PRESENTATION_FIELD.bioCount}
            count={values.bio.length}
            max={BIO_MAX_LENGTH}
          >
            {interpolate(copy.counter, {
              count: values.bio.length,
              max: BIO_MAX_LENGTH,
            })}
          </CharacterCount>
        }
      >
        <OutlinedInput
          id={PRESENTATION_FIELD.bio}
          name="bio"
          value={values.bio}
          onChange={(event) =>
            setValues({ ...values, bio: event.target.value })
          }
          multiline
          minRows={5}
          fullWidth
          error={Boolean(bioError)}
          aria-invalid={Boolean(bioError)}
          aria-describedby={
            bioError
              ? `${bioIds.error} ${PRESENTATION_FIELD.bioCount}`
              : PRESENTATION_FIELD.bioCount
          }
        />
      </FormField>

      <RevealLadder
        id={revealId}
        name="reveal.bio"
        copy={copy.reveal}
        value={values.reveal}
        onChange={(reveal) => setValues({ ...values, reveal })}
      />
    </PanelForm>
  );
}
