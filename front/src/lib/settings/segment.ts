import { ACCOUNT_NAV, SECTION_ROUTE, SETTINGS_SECTIONS } from "@/data/settings";
import type { AccountNavId, SettingsSectionId } from "@/data/types";
import { FOLDER_LOCALE, ROUTES, type RouteId } from "@/i18n/routes";

/** Where the settings layout sits, so a route can be cut down to its segments. */
const SETTINGS_ROOT = "/settings/";

function settingsSegments(id: RouteId): string {
  return ROUTES[id][FOLDER_LOCALE].slice(SETTINGS_ROOT.length);
}

const SECTION_BY_SEGMENTS = new Map<string, SettingsSectionId>(
  SETTINGS_SECTIONS.map((section) => [
    settingsSegments(SECTION_ROUTE[section]),
    section,
  ]),
);

const ACCOUNT_BY_SEGMENT = new Map<string, AccountNavId>(
  ACCOUNT_NAV.flatMap(({ id, target }) => {
    if (target.startsWith("#")) {
      return [];
    }

    const path = ROUTES[target as RouteId][FOLDER_LOCALE];

    return path.startsWith(SETTINGS_ROOT)
      ? [[settingsSegments(target as RouteId).split("/")[0], id] as const]
      : [];
  }),
);

export type SettingsPlace = {
  /** `null` on the settings index, where no section is open. */
  active: SettingsSectionId | null;
  account: AccountNavId;
};

/**
 * Reads the arrangement from the router. Localized slugs are rewritten to the
 * English folder ones (ADR 0011), so the segments are the same in every locale.
 *
 * @example
 * settingsPlace(["profile"]); // { active: null, account: "profile" }
 * settingsPlace(["profile", "zone"]); // { active: "zone", account: "profile" }
 * settingsPlace(["privacy"]); // { active: "privacy", account: "privacy" }
 */
export function settingsPlace(segments: readonly string[]): SettingsPlace {
  return {
    active: SECTION_BY_SEGMENTS.get(segments.join("/")) ?? null,
    account: ACCOUNT_BY_SEGMENT.get(segments[0] ?? "") ?? "profile",
  };
}
