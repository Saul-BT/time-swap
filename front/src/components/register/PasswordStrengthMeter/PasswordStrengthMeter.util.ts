import { createComponentClasses } from "@/lib/mui/componentClasses";

export const passwordStrengthMeterClasses = createComponentClasses(
  "PasswordStrengthMeter",
  ["root", "track", "segment", "label"],
);

export type PasswordStrengthTone = "error" | "warning" | "success";

export const STRENGTH_SEGMENT_COUNT = 4;

/** Tone per score, 0 to 4. The label for each score is copy, not code — see `RegisterStepPassword`. */
const STRENGTH_TONES: readonly PasswordStrengthTone[] = [
  "error",
  "error",
  "warning",
  "success",
  "success",
];

/**
 * Mirrors the password DTO in `back/nest-back` (`new-register.dto.ts`), so a
 * password that passes here is not bounced with a generic 400. The symbol set
 * is the back end's list, not "any non-alphanumeric".
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 50;

const PASSWORD_RULES: readonly ((password: string) => boolean)[] = [
  (password) => password.length >= PASSWORD_MIN_LENGTH,
  (password) => /[A-ZÁÉÍÓÚÜÑ]/.test(password),
  (password) => /[a-záéíóúüñ]/.test(password),
  (password) => /\d/.test(password),
  (password) => /[!@#$%^&*()_+{}[\]:;<>,.?/~\-=|]/.test(password),
];

export function meetsPasswordPolicy(password: string): boolean {
  return (
    password.length <= PASSWORD_MAX_LENGTH &&
    !/\s/.test(password) &&
    PASSWORD_RULES.every((rule) => rule(password))
  );
}

/**
 * 0-4. Only a password that meets the policy reaches the success tones, so
 * the meter never reads "Good" for something the back end rejects. There is
 * no back end yet to check the password against a breach list.
 */
export function scorePassword(password: string): number {
  if (password.length === 0) {
    return 0;
  }

  if (!meetsPasswordPolicy(password)) {
    const met = PASSWORD_RULES.filter((rule) => rule(password)).length;
    return met >= 3 ? 2 : 1;
  }

  return password.length >= 12 ? 4 : 3;
}

export function getStrengthTone(score: number): PasswordStrengthTone {
  return STRENGTH_TONES[score] ?? STRENGTH_TONES[0];
}
