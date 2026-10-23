"use server";

import type { RegisterInput, RegisterResult } from "@/data/types";

/**
 * Returns a result instead of redirecting: the wizard keeps the typed values
 * in client state, and a navigation would discard them.
 */
// TODO(api): mocked action. Every attempt succeeds and nothing is sent or
// saved. Call `POST /auth/register` with `Accept-Language: locale`, map the
// status onto `RegisterErrorId` (400 → invalid, 409 → mailTaken,
// 429 → tooManyAttempts, anything else or a network failure → backendDown).
// When: the front is wired to the back end.
export async function register(
  _locale: string,
  _input: RegisterInput,
): Promise<RegisterResult> {
  return { ok: true };
}
