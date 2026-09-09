import type { SignInErrorId } from "./types";

/** Each account state the sign-in screen can report, and how loud it is. */
export const SIGN_IN_ERROR_TONE: Record<SignInErrorId, "error" | "info"> = {
  credentials: "error",
  tooManyAttempts: "error",
  suspended: "error",
  unverified: "info",
  sessionExpired: "info",
};

export function isSignInErrorId(value: unknown): value is SignInErrorId {
  return typeof value === "string" && value in SIGN_IN_ERROR_TONE;
}
