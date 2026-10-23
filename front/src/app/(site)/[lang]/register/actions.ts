"use server";

import type {
  RegisterErrorId,
  RegisterInput,
  RegisterResult,
} from "@/data/types";

/**
 * Status codes documented on `POST /auth/register`. Anything else, network
 * failures included, reads as the server being down.
 */
const ERROR_BY_STATUS: Partial<Record<number, RegisterErrorId>> = {
  400: "invalid",
  409: "mailTaken",
  429: "tooManyAttempts",
};

/**
 * Returns a result instead of redirecting: the wizard keeps the typed values
 * in client state, and a navigation would discard them.
 *
 * The back end only stores a pending verification; the account cannot sign
 * in until `POST /auth/verify` accepts it.
 */
export async function register(
  locale: string,
  input: RegisterInput,
): Promise<RegisterResult> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    console.error("Register error: BACKEND_URL is not set");
    return { ok: false, error: "backendDown" };
  }

  try {
    const response = await fetch(`${backendUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": locale,
      },
      body: JSON.stringify({
        mail: input.email,
        name: input.fullName,
        password: input.password,
        repeatPassword: input.confirmPassword,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: ERROR_BY_STATUS[response.status] ?? "backendDown",
      };
    }

    return { ok: true };
  } catch (err) {
    console.error("Register error:", err);
    return { ok: false, error: "backendDown" };
  }
}
