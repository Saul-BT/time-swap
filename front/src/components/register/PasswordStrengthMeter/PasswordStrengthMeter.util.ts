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
 * 0-4, from length and character variety only. There is no back end yet to
 * check the password against a breach list.
 */
export function scorePassword(password: string): number {
  if (password.length === 0) {
    return 0;
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/\d/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
  if (
    /[^a-zA-Z0-9]/.test(password) ||
    (/[a-z]/.test(password) && /[A-Z]/.test(password))
  ) {
    score += 1;
  }

  return Math.min(score, STRENGTH_SEGMENT_COUNT);
}

export function getStrengthTone(score: number): PasswordStrengthTone {
  return STRENGTH_TONES[score] ?? STRENGTH_TONES[0];
}
