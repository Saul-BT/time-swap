"use server";

import { redirect } from "next/navigation";
import type { SignInErrorId } from "@/data/types";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";

/**
 * The locale is bound by the page: `next/root-params` is not available
 * inside a Server Action.
 */
// FIXME(auth): mocked action. Every attempt returns `credentials` so the
// screen can show its error state; no credentials are checked and no session
// is created. Replace the redirect with the real call, map the API response
// onto `SignInErrorId`, and redirect to the target page on success.
// When: the back end exposes the sign-in endpoint.
export async function signIn(
  locale: string,
  _formData: FormData,
): Promise<void> {
  const error: SignInErrorId = "credentials";
  const target = isLocale(locale) ? locale : DEFAULT_LOCALE;

  redirect(`${localizePath(target, "signIn")}?error=${error}`);
}
