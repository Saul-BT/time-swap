import {
  REVEAL_FIELD_SECTION,
  revealAnchor,
  SECTION_ROUTE,
  SETTINGS_SECTIONS,
} from "@/data/settings";
import type {
  Profile,
  RevealableField,
  RevealMoment,
  SettingsSectionId,
} from "@/data/types";
import type { Locale } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import type { Dictionary } from "@/i18n/types";
import { getProfile } from "@/lib/api/profile";
import { interpolate } from "@/lib/i18n/interpolate";

type SettingsCopy = Dictionary["settings"];

export type PanelChrome = {
  step: string;
  title: string;
  footer: { save: string; saving: string; saved: string; next: string };
  serverError: { title: string; body: string; retry: string };
  nextHref: string;
};

export function getPanelChrome(
  settings: SettingsCopy,
  locale: Locale,
  section: SettingsSectionId,
  memberId: string,
): PanelChrome {
  const index = SETTINGS_SECTIONS.indexOf(section);
  const next = SETTINGS_SECTIONS[index + 1];
  const { panel, sections } = settings;

  return {
    step: interpolate(panel.stepLabel, {
      n: index + 1,
      total: SETTINGS_SECTIONS.length,
    }),
    title: sections[section],
    footer: {
      save: interpolate(panel.save, {
        section: sections[section].toLocaleLowerCase(locale),
      }),
      saving: panel.saving,
      saved: panel.saved,
      next: next
        ? interpolate(panel.next, { section: sections[next] })
        : settings.shell.viewPublic,
    },
    serverError: {
      title: panel.serverErrorTitle,
      body: panel.serverErrorBody,
      retry: panel.retry,
    },
    nextHref: next
      ? localizePath(locale, SECTION_ROUTE[next])
      : localizePath(locale, "memberProfile", { id: memberId }),
  };
}

export type PanelContext = {
  settings: SettingsCopy;
  locale: Locale;
  profile: Profile;
  chrome: PanelChrome;
  /** Names the panel heading; the form points at it with `aria-labelledby`. */
  titleId: string;
};

/** Everything the five section pages resolve before rendering their form. */
export async function getPanelContext(
  section: SettingsSectionId,
): Promise<PanelContext> {
  const [{ settings }, locale, profile] = await Promise.all([
    getDictionary(),
    getLocale(),
    getProfile(),
  ]);

  return {
    settings,
    locale,
    profile,
    chrome: getPanelChrome(settings, locale, section, profile.userId),
    titleId: `${section}-title`,
  };
}

export function getRevealMoments(
  settings: SettingsCopy,
): Record<RevealMoment, string> {
  const { reveal } = settings;

  return {
    visitor: reveal.visitor,
    member: reveal.member,
    contact: reveal.contact,
    agreement: reveal.agreement,
  };
}

export function getRevealMomentsShort(
  settings: SettingsCopy,
): Record<RevealMoment, string> {
  const { short } = settings.reveal;

  return {
    visitor: short.visitor,
    member: short.member,
    contact: short.contact,
    agreement: short.agreement,
  };
}

/** Where each matrix row sends the reader to change that field's moment. */
export function getRevealEditHref(
  locale: Locale,
): Record<RevealableField, string> {
  const entries = Object.entries(REVEAL_FIELD_SECTION) as [
    RevealableField,
    SettingsSectionId,
  ][];

  return Object.fromEntries(
    entries.map(([field, section]) => [
      field,
      `${localizePath(locale, SECTION_ROUTE[section])}#${revealAnchor(field)}`,
    ]),
  ) as Record<RevealableField, string>;
}

export function getRevealCopy(settings: SettingsCopy, field: string) {
  return {
    legend: interpolate(settings.reveal.legend, { field }),
    moments: getRevealMoments(settings),
    hints: settings.reveal.hint,
  };
}
