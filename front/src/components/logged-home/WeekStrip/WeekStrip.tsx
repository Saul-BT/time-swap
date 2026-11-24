"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import SegmentedControl from "@/components/ui/SegmentedControl";
import Tag from "@/components/ui/Tag";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  type CalendarDay,
  capitalize,
  dayOfMonth,
  formatDay,
  formatDayRange,
  formatWeekday,
  weekDays,
} from "@/lib/date/calendarDay";
import { interpolate } from "@/lib/i18n/interpolate";
import { plural } from "@/lib/i18n/plural";
import {
  WeekStripAside,
  WeekStripDay,
  WeekStripDayHead,
  WeekStripDot,
  WeekStripDots,
  WeekStripFree,
  WeekStripGrid,
  WeekStripHeader,
  WeekStripLabel,
  WeekStripMark,
  WeekStripMarks,
  WeekStripNav,
  WeekStripNumber,
  WeekStripRangeNarrow,
  WeekStripRangeWide,
  WeekStripRoot,
  WeekStripTodayTag,
  WeekStripWeekday,
} from "./WeekStrip.style";
import {
  type DayMark,
  VISIBLE_MARKS,
  type WeekNavigation,
  weekStripClasses,
} from "./WeekStrip.util";

export type WeekStripProps = {
  locale: Locale;
  today: CalendarDay;
  /** Any day of the week on screen. */
  week: CalendarDay;
  selected: CalendarDay;
  marks: readonly DayMark[];
  copy: Dictionary["loggedHome"]["week"];
  onSelect: (day: CalendarDay) => void;
  onNavigate: (to: WeekNavigation) => void;
  /** Shown next to the range on phones, where the strip sticks under the header. */
  aside?: React.ReactNode;
};

export default function WeekStrip({
  locale,
  today,
  week,
  selected,
  marks,
  copy,
  onSelect,
  onNavigate,
  aside,
}: WeekStripProps) {
  const days = weekDays(week);
  const isCurrentWeek = days.includes(today);

  return (
    <WeekStripRoot className={weekStripClasses.root}>
      <WeekStripHeader className={weekStripClasses.header}>
        <WeekStripLabel className={weekStripClasses.label}>
          {copy.label}
        </WeekStripLabel>
        <WeekStripRangeWide
          className={weekStripClasses.rangeWide}
          variant="body2"
        >
          {formatDayRange(locale, days[0], days[6], "long")}
        </WeekStripRangeWide>
        <WeekStripRangeNarrow className={weekStripClasses.rangeNarrow}>
          {formatDayRange(locale, days[0], days[6], "short")}
        </WeekStripRangeNarrow>
        <WeekStripNav className={weekStripClasses.nav}>
          <SegmentedControl<WeekNavigation>
            label={copy.change}
            value={isCurrentWeek ? "current" : undefined}
            onChange={onNavigate}
            options={[
              {
                value: "previous",
                icon: ChevronLeft,
                ariaLabel: copy.previous,
                action: true,
              },
              { value: "current", label: copy.current },
              {
                value: "next",
                icon: ChevronRight,
                ariaLabel: copy.next,
                action: true,
              },
            ]}
          />
        </WeekStripNav>
        {aside ? (
          <WeekStripAside className={weekStripClasses.aside}>
            {aside}
          </WeekStripAside>
        ) : null}
      </WeekStripHeader>

      <WeekStripGrid
        className={weekStripClasses.grid}
        role="group"
        aria-label={interpolate(copy.pickDay, {
          range: formatDayRange(locale, days[0], days[6], "long"),
        })}
      >
        {days.map((day) => {
          const dayMarks = marks.filter((mark) => mark.day === day);
          const state = { selected: day === selected, today: day === today };
          const name = formatDay(locale, day, {
            weekday: "long",
            day: "numeric",
            month: "long",
          });

          return (
            <WeekStripDay
              key={day}
              type="button"
              className={weekStripClasses.day}
              ownerState={state}
              aria-pressed={state.selected}
              aria-current={state.today ? "date" : undefined}
              aria-label={
                dayMarks.length > 0
                  ? `${name}, ${plural(locale, dayMarks.length, copy.marks)}`
                  : `${name}, ${copy.free}`
              }
              onClick={() => onSelect(day)}
            >
              <WeekStripDayHead className={weekStripClasses.dayHead}>
                <WeekStripWeekday
                  className={weekStripClasses.weekday}
                  ownerState={state}
                >
                  {capitalize(formatWeekday(locale, day, "short"))}
                </WeekStripWeekday>
                <WeekStripNumber
                  className={weekStripClasses.number}
                  ownerState={state}
                >
                  {dayOfMonth(day)}
                </WeekStripNumber>
                {state.today ? (
                  <WeekStripTodayTag className={weekStripClasses.todayTag}>
                    <Tag tone="accent">{copy.today}</Tag>
                  </WeekStripTodayTag>
                ) : null}
              </WeekStripDayHead>

              {dayMarks.length > 0 ? (
                <WeekStripMarks className={weekStripClasses.marks}>
                  {dayMarks.slice(0, VISIBLE_MARKS).map((mark) => (
                    <WeekStripMark
                      key={mark.id}
                      className={weekStripClasses.mark}
                      ownerState={{ tone: mark.tone }}
                    >
                      {mark.label}
                    </WeekStripMark>
                  ))}
                  {dayMarks.length > VISIBLE_MARKS ? (
                    <WeekStripMark
                      className={weekStripClasses.mark}
                      ownerState={{ tone: "more" }}
                    >
                      +{dayMarks.length - VISIBLE_MARKS}
                    </WeekStripMark>
                  ) : null}
                </WeekStripMarks>
              ) : (
                <WeekStripFree className={weekStripClasses.free}>
                  {copy.free}
                </WeekStripFree>
              )}

              <WeekStripDots className={weekStripClasses.dots}>
                {dayMarks.slice(0, VISIBLE_MARKS).map((mark) => (
                  <WeekStripDot
                    key={mark.id}
                    className={weekStripClasses.dot}
                    ownerState={{ tone: mark.tone, onInk: state.selected }}
                  />
                ))}
              </WeekStripDots>
            </WeekStripDay>
          );
        })}
      </WeekStripGrid>
    </WeekStripRoot>
  );
}
