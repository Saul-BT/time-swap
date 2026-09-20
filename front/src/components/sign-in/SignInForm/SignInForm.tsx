import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import Checkbox from "@/components/ui/Checkbox";
import FormField from "@/components/ui/FormField";
import FormNotice from "@/components/ui/FormNotice";
import PasswordField from "@/components/ui/PasswordField";
import { SIGN_IN_ERROR_TONE } from "@/data/sign-in";
import type { SignInErrorId } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import {
  SignInFormLead,
  SignInFormRemember,
  SignInFormRoot,
  SignInFormSubmit,
  SignInFormTitle,
} from "./SignInForm.style";
import { SIGN_IN_FIELD_ID, signInFormClasses } from "./SignInForm.util";

export type SignInFormProps = {
  action: (formData: FormData) => Promise<void>;
  /** Account state reported by the last attempt, if any. */
  error?: SignInErrorId;
};

export default async function SignInForm({ action, error }: SignInFormProps) {
  const { signIn } = await getDictionary();
  const locale = await getLocale();
  const hasCredentialError = error === "credentials";

  return (
    <SignInFormRoot
      className={signInFormClasses.root}
      action={action}
      aria-labelledby={`${SIGN_IN_FIELD_ID.email}-title`}
    >
      <SignInFormTitle
        className={signInFormClasses.title}
        id={`${SIGN_IN_FIELD_ID.email}-title`}
        variant="h2"
        component="h1"
      >
        {signIn.title}
      </SignInFormTitle>
      <SignInFormLead className={signInFormClasses.lead} variant="body1">
        {signIn.lead}
      </SignInFormLead>

      {error ? (
        <FormNotice
          tone={SIGN_IN_ERROR_TONE[error]}
          title={signIn.errors[error].title}
        >
          {signIn.errors[error].body}
        </FormNotice>
      ) : null}

      <FormField
        htmlFor={SIGN_IN_FIELD_ID.email}
        label={signIn.form.emailLabel}
      >
        <OutlinedInput
          id={SIGN_IN_FIELD_ID.email}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={signIn.form.emailPlaceholder}
          required
          fullWidth
          error={hasCredentialError}
        />
      </FormField>

      <FormField
        htmlFor={SIGN_IN_FIELD_ID.password}
        label={signIn.form.passwordLabel}
        aside={
          <Link href={localizePath(locale, "recoverAccess")} variant="body2">
            {signIn.form.forgotPassword}
          </Link>
        }
      >
        <PasswordField
          id={SIGN_IN_FIELD_ID.password}
          name="password"
          showLabel={signIn.form.showPassword}
          hideLabel={signIn.form.hidePassword}
          required
          error={hasCredentialError}
        />
      </FormField>

      {/* TODO(auth): `remember` is submitted but nothing reads it. Bind it to
          the session cookie lifetime once the sign-in endpoint exists. */}
      <SignInFormRemember className={signInFormClasses.remember}>
        <Checkbox
          id={SIGN_IN_FIELD_ID.remember}
          name="remember"
          label={signIn.form.remember}
        />
      </SignInFormRemember>

      <SignInFormSubmit
        className={signInFormClasses.submit}
        type="submit"
        variant="contained"
      >
        {signIn.form.submit}
      </SignInFormSubmit>

      <Typography className={signInFormClasses.switch} variant="body2">
        {signIn.noAccount}{" "}
        <Link href={localizePath(locale, "register")}>
          {signIn.createAccount}
        </Link>
      </Typography>
    </SignInFormRoot>
  );
}
