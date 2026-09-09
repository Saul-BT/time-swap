"use server";

import { redirect } from "next/navigation";
import type { SignInErrorId } from "@/data/types";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";

/**
 * Placeholder until the API exposes authentication: every attempt comes back
 * as a credentials mismatch so the screen shows its error state.
 *
 * The locale is bound by the page: `next/root-params` is not available
 * inside a Server Action.
 */
export async function signIn(
  locale: string,
  _formData: FormData,
): Promise<void> {
  const error: SignInErrorId = "credentials";
  const target = isLocale(locale) ? locale : DEFAULT_LOCALE;

  redirect(`${localizePath(target, "signIn")}?error=${error}`);
}
