import type { LinkTarget } from "@/i18n/routes";
import type { Dictionary } from "@/i18n/types";
import type { CalendarDay } from "@/lib/date/calendarDay";

/**
 * Ids are derived from the dictionary shape, so an id without a translation,
 * or a translation without an id, fails the build instead of rendering empty.
 */

export type ListingKind = keyof Dictionary["listings"]["kind"];

export type ListingMode = keyof Dictionary["listings"]["mode"];

export type Listing = {
  id: number;
  kind: ListingKind;
  mode: ListingMode;
  /** Author-written text. Not translated. */
  title: string;
  /** Author-written text. Not translated. */
  summary: string;
  byline: string;
  /** Free text such as `"1 h + material"`, not a number. */
  hours: string;
};

/** `label` is the accessible name of the list, not a filter. */
export type FilterId = Exclude<keyof Dictionary["hero"]["filters"], "label">;

export type Filter = {
  id: FilterId;
  active?: boolean;
};

export type CategoryId = keyof Dictionary["categories"]["items"];

export type LedgerFactId = keyof Dictionary["howItWorks"]["facts"];

export type Member = {
  id: string;
  name: string;
  initial: string;
  /** Area and exchange count, as one line. */
  context: string;
  /** Member-written text. Not translated. */
  quote: string;
  skills: readonly string[];
};

export type NavigationLinkId = keyof Dictionary["nav"];
export type FooterLinkId = keyof Dictionary["footer"]["links"];

export type NavigationLink = {
  id: Exclude<NavigationLinkId, "label" | "signUp">;
  /** Resolved per locale with `localizePath`. */
  target: LinkTarget;
};

export type FooterLink = {
  id: FooterLinkId;
  href: string;
};

export type SignInErrorId = keyof Dictionary["signIn"]["errors"];

export type RegisterErrorId = keyof Dictionary["register"]["errors"];

export type RegisterInput = {
  fullName: string;
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  postalCode: string;
};

export type PreferencesInput = {
  interests: Array<Number>;
  skills: Array<Number>;
};

export type RegisterResult =
  | { ok: true }
  | { ok: false; error: RegisterErrorId };

export type BackendError = {
  error: number;
  message: string;
};

export function isBackendError(
  value: unknown,
): value is BackendError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    "message" in value
  );
}

export type MemberNavId = Exclude<
  keyof Dictionary["memberNav"],
  "label" | "unread" | "profileLabel"
>;

export type PendingKind = keyof Dictionary["loggedHome"]["pending"]["kinds"];

export type ProposalChange =
  keyof Dictionary["loggedHome"]["pending"]["kinds"]["proposal"]["changes"];

/** An agreed slot: a calendar day plus a wall-clock time such as `"18:00"`. */
export type Slot = { day: CalendarDay; time: string };

type PendingBase = {
  id: string;
  /** Member-written name. Not translated. */
  counterpart: string;
  /** Title of the listing the item is about. Author-written, not translated. */
  listing: string;
  /** ISO date-time of the event that put the item on the list. */
  since: string;
  /** Day the action is due. Absent when nothing forces a date. */
  due?: CalendarDay;
  /** Arrived through the live channel since the page loaded. */
  isNew?: boolean;
};

export type PendingItem =
  | (PendingBase & { kind: "dispute" })
  | (PendingBase & { kind: "contactRequest" })
  | (PendingBase & {
      kind: "proposal";
      version: number;
      slot: Slot;
      mode: ListingMode;
      hours: number;
      change?: ProposalChange;
      /** The counterpart replaced the version on screen with a newer one. */
      supersededBy?: { version: number; slot: Slot };
    })
  | (PendingBase & {
      kind: "confirmExchange";
      hours: number;
      direction: "gave" | "received";
    })
  | (PendingBase & {
      kind: "messages";
      unread: number;
      /** Member-written text. Not translated. */
      excerpt: string;
    })
  | (PendingBase & { kind: "rating" });

export type WaitingItem =
  | {
      id: string;
      kind: "sentRequest";
      counterpart: string;
      since: string;
      expiresOn: CalendarDay;
    }
  | {
      id: string;
      kind: "proposalReview";
      counterpart: string;
      listing: string;
      version: number;
    };

export type Appointment = {
  id: string;
  slot: Slot;
  /** Author-written listing title. Not translated. */
  title: string;
  /** Two or three words for the week strip. Not translated. */
  shortTitle: string;
  counterpart: string;
  mode: ListingMode;
  hours: number;
  direction: "give" | "receive";
  /** `awaitingYou` until the member accepts the latest version. */
  status: "confirmed" | "awaitingYou";
};

export type OwnListingsSummary = {
  active: number;
  expiring: readonly { title: string; on: CalendarDay }[];
  paused: readonly { title: string }[];
};

export type FirstStepId = keyof Dictionary["loggedHome"]["firstTime"]["steps"];

export type SyncStatus = keyof Dictionary["loggedHome"]["sync"];

/** Everything the member home shows, in the shape the API is expected to return. */
export type MemberHome = {
  member: {
    name: string;
    initials: string;
    /** As the API returns it, already masked. */
    maskedEmail: string;
    emailVerified: boolean;
  };
  balanceHours: number;
  unreadMessages: number;
  pending: readonly PendingItem[];
  waiting: readonly WaitingItem[];
  appointments: readonly Appointment[];
  ownListings: OwnListingsSummary;
  /** Present until the member finishes the first steps. */
  firstSteps?: { done: readonly FirstStepId[] };
  sync: { status: SyncStatus; lastSyncedAt: string };
  /** A change pushed by the counterpart while the page was open. */
  liveUpdate?: { counterpart: string; listing: string };
};
