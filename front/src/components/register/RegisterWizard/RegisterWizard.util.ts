import { createComponentClasses } from "@/lib/mui/componentClasses";

export const registerWizardClasses = createComponentClasses("RegisterWizard", [
  "root",
  "form",
  "nav",
  "navActions",
  "profileGroup",
]);

export const REGISTER_FIELD_ID = {
  fullName: "register-full-name",
  postalCode: "register-postal-code",
  nickname: "register-nickname",
  email: "register-email",
  password: "register-password",
  confirmPassword: "register-confirm-password",
} as const;

/**
 * Mirrors the name rules in `back/nest-back` (`new-register.dto.ts`): a
 * capital first letter, then letters (accents allowed) and spaces only.
 */
export const FULL_NAME_MIN_LENGTH = 3;
export const FULL_NAME_MAX_LENGTH = 30;

export function meetsFullNamePolicy(fullName: string): boolean {
  return (
    fullName.length >= FULL_NAME_MIN_LENGTH &&
    fullName.length <= FULL_NAME_MAX_LENGTH &&
    /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]*$/.test(fullName)
  );
}

export type CategoryOption = { id: string; label: string };

export type RegisterAccountValues = {
  fullName: string;
  postalCode: string;
  nickname: string;
  email: string;
};

export type RegisterValues = RegisterAccountValues & {
  password: string;
  skills: ReadonlySet<string>;
  interests: ReadonlySet<string>;
};

export const INITIAL_REGISTER_VALUES: RegisterValues = {
  fullName: "",
  postalCode: "",
  nickname: "",
  email: "",
  password: "",
  skills: new Set(),
  interests: new Set(),
};
