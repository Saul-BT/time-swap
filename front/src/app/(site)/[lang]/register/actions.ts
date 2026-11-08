"use server";

import { isBackendError, type RegisterInput, type RegisterResult } from "@/data/types";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { cookies } from "next/headers";

/**
 * Returns a result instead of redirecting: the wizard keeps the typed values
 * in client state, and a navigation would discard them.
 */
export async function register(
  _locale: string,
  _input: RegisterInput,
): Promise<RegisterResult> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    console.log("Error: BACKEND_URL undefined in .env"); //todo dont start the page if backend_url is not defined
    return {
      ok: false,
      error: 'backendDown'
    }
  }
  
  try {
    const response = await fetch(
      `${backendUrl}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Accept-Language': _locale,
          'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          mail: _input.email,
          name: _input.fullName,
          nickname: _input.nickname,
          password: _input.password,
          repeatPassword: _input.confirmPassword
        }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      console.log(`Register error ${response.status}: ${response.statusText}`);
      if (response.status === 400) {
        return {
          ok: false,
          error: 'invalid'
        }
      }
      else if (response.status === 409) {
        return {
          ok: false,
          error: 'mailTaken'
        }
      }
      else if (response.status === 429) {
        return {
          ok: false,
          error: 'tooManyAttempts'
        }
      }
      //default to generic error
      return {
        ok: false,
        error: 'backendDown'
      }
    }
  
    if (response.status !== 201 || response.statusText !== 'Created') {
      console.log(`Register unexpected output ${response.status}: ${response.statusText}`);
      return {
        ok: false,
        error: 'invalid'
      }
    }

    //save session cookies
    const cookieStore = await cookies();

    cookieStore.set(
      'accessToken',
      data.backend_tokens.access_token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    );
    return { ok: true }; //todo redirect to loggedHome from parent function
  }
  catch (err) {
    console.log("Register error: " + err);
    return {
      ok: false,
      error: 'backendDown' //default err
    }
  };
}
