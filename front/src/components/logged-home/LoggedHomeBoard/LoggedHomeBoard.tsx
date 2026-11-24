"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  addDays,
  type CalendarDay,
  startOfWeek,
  weekDays,
} from "@/lib/date/calendarDay";
import PendingList, {
  findDueSoon,
  type PendingEntry,
  type PendingListCopy,
  type PendingSort,
  selectEntries,
} from "../PendingList";
import WeekStrip, { type DayMark, type WeekNavigation } from "../WeekStrip";
import {
  LoggedHomeBoardAside,
  LoggedHomeBoardBalance,
  LoggedHomeBoardHeading,
  LoggedHomeBoardListings,
  LoggedHomeBoardNotice,
  LoggedHomeBoardPending,
  LoggedHomeBoardRoot,
  LoggedHomeBoardWeek,
} from "./LoggedHomeBoard.style";
import { loggedHomeBoardClasses } from "./LoggedHomeBoard.util";

export type LoggedHomeBoardProps = {
  locale: Locale;
  today: CalendarDay;
  entries: readonly PendingEntry[];
  marks: readonly DayMark[];
  copy: { week: Dictionary["loggedHome"]["week"]; pending: PendingListCopy };
  heading: React.ReactNode;
  /** Full balance from `md` up. */
  balance: React.ReactNode;
  /** Balance squeezed next to the week range on phones. */
  compactBalance: React.ReactNode;
  notice?: React.ReactNode;
  aside: React.ReactNode;
  listings?: React.ReactNode;
  /** Replaces the list when nothing is pending on any day. */
  upToDate?: React.ReactNode;
};

/** Owns the selected day, the visible week and the sort; everything else arrives rendered. */
export default function LoggedHomeBoard({
  locale,
  today,
  entries,
  marks,
  copy,
  heading,
  balance,
  compactBalance,
  notice,
  aside,
  listings,
  upToDate,
}: LoggedHomeBoardProps) {
  const [selected, setSelected] = useState(today);
  const [sort, setSort] = useState<PendingSort>("urgency");
  const week = startOfWeek(selected);

  const navigate = (to: WeekNavigation) => {
    if (to === "current") {
      setSelected(today);
      return;
    }

    const target = addDays(week, to === "next" ? 7 : -7);
    setSelected(weekDays(target).includes(today) ? today : target);
  };

  return (
    <LoggedHomeBoardRoot
      className={loggedHomeBoardClasses.root}
      ownerState={{ hasNotice: Boolean(notice) }}
    >
      <LoggedHomeBoardHeading className={loggedHomeBoardClasses.heading}>
        {heading}
      </LoggedHomeBoardHeading>
      <LoggedHomeBoardBalance className={loggedHomeBoardClasses.balance}>
        {balance}
      </LoggedHomeBoardBalance>
      {notice ? (
        <LoggedHomeBoardNotice className={loggedHomeBoardClasses.notice}>
          {notice}
        </LoggedHomeBoardNotice>
      ) : null}
      <LoggedHomeBoardWeek className={loggedHomeBoardClasses.week}>
        <WeekStrip
          locale={locale}
          today={today}
          week={week}
          selected={selected}
          marks={marks}
          copy={copy.week}
          onSelect={setSelected}
          onNavigate={navigate}
          aside={compactBalance}
        />
      </LoggedHomeBoardWeek>
      <LoggedHomeBoardPending className={loggedHomeBoardClasses.pending}>
        <PendingList
          locale={locale}
          entries={selectEntries(entries, selected, today, sort)}
          dueSoon={findDueSoon(entries, selected, today)}
          sort={sort}
          copy={copy.pending}
          onSortChange={setSort}
          onShowDay={setSelected}
          upToDate={upToDate}
        />
      </LoggedHomeBoardPending>
      <LoggedHomeBoardAside className={loggedHomeBoardClasses.aside}>
        {aside}
      </LoggedHomeBoardAside>
      {listings ? (
        <LoggedHomeBoardListings className={loggedHomeBoardClasses.listings}>
          {listings}
        </LoggedHomeBoardListings>
      ) : null}
    </LoggedHomeBoardRoot>
  );
}
