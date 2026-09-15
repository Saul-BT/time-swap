import { type NextRequest, NextResponse } from "next/server";
import { isLocale, LOCALES } from "@/i18n/config";
import { publicPathFor } from "@/i18n/routes";
import { negotiateLocale } from "@/lib/i18n/negotiateLocale";

/**
 * Two jobs, both about the locale segment. A request without one is sent to
 * the best supported locale. A request that reaches a folder slug in a locale
 * whose public slug is different is sent to the public one, so each page has a
 * single URL per language. `proxy.ts` is Next 16's name for the former
 * `middleware.ts`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    const publicPath = publicPathFor(pathname);

    if (publicPath) {
      const url = request.nextUrl.clone();
      url.pathname = publicPath;

      return NextResponse.redirect(url, 308);
    }

    return;
  }

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
  matcher: ["/((?!_next|brand-book|favicon.ico|.*\\.[^/]*$).*)"],
};
