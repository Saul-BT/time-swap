import type { Zone } from "@/data/types";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export type ZonePickerCopy = {
  emptyTitle: string;
  emptyBody: string;
  pick: string;
  approximate: string;
  approximating: string;
  deniedTitle: string;
  deniedBody: string;
  unsupportedTitle: string;
  unsupportedBody: string;
  pickerLabel: string;
  pickerPlaceholder: string;
  noMatch: string;
  currentTitle: string;
  /** With `{neighborhood}` and `{district}`. */
  current: string;
  change: string;
};

/**
 * `empty` and `denied` share the warning card; `picking` shows the search;
 * `set` shows the chosen zone with a way back to `picking`.
 */
export type ZonePickerPhase =
  | "empty"
  | "picking"
  | "approximating"
  | "denied"
  | "unsupported"
  | "set";

export function phaseFor(zone: Zone | null): ZonePickerPhase {
  return zone ? "set" : "empty";
}

export const zonePickerClasses = createComponentClasses("ZonePicker", [
  "root",
  "notice",
  "noticeTitle",
  "noticeBody",
  "actions",
  "search",
  "current",
  "currentTitle",
  "currentValue",
]);
