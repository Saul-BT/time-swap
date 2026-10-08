import { DUE_SOON_DAYS, PENDING_PRIORITY } from "@/data/logged-home";
import type { PendingKind } from "@/data/types";
import { addDays, type CalendarDay } from "@/lib/date/calendarDay";
import { createComponentClasses } from "@/lib/mui/componentClasses";

/** A pending row already rendered on the server, plus what the board needs to place it. */
export type PendingEntry = {
  id: string;
  kind: PendingKind;
  day?: CalendarDay;
  since: string;
  /** Lower-case fragment for the due-soon sentence, e.g. "solicitud de [Nombre]". */
  dueSoonLabel: string;
  node: React.ReactNode;
};

export type PendingSort = "urgency" | "kind";

export type DueSoon = { day: CalendarDay; entries: PendingEntry[] };

/** Overdue items stay on today instead of vanishing into the past. */
function effectiveDay(
  entry: PendingEntry,
  today: CalendarDay,
): CalendarDay | undefined {
  return entry.day && entry.day < today ? today : entry.day;
}

function byPriority(a: PendingEntry, b: PendingEntry): number {
  return PENDING_PRIORITY.indexOf(a.kind) - PENDING_PRIORITY.indexOf(b.kind);
}

/** Dated first by day, then the most pressing kind, then the longest waiting. */
function byUrgency(a: PendingEntry, b: PendingEntry): number {
  if (a.day !== b.day) {
    if (!a.day) return 1;
    if (!b.day) return -1;
    return a.day < b.day ? -1 : 1;
  }

  return byPriority(a, b) || a.since.localeCompare(b.since);
}

/** What "Te toca" lists for `selected`: that day's actions plus everything without a date. */
export function selectEntries(
  entries: readonly PendingEntry[],
  selected: CalendarDay,
  today: CalendarDay,
  sort: PendingSort,
): PendingEntry[] {
  return entries
    .filter((entry) => {
      const day = effectiveDay(entry, today);
      return !day || day === selected;
    })
    .sort(sort === "urgency" ? byUrgency : byPriority);
}

/** The nearest upcoming day, other than `selected`, with something due within `DUE_SOON_DAYS`. */
export function findDueSoon(
  entries: readonly PendingEntry[],
  selected: CalendarDay,
  today: CalendarDay,
): DueSoon | null {
  const horizon = addDays(today, DUE_SOON_DAYS);
  const upcoming = entries.filter(
    (entry): entry is PendingEntry & { day: CalendarDay } =>
      entry.day !== undefined &&
      entry.day > today &&
      entry.day <= horizon &&
      entry.day !== selected,
  );

  if (upcoming.length === 0) {
    return null;
  }

  const day = upcoming.map((entry) => entry.day).sort()[0];

  return {
    day,
    entries: upcoming.filter((entry) => entry.day === day).sort(byPriority),
  };
}

export const pendingListClasses = createComponentClasses("PendingList", [
  "root",
  "sort",
  "list",
  "notice",
  "item",
  "empty",
]);
