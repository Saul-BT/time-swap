import Button from "@mui/material/Button";
import type { FormEvent } from "react";
import { useState } from "react";
import FormField from "@/components/ui/FormField";
import FormNotice from "@/components/ui/FormNotice";
import PasswordField from "@/components/ui/PasswordField";
import type { Dictionary } from "@/i18n/types";
import PasswordStrengthMeter from "../PasswordStrengthMeter";
import {
  RegisterFormLead,
  RegisterFormNav,
  RegisterFormTitle,
} from "./RegisterWizard.style";
import {
  REGISTER_FIELD_ID,
  registerWizardClasses,
} from "./RegisterWizard.util";

export type RegisterStepPasswordProps = {
  copy: Dictionary["register"]["password"];
  mismatch: boolean;
  onBack: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

/**
 * `PasswordField` is uncontrolled (see `ui/PasswordField`, out of scope for
 * this feature), so the live strength read-out listens for the bubbled
 * change event instead of holding a controlled value.
 */
export default function RegisterStepPassword({
  copy,
  mismatch,
  onBack,
  onSubmit,
}: RegisterStepPasswordProps) {
  const [passwordDraft, setPasswordDraft] = useState("");

  return (
    <form
      className={registerWizardClasses.form}
      onSubmit={onSubmit}
      onChange={(event) => {
        const target = event.target;
        if (target instanceof HTMLInputElement && target.name === "password") {
          setPasswordDraft(target.value);
        }
      }}
    >
      <RegisterFormTitle variant="h2" component="h1">
        {copy.title}
      </RegisterFormTitle>
      <RegisterFormLead variant="body1">{copy.lead}</RegisterFormLead>

      {mismatch ? (
        <FormNotice tone="error" title={copy.mismatchTitle}>
          {copy.mismatchBody}
        </FormNotice>
      ) : null}

      <FormField
        htmlFor={REGISTER_FIELD_ID.password}
        label={copy.passwordLabel}
      >
        <PasswordField
          id={REGISTER_FIELD_ID.password}
          name="password"
          autoComplete="new-password"
          showLabel={copy.showPassword}
          hideLabel={copy.hidePassword}
          required
          error={mismatch}
        />
      </FormField>
      <PasswordStrengthMeter
        password={passwordDraft}
        levels={[
          copy.strength.veryWeak,
          copy.strength.weak,
          copy.strength.fair,
          copy.strength.good,
          copy.strength.excellent,
        ]}
        ariaLabel={copy.strength.ariaLabel}
        ariaLabelWithLevel={copy.strength.ariaLabelWithLevel}
      />

      <FormField
        htmlFor={REGISTER_FIELD_ID.confirmPassword}
        label={copy.confirmPasswordLabel}
      >
        <PasswordField
          id={REGISTER_FIELD_ID.confirmPassword}
          name="confirmPassword"
          autoComplete="new-password"
          showLabel={copy.showPassword}
          hideLabel={copy.hidePassword}
          required
          error={mismatch}
        />
      </FormField>

      <RegisterFormNav className={registerWizardClasses.nav}>
        <Button variant="text" type="button" onClick={onBack}>
          {copy.back}
        </Button>
        <Button variant="contained" type="submit">
          {copy.continue}
        </Button>
      </RegisterFormNav>
    </form>
  );
}
