import { SETTINGS_SECTIONS } from "@/data/settings";
import type { SettingsSectionId } from "@/data/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export const SETTINGS_SECTION_COUNT = SETTINGS_SECTIONS.length;

export function sectionNumber(section: SettingsSectionId): number {
  return SETTINGS_SECTIONS.indexOf(section) + 1;
}

export const settingsShellClasses = createComponentClasses("SettingsShell", [
  "root",
  "main",
  "head",
  "headText",
  "breadcrumb",
  "title",
  "lead",
  "viewPublic",
  "meter",
  "frame",
  "rail",
  "index",
  "panel",
  "detailBar",
  "detailBack",
  "detailStep",
]);
