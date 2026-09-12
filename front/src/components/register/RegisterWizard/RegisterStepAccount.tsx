import OutlinedInput from "@mui/material/OutlinedInput";
import type { FormEvent } from "react";
import FormField from "@/components/ui/FormField";
import type { Dictionary } from "@/i18n/types";
import {
  RegisterFieldHint,
  RegisterFormLead,
  RegisterFormSubmit,
  RegisterFormTitle,
} from "./RegisterWizard.style";
import {
  REGISTER_FIELD_ID,
  type RegisterAccountValues,
  registerWizardClasses,
} from "./RegisterWizard.util";

export type RegisterStepAccountProps = {
  copy: Dictionary["register"]["account"];
  defaultValues: RegisterAccountValues;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function RegisterStepAccount({
  copy,
  defaultValues,
  onSubmit,
}: RegisterStepAccountProps) {
  return (
    <form className={registerWizardClasses.form} onSubmit={onSubmit}>
      <RegisterFormTitle variant="h2" component="h1">
        {copy.title}
      </RegisterFormTitle>
      <RegisterFormLead variant="body1">{copy.lead}</RegisterFormLead>

      <FormField
        htmlFor={REGISTER_FIELD_ID.fullName}
        label={copy.fullNameLabel}
      >
        <OutlinedInput
          id={REGISTER_FIELD_ID.fullName}
          name="fullName"
          autoComplete="name"
          defaultValue={defaultValues.fullName}
          required
          fullWidth
        />
      </FormField>

      <FormField
        htmlFor={REGISTER_FIELD_ID.postalCode}
        label={copy.postalCodeLabel}
      >
        <OutlinedInput
          id={REGISTER_FIELD_ID.postalCode}
          name="postalCode"
          autoComplete="postal-code"
          inputMode="numeric"
          placeholder={copy.postalCodePlaceholder}
          defaultValue={defaultValues.postalCode}
          required
          fullWidth
          inputProps={{ pattern: "\\d{5}", maxLength: 5 }}
        />
      </FormField>
      <RegisterFieldHint variant="caption" color="textSecondary">
        {copy.postalCodeHint}
      </RegisterFieldHint>

      <FormField
        htmlFor={REGISTER_FIELD_ID.nickname}
        label={copy.nicknameLabel}
      >
        <OutlinedInput
          id={REGISTER_FIELD_ID.nickname}
          name="nickname"
          autoComplete="nickname"
          placeholder={copy.nicknamePlaceholder}
          defaultValue={defaultValues.nickname}
          required
          fullWidth
        />
      </FormField>
      <RegisterFieldHint variant="caption" color="textSecondary">
        {copy.nicknameHint}
      </RegisterFieldHint>

      <FormField htmlFor={REGISTER_FIELD_ID.email} label={copy.emailLabel}>
        <OutlinedInput
          id={REGISTER_FIELD_ID.email}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={copy.emailPlaceholder}
          defaultValue={defaultValues.email}
          required
          fullWidth
        />
      </FormField>

      <RegisterFormSubmit type="submit" variant="contained">
        {copy.submit}
      </RegisterFormSubmit>
    </form>
  );
}
