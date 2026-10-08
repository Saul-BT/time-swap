"use client";

import { useId } from "react";
import SegmentedControl from "@/components/ui/SegmentedControl";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  type CalendarDay,
  capitalize,
  formatWeekday,
  formatWeekdayAndDay,
} from "@/lib/date/calendarDay";
import { interpolate } from "@/lib/i18n/interpolate";
import BoardSectionHead from "../BoardSectionHead";
import DueSoonNotice from "../DueSoonNotice";
import {
  PendingListEmpty,
  PendingListItem,
  PendingListList,
  PendingListNotice,
  PendingListSort,
} from "./PendingList.style";
import {
  type DueSoon,
  type PendingEntry,
  type PendingSort,
  pendingListClasses,
} from "./PendingList.util";

export type PendingListCopy = Pick<
  Dictionary["loggedHome"]["pending"],
  "title" | "sort" | "dueSoon" | "emptyDay"
>;

export type PendingListProps = {
  locale: Locale;
  entries: readonly PendingEntry[];
  dueSoon: DueSoon | null;
  sort: PendingSort;
  copy: PendingListCopy;
  onSortChange: (sort: PendingSort) => void;
  onShowDay: (day: CalendarDay) => void;
  /** Shown instead of the list when nothing is pending on any day. */
  upToDate?: React.ReactNode;
};

function joinFragments(locale: Locale, fragments: string[]): string {
  return capitalize(
    new Intl.ListFormat(locale, { type: "conjunction" }).format(fragments),
  );
}

export default function PendingList({
  locale,
  entries,
  dueSoon,
  sort,
  copy,
  onSortChange,
  onShowDay,
  upToDate,
}: PendingListProps) {
  const titleId = useId();
  const dueSoonWeekday = dueSoon
    ? formatWeekday(locale, dueSoon.day, "long")
    : "";

  return (
    <section className={pendingListClasses.root} aria-labelledby={titleId}>
      <BoardSectionHead
        id={titleId}
        title={copy.title}
        count={entries.length}
        end={
          upToDate ? null : (
            <PendingListSort className={pendingListClasses.sort}>
              <SegmentedControl<PendingSort>
                label={copy.sort.label}
                value={sort}
                onChange={onSortChange}
                options={[
                  { value: "urgency", label: copy.sort.urgency },
                  { value: "kind", label: copy.sort.kind },
                ]}
              />
            </PendingListSort>
          )
        }
      />

      {upToDate ?? (
        <PendingListList className={pendingListClasses.list}>
          {dueSoon ? (
            <PendingListNotice className={pendingListClasses.notice}>
              <DueSoonNotice
                title={interpolate(copy.dueSoon.title, {
                  day: formatWeekdayAndDay(locale, dueSoon.day, "long"),
                })}
                actionLabel={interpolate(copy.dueSoon.show, {
                  day: dueSoonWeekday,
                })}
                onShow={() => onShowDay(dueSoon.day)}
              >
                {joinFragments(
                  locale,
                  dueSoon.entries.map((entry) => entry.dueSoonLabel),
                )}
              </DueSoonNotice>
            </PendingListNotice>
          ) : null}

          {entries.map((entry) => (
            <PendingListItem key={entry.id} className={pendingListClasses.item}>
              {entry.node}
            </PendingListItem>
          ))}
        </PendingListList>
      )}

      {!upToDate && entries.length === 0 ? (
        <PendingListEmpty className={pendingListClasses.empty} variant="body2">
          {copy.emptyDay}
        </PendingListEmpty>
      ) : null}
    </section>
  );
}
