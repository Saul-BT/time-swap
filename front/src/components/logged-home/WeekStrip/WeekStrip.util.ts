import type { CalendarDay } from "@/lib/date/calendarDay";
import { createComponentClasses } from "@/lib/mui/componentClasses";

/** Colour of a day mark. `brake` only for a dispute, `warning` for an expiry. */
export type DayMarkTone = "accent" | "ink" | "warning" | "brake";

export type DayMark = {
  id: string;
  day: CalendarDay;
  tone: DayMarkTone;
  label: string;
};

export type WeekNavigation = "previous" | "current" | "next";

/** Marks that fit in a day cell before the rest collapse into "+n". */
export const VISIBLE_MARKS = 3;

export const weekStripClasses = createComponentClasses("WeekStrip", [
  "root",
  "header",
  "label",
  "rangeWide",
  "rangeNarrow",
  "nav",
  "aside",
  "grid",
  "day",
  "dayHead",
  "weekday",
  "number",
  "todayTag",
  "marks",
  "mark",
  "free",
  "dots",
  "dot",
]);
