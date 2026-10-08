import {
  Calendar,
  Check,
  Clock,
  Handshake,
  type LucideIcon,
  MessageCircle,
  Scale,
  Star,
  UserPlus,
} from "lucide-react";
import type { IconBoxTone } from "@/components/ui/IconBox";
import type {
  Appointment,
  MemberHome,
  PendingItem,
  PendingKind,
  WaitingItem,
} from "@/data/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import {
  type CalendarDay,
  capitalize,
  dayOfMonth,
  daysBetween,
  formatElapsed,
  formatShortDate,
  formatWeekday,
  formatWeekdayAndDay,
} from "@/lib/date/calendarDay";
import { interpolate } from "@/lib/i18n/interpolate";
import { plural } from "@/lib/i18n/plural";
import { createComponentClasses } from "@/lib/mui/componentClasses";
import type { AppointmentListEntry } from "../AppointmentList";
import type { OwnListingsPart } from "../OwnListingsBar";
import type { PendingRowProps } from "../PendingRow";
import type { WaitingRowProps } from "../WaitingRow";
import type { DayMark, DayMarkTone } from "../WeekStrip";

const SEPARATOR = " · ";

const PENDING_ICON: Record<PendingKind, LucideIcon> = {
  dispute: Scale,
  contactRequest: UserPlus,
  proposal: Handshake,
  confirmExchange: Check,
  messages: MessageCircle,
  rating: Star,
};

/** The brake leads only for a dispute: it is the one item under review. */
const PENDING_ICON_TONE: Partial<Record<PendingKind, IconBoxTone>> = {
  dispute: "brake",
};

const PENDING_MARK_TONE: Record<PendingKind, DayMarkTone> = {
  dispute: "brake",
  contactRequest: "warning",
  proposal: "accent",
  confirmExchange: "accent",
  messages: "ink",
  rating: "ink",
};

export type ScreenContext = {
  locale: Locale;
  today: CalendarDay;
  now: Date;
  copy: Dictionary["loggedHome"];
  modes: Dictionary["listings"]["mode"];
};

function hours(context: ScreenContext, value: number): string {
  return interpolate(context.copy.balance.hours, { hours: value });
}

function dueDay(context: ScreenContext, item: PendingItem): string {
  return item.due ? formatWeekdayAndDay(context.locale, item.due, "long") : "";
}

function describe(
  item: PendingItem,
  context: ScreenContext,
): Pick<PendingRowProps, "label" | "title" | "detail" | "actions" | "alert"> {
  const { kinds } = context.copy.pending;
  const name = item.counterpart;
  const listing = item.listing;

  switch (item.kind) {
    case "dispute":
      return {
        label: kinds.dispute.label,
        title: interpolate(kinds.dispute.title, { listing, name }),
        detail: interpolate(kinds.dispute.detail, {
          day: dueDay(context, item),
        }),
        actions: [{ label: kinds.dispute.primary }],
      };
    case "contactRequest":
      return {
        label: kinds.contactRequest.label,
        title: interpolate(kinds.contactRequest.title, { name }),
        detail: interpolate(kinds.contactRequest.detail, {
          listing,
          day: dueDay(context, item),
        }),
        actions: [
          { label: kinds.contactRequest.primary, primary: true },
          { label: kinds.contactRequest.secondary },
        ],
      };
    case "proposal": {
      const copy = kinds.proposal;
      const slotText = (slot: typeof item.slot) =>
        `${capitalize(formatShortDate(context.locale, slot.day))}${SEPARATOR}${slot.time}`;
      const detail = interpolate(copy.detail, {
        when: slotText(item.slot),
        mode: context.modes[item.mode].toLocaleLowerCase(context.locale),
        hours: hours(context, item.hours),
      });

      return {
        label: interpolate(copy.label, { version: item.version }),
        title: interpolate(copy.title, { listing, name }),
        detail: item.change ? `${detail} ${copy.changes[item.change]}` : detail,
        actions: item.supersededBy
          ? [
              {
                label: interpolate(copy.superseded.action, {
                  version: item.supersededBy.version,
                }),
                primary: true,
              },
            ]
          : [{ label: copy.primary }],
        alert: item.supersededBy
          ? {
              title: interpolate(copy.superseded.title, { name }),
              body: interpolate(copy.superseded.body, {
                now: slotText(item.supersededBy.slot),
                before: item.slot.time,
              }),
            }
          : undefined,
      };
    }
    case "confirmExchange":
      return {
        label: kinds.confirmExchange.label,
        title: interpolate(kinds.confirmExchange.title, { listing, name }),
        detail: interpolate(kinds.confirmExchange.detail[item.direction], {
          hours: hours(context, item.hours),
        }),
        actions: [
          { label: kinds.confirmExchange.primary, primary: true },
          { label: kinds.confirmExchange.secondary },
        ],
      };
    case "messages":
      return {
        label: plural(context.locale, item.unread, kinds.messages.label),
        title: interpolate(kinds.messages.title, {
          name,
          excerpt: item.excerpt,
        }),
        detail: interpolate(kinds.messages.detail, { listing }),
        actions: [{ label: kinds.messages.primary }],
      };
    case "rating":
      return {
        label: kinds.rating.label,
        title: interpolate(kinds.rating.title, { name }),
        detail: interpolate(kinds.rating.detail, {
          listing,
          when: formatElapsed(context.locale, item.since, context.now),
        }),
        actions: [{ label: kinds.rating.primary }],
      };
  }
}

/** Everything a pending row shows, plus the fragment the due-soon sentence borrows. */
export function buildPendingRow(
  item: PendingItem,
  context: ScreenContext,
  blockedReason?: string,
): PendingRowProps & { dueSoonLabel: string } {
  const { pending } = context.copy;
  const elapsed = formatElapsed(context.locale, item.since, context.now);

  return {
    ...describe(item, context),
    icon: PENDING_ICON[item.kind],
    iconTone: PENDING_ICON_TONE[item.kind],
    isNew: item.isNew,
    ...(item.isNew && {
      label: interpolate(pending.isNew, { when: elapsed }),
    }),
    day: item.due
      ? {
          text:
            item.due === context.today
              ? pending.today
              : capitalize(
                  formatWeekdayAndDay(context.locale, item.due, "short"),
                ),
          tone: "solid",
          icon: Calendar,
        }
      : { text: pending.undated, tone: "quiet", icon: Clock },
    meta:
      item.kind === "proposal" && !item.supersededBy
        ? pending.waitingYou
        : capitalize(elapsed),
    blocked: blockedReason
      ? { id: `${item.id}-blocked`, reason: blockedReason }
      : undefined,
    dueSoonLabel: interpolate(pending.kinds[item.kind].dueSoon, {
      name: item.counterpart,
    }),
  };
}

export function buildMarks(
  home: MemberHome,
  context: ScreenContext,
): DayMark[] {
  const { kinds } = context.copy.pending;
  const pendingMarks = home.pending.flatMap((item): DayMark[] =>
    item.due
      ? [
          {
            id: item.id,
            day: item.due,
            tone: PENDING_MARK_TONE[item.kind],
            label: interpolate(kinds[item.kind].mark, {
              name: item.counterpart,
            }),
          },
        ]
      : [],
  );
  const appointmentMarks = home.appointments.map(
    (appointment): DayMark => ({
      id: appointment.id,
      day: appointment.slot.day,
      tone: appointment.status === "awaitingYou" ? "accent" : "ink",
      label: `${appointment.slot.time} ${appointment.shortTitle}`,
    }),
  );

  return [...pendingMarks, ...appointmentMarks];
}

export function buildWaitingRow(
  item: WaitingItem,
  context: ScreenContext,
): Omit<WaitingRowProps, "disabled"> {
  const { waiting } = context.copy;

  if (item.kind === "sentRequest") {
    return {
      title: interpolate(waiting.sentRequest.title, { name: item.counterpart }),
      detail: plural(
        context.locale,
        daysBetween(context.today, item.expiresOn),
        waiting.sentRequest.detail,
        {
          sent: capitalize(
            formatElapsed(context.locale, item.since, context.now),
          ),
        },
      ),
      actionLabel: waiting.sentRequest.action,
    };
  }

  return {
    title: interpolate(waiting.proposalReview.title, {
      name: item.counterpart,
    }),
    detail: interpolate(waiting.proposalReview.detail, {
      listing: item.listing,
      version: item.version,
    }),
    actionLabel: waiting.proposalReview.action,
  };
}

export function buildAppointment(
  appointment: Appointment,
  context: ScreenContext,
): AppointmentListEntry {
  const { appointments } = context.copy;
  const exchange = interpolate(appointments[appointment.direction], {
    hours: hours(context, appointment.hours),
  });
  const last =
    appointment.status === "awaitingYou"
      ? appointments.awaitingYou
      : context.modes[appointment.mode].toLocaleLowerCase(context.locale);

  return {
    id: appointment.id,
    weekday: formatWeekday(context.locale, appointment.slot.day, "short"),
    day: dayOfMonth(appointment.slot.day),
    title: `${appointment.title}${SEPARATOR}${appointment.slot.time}`,
    detail: [
      interpolate(appointments.with, { name: appointment.counterpart }),
      exchange,
      last,
    ].join(SEPARATOR),
  };
}

export function buildOwnListings(
  summary: MemberHome["ownListings"],
  context: ScreenContext,
): { wide: OwnListingsPart[]; narrow: OwnListingsPart[] } {
  const { ownListings } = context.copy;
  const { locale } = context;
  const active: OwnListingsPart = {
    text: plural(locale, summary.active, ownListings.active),
    tone: "plain",
  };
  const firstExpiry = summary.expiring[0];

  return {
    wide: [
      active,
      ...summary.expiring.map((listing) => ({
        text: interpolate(ownListings.expiresTitled, {
          title: listing.title,
          day: formatWeekday(locale, listing.on, "long"),
        }),
        tone: "warning" as const,
      })),
      ...summary.paused.map((listing) => ({
        text: interpolate(ownListings.pausedTitled, { title: listing.title }),
        tone: "brake" as const,
      })),
    ],
    narrow: [
      active,
      ...(firstExpiry
        ? [
            {
              text: plural(
                locale,
                summary.expiring.length,
                ownListings.expiresCount,
                { day: formatWeekday(locale, firstExpiry.on, "long") },
              ),
              tone: "warning" as const,
            },
          ]
        : []),
      ...(summary.paused.length > 0
        ? [
            {
              text: plural(
                locale,
                summary.paused.length,
                ownListings.pausedCount,
              ),
              tone: "brake" as const,
            },
          ]
        : []),
    ],
  };
}

export const loggedHomeScreenClasses = createComponentClasses(
  "LoggedHomeScreen",
  ["root", "heading", "dateLine", "status", "statusDot", "upToDate"],
);
