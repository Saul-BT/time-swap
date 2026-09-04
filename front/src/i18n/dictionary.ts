import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { cache } from "react";
import { isLocale, type Locale } from "./config";
import type { Dictionary } from "./types";

/**
 * Server-only by construction: `next/root-params` fails to build inside a
 * client component, so no dictionary can reach the browser.
 */
const dictionaries = {
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

/** Fails to compile if `en.json` drifts from the Spanish shape. */
const loaders: Record<Locale, () => Promise<Dictionary>> = dictionaries;

/** One resolution per request, shared by every component that calls it. */
export const getDictionary = cache(async (): Promise<Dictionary> => {
  const locale = await lang();

  // The proxy only ever routes supported locales here, so an unknown one means
  // a hand-typed URL. A 404 is the honest answer; falling back would serve
  // Spanish under an `/fr` path and let a broken link look like it worked.
  if (!locale || !isLocale(locale)) {
    notFound();
  }

  return loaders[locale]();
});

export const getLocale = cache(async (): Promise<Locale> => {
  const locale = await lang();

  if (!locale || !isLocale(locale)) {
    notFound();
  }

  return locale;
});

export type { Dictionary } from "./types";
