/**
 * A calendar day as `YYYY-MM-DD`, free of time zones. All arithmetic runs in
 * UTC so a day never shifts when the server and the browser disagree on the
 * zone.
 */
export type CalendarDay = `${number}-${number}-${number}`;

const MS_PER_DAY = 86_400_000;

function toDate(day: CalendarDay): Date {
  return new Date(`${day}T00:00:00Z`);
}

function fromDate(date: Date): CalendarDay {
  return date.toISOString().slice(0, 10) as CalendarDay;
}

/** The local calendar day of `date`, read in the runtime's time zone. */
export function calendarDayOf(date: Date): CalendarDay {
  return fromDate(
    new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
  );
}

export function addDays(day: CalendarDay, amount: number): CalendarDay {
  return fromDate(new Date(toDate(day).getTime() + amount * MS_PER_DAY));
}

/** Whole days from `from` to `to`; negative when `to` is earlier. */
export function daysBetween(from: CalendarDay, to: CalendarDay): number {
  return Math.round(
    (toDate(to).getTime() - toDate(from).getTime()) / MS_PER_DAY,
  );
}

/** Weeks start on Monday. */
export function startOfWeek(day: CalendarDay): CalendarDay {
  const weekday = (toDate(day).getUTCDay() + 6) % 7;
  return addDays(day, -weekday);
}

/**
 * @example
 * weekDays("2026-10-07"); // ["2026-10-05", …, "2026-10-11"]
 */
export function weekDays(day: CalendarDay): CalendarDay[] {
  const monday = startOfWeek(day);
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
}

export function dayOfMonth(day: CalendarDay): number {
  return toDate(day).getUTCDate();
}

/** Upper-cases the first letter: `Intl` writes Spanish weekdays in lower case. */
export function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}

/**
 * In the locale's own case, so it can sit mid-sentence; `capitalize` it to lead.
 *
 * @example
 * formatWeekday("es", "2026-10-08", "short"); // "jue"
 * formatWeekday("en", "2026-10-08", "long"); // "Thursday"
 */
export function formatWeekday(
  locale: string,
  day: CalendarDay,
  width: "short" | "long",
): string {
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: width,
    timeZone: "UTC",
  }).format(toDate(day));

  return weekday.replace(/\.$/, "");
}

/**
 * @example
 * formatDay("es", "2026-10-06", { weekday: "long", day: "numeric", month: "long" });
 * // "Martes, 6 de octubre"
 */
export function formatDay(
  locale: string,
  day: CalendarDay,
  options: Intl.DateTimeFormatOptions,
): string {
  return capitalize(
    new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).format(
      toDate(day),
    ),
  );
}

/**
 * Weekday and day of the month, without the comma `Intl` puts between them.
 *
 * @example
 * formatWeekdayAndDay("es", "2026-10-08", "short"); // "jue 8"
 * formatWeekdayAndDay("en", "2026-10-08", "long"); // "Thursday 8"
 */
export function formatWeekdayAndDay(
  locale: string,
  day: CalendarDay,
  width: "short" | "long",
): string {
  return `${formatWeekday(locale, day, width)} ${dayOfMonth(day)}`;
}

/**
 * @example
 * formatShortDate("es", "2026-10-10"); // "sáb 10 oct"
 */
export function formatShortDate(locale: string, day: CalendarDay): string {
  const month = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC",
  })
    .format(toDate(day))
    .replace(/\.$/, "");

  return `${formatWeekdayAndDay(locale, day, "short")} ${month}`;
}

/**
 * @example
 * formatDayRange("es", "2026-10-05", "2026-10-11", "long"); // "5–11 de octubre"
 */
export function formatDayRange(
  locale: string,
  start: CalendarDay,
  end: CalendarDay,
  month: "short" | "long",
): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month,
    timeZone: "UTC",
  }).formatRange(toDate(start), toDate(end));
}

/**
 * Coarse "how long ago", in the locale's words and case.
 *
 * @example
 * formatElapsed("es", "2026-10-06T10:00:00Z", new Date("2026-10-06T10:20:00Z")); // "hace 20 minutos"
 * formatElapsed("es", "2026-10-05T18:00:00Z", new Date("2026-10-06T10:00:00Z")); // "ayer"
 * formatElapsed("en", "2026-10-06T10:00:00Z", new Date("2026-10-06T10:00:20Z")); // "now"
 */
export function formatElapsed(
  locale: string,
  since: string,
  now: Date,
): string {
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const minutes = Math.round(
    (new Date(since).getTime() - now.getTime()) / 60_000,
  );
  const days = daysBetween(calendarDayOf(now), calendarDayOf(new Date(since)));

  if (days !== 0) {
    return format.format(days, "day");
  }

  if (minutes > -1) {
    return format.format(0, "second");
  }

  if (minutes > -60) {
    return format.format(minutes, "minute");
  }

  return format.format(Math.round(minutes / 60), "hour");
}
