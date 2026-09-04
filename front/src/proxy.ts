import { type NextRequest, NextResponse } from "next/server";
import { isLocale, LOCALES } from "@/i18n/config";
import { negotiateLocale } from "@/lib/i18n/negotiateLocale";

/**
 * Redirects a request without a locale prefix to the best supported locale.
 * `proxy.ts` is Next 16's name for the former `middleware.ts`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    return;
  }

  // A returning visitor's explicit choice beats the browser header.
  const preferred = request.cookies.get("NEXT_LOCALE")?.value;
  const locale =
    preferred && isLocale(preferred)
      ? preferred
      : negotiateLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, metadata files, assets, and `/brand-book` — the design
  // system reference lives outside the locale tree and must not be prefixed.
  matcher: ["/((?!_next|brand-book|favicon.ico|.*\\.[^/]*$).*)"],
};
