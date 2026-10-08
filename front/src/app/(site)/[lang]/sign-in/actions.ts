"use server";

import { redirect } from "next/navigation";
import { isBackendError, type SignInErrorId } from "@/data/types";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { cookies } from "next/headers";

/**
 * The locale is bound by the page: `next/root-params` is not available
 * inside a Server Action.
 */
export async function signIn(
  locale: string,
  _formData: FormData,
): Promise<void> {
  const target = isLocale(locale) ? locale : DEFAULT_LOCALE;

  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    console.log("Error: BACKEND_URL undefined in .env");
    redirect(`${localizePath(target, "signIn")}?error=backendDown`);
  }

  const email = _formData.get('email');
  const password = _formData.get('password');

  try {
    const response = await fetch(
      `${backendUrl}/api/v1/auth/login`,
      {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          mail: email,
          password,
        }),
    });

    const data = await response.json();

  if (!response.ok) {
    let error: SignInErrorId = "backendDown"; //default to generic error
    if (isBackendError(data) && data.error === 401 && data.message === "INVALID CREDENTIALS")
      error = "credentials";
    redirect(`${localizePath(target, "signIn")}?error=${error}`);
  }

    //save session cookies and redirect to profile
    const cookieStore = await cookies();

    cookieStore.set(
      'accessToken',
      data.accessToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    );
    
    redirect(`${localizePath(target, "signIn")}`); //todo redirect to profile
  }
  catch (err) {
    console.log("Sign in error: " + err);
    redirect(
      `${localizePath(target, "signIn")}?error=backendDown`,
    );
  };
}
