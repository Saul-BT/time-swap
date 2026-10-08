import {
  addDays,
  type CalendarDay,
  calendarDayOf,
} from "@/lib/date/calendarDay";
import type { MemberHome, PendingItem, PendingKind } from "./types";

/** Most pressing first. Breaks ties when sorting by urgency, leads when sorting by kind. */
export const PENDING_PRIORITY: readonly PendingKind[] = [
  "dispute",
  "contactRequest",
  "proposal",
  "confirmExchange",
  "messages",
  "rating",
];

/** How many days ahead a deadline is announced above the selected day. */
export const DUE_SOON_DAYS = 3;

/**
 * Data states the sample member home can be switched to with `?state=`.
 * `loading` and `sessionExpired` are page states, not data.
 */
export const LOGGED_HOME_STATES = [
  "default",
  "firstTime",
  "upToDate",
  "unverified",
  "live",
  "offline",
  "loading",
  "sessionExpired",
] as const;

export type LoggedHomeState = (typeof LOGGED_HOME_STATES)[number];

export function isLoggedHomeState(value: unknown): value is LoggedHomeState {
  return (
    typeof value === "string" &&
    (LOGGED_HOME_STATES as readonly string[]).includes(value)
  );
}

function minutesAgo(now: Date, minutes: number): string {
  return new Date(now.getTime() - minutes * 60_000).toISOString();
}

function daysAgo(now: Date, days: number): string {
  return minutesAgo(now, days * 24 * 60);
}

function samplePending(now: Date, today: CalendarDay): PendingItem[] {
  return [
    {
      id: "pending-proposal",
      kind: "proposal",
      counterpart: "[Nombre]",
      listing: "Clases de guitarra",
      since: minutesAgo(now, 90),
      due: today,
      version: 2,
      slot: { day: addDays(today, 4), time: "11:00" },
      mode: "inPerson",
      hours: 2,
      change: "time",
    },
    {
      id: "pending-messages",
      kind: "messages",
      counterpart: "[Nombre]",
      listing: "Huerto urbano",
      since: minutesAgo(now, 20),
      due: today,
      unread: 2,
      excerpt: "¿Te viene bien el jueves por la tarde?",
    },
    {
      id: "pending-confirm",
      kind: "confirmExchange",
      counterpart: "[Nombre]",
      listing: "Ayuda con el ordenador",
      since: daysAgo(now, 1),
      hours: 1,
      direction: "received",
    },
    {
      id: "pending-rating",
      kind: "rating",
      counterpart: "[Nombre]",
      listing: "Paseo de perros",
      since: daysAgo(now, 1),
    },
    {
      id: "pending-dispute",
      kind: "dispute",
      counterpart: "[Nombre]",
      listing: "Mudanza pequeña",
      since: daysAgo(now, 3),
      due: addDays(today, 2),
    },
    {
      id: "pending-contact",
      kind: "contactRequest",
      counterpart: "[Nombre]",
      listing: "Reparo bicicletas y enseño a hacerlo",
      since: daysAgo(now, 12),
      due: addDays(today, 2),
    },
  ];
}

function sampleHome(now: Date): MemberHome {
  const today = calendarDayOf(now);

  return {
    member: {
      name: "[Nombre]",
      initials: "N",
      maskedEmail: "n·····@correo.com",
      emailVerified: true,
    },
    balanceHours: 2,
    unreadMessages: 3,
    pending: samplePending(now, today),
    waiting: [
      {
        id: "waiting-request",
        kind: "sentRequest",
        counterpart: "[Nombre]",
        since: daysAgo(now, 3),
        expiresOn: addDays(today, 11),
      },
      {
        id: "waiting-proposal",
        kind: "proposalReview",
        counterpart: "[Nombre]",
        listing: "Huerto urbano",
        version: 1,
      },
    ],
    appointments: [
      {
        id: "appointment-doctor",
        slot: { day: addDays(today, 2), time: "18:00" },
        title: "Acompaño a gestiones y consultas médicas",
        shortTitle: "Médico",
        counterpart: "[Nombre]",
        mode: "inPerson",
        hours: 1,
        direction: "give",
        status: "confirmed",
      },
      {
        id: "appointment-guitar",
        slot: { day: addDays(today, 4), time: "11:00" },
        title: "Clases de guitarra",
        shortTitle: "Guitarra",
        counterpart: "[Nombre]",
        mode: "inPerson",
        hours: 2,
        direction: "receive",
        status: "awaitingYou",
      },
    ],
    ownListings: {
      active: 2,
      expiring: [{ title: "Clases de móvil", on: addDays(today, 4) }],
      paused: [{ title: "Busco ayuda con la declaración" }],
    },
    sync: { status: "upToDate", lastSyncedAt: now.toISOString() },
  };
}

// FIXME(api): sample data. Replace with the member-home endpoint once it
// exists; keep `MemberHome` as the contract the components read.
export function getSampleMemberHome(
  now: Date,
  state: LoggedHomeState,
): MemberHome {
  const home = sampleHome(now);

  switch (state) {
    case "firstTime":
      return {
        ...home,
        balanceHours: 0,
        unreadMessages: 0,
        pending: [],
        waiting: [],
        appointments: [],
        ownListings: { active: 0, expiring: [], paused: [] },
        firstSteps: { done: [] },
      };
    case "upToDate":
      return { ...home, unreadMessages: 0, pending: [], waiting: [] };
    case "unverified":
      return {
        ...home,
        member: { ...home.member, emailVerified: false },
        pending: home.pending
          .filter((item) => item.kind === "contactRequest")
          .map((item) => ({ ...item, due: calendarDayOf(now) })),
      };
    case "live":
      return {
        ...home,
        pending: [
          {
            id: "pending-live-accepted",
            kind: "messages",
            counterpart: "[Nombre]",
            listing: "Costura a máquina",
            since: minutesAgo(now, 0),
            due: calendarDayOf(now),
            unread: 1,
            excerpt: "¡Hola! Acepté tu solicitud, ¿hablamos?",
            isNew: true,
          },
          ...home.pending.map((item) =>
            item.kind === "proposal"
              ? {
                  ...item,
                  supersededBy: {
                    version: 3,
                    slot: { ...item.slot, time: "12:00" },
                  },
                }
              : item,
          ),
        ],
        sync: { ...home.sync, status: "live" },
        liveUpdate: { counterpart: "[Nombre]", listing: "Huerto urbano" },
      };
    case "offline":
      return {
        ...home,
        sync: { status: "offline", lastSyncedAt: minutesAgo(now, 5) },
      };
    default:
      return home;
  }
}
