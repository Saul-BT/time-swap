import {
  CalendarDays,
  type LucideIcon,
  MapPin,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";
import type { SettingsSectionId } from "@/data/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

/** `tabs` is the desktop rail; `index` is the settings-style list on small screens. */
export type SettingsNavVariant = "tabs" | "index";

export const SECTION_ICON: Record<SettingsSectionId, LucideIcon> = {
  presentation: UserRound,
  skills: Wrench,
  availability: CalendarDays,
  zone: MapPin,
  privacy: ShieldCheck,
};

export const settingsNavClasses = createComponentClasses("SettingsNav", [
  "root",
  "list",
  "item",
  "link",
  "icon",
  "name",
  "status",
  "chevron",
]);
