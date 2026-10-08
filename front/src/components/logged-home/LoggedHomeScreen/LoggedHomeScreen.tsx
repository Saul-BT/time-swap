import { Button, Link, Typography } from "@mui/material";
import { CircleCheck, MailWarning, Radio, WifiOff } from "lucide-react";
import IconBox from "@/components/ui/IconBox";
import type { MemberHome } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import {
  calendarDayOf,
  formatDay,
  formatElapsed,
} from "@/lib/date/calendarDay";
import { interpolate } from "@/lib/i18n/interpolate";
import AppointmentList from "../AppointmentList";
import BalanceSummary from "../BalanceSummary";
import CollapsibleSection from "../CollapsibleSection";
import FirstSteps from "../FirstSteps";
import HomeNotice from "../HomeNotice";
import LoggedHomeBoard from "../LoggedHomeBoard";
import OwnListingsBar from "../OwnListingsBar";
import PendingRow from "../PendingRow";
import WaitingRow from "../WaitingRow";
import {
  LoggedHomeScreenDateLine,
  LoggedHomeScreenRoot,
  LoggedHomeScreenStatus,
  LoggedHomeScreenStatusDot,
  LoggedHomeScreenUpToDate,
} from "./LoggedHomeScreen.style";
import {
  buildAppointment,
  buildMarks,
  buildOwnListings,
  buildPendingRow,
  buildWaitingRow,
  loggedHomeScreenClasses,
  type ScreenContext,
} from "./LoggedHomeScreen.util";

export type LoggedHomeScreenProps = {
  home: MemberHome;
  /** The request time. Every "today" and "ago" on the page is relative to it. */
  now: Date;
};

/** The signed-in home: what is due, on which day, and what is waiting on others. */
export default async function LoggedHomeScreen({
  home,
  now,
}: LoggedHomeScreenProps) {
  const { loggedHome, listings } = await getDictionary();
  const locale = await getLocale();
  const context: ScreenContext = {
    locale,
    today: calendarDayOf(now),
    now,
    copy: loggedHome,
    modes: listings.mode,
  };
  const { notices } = loggedHome;
  const offline = home.sync.status === "offline";
  const blockedReason = !home.member.emailVerified
    ? notices.unverified.reason
    : offline
      ? notices.offline.reason
      : undefined;

  const heading = (
    <div className={loggedHomeScreenClasses.heading}>
      <Typography variant="h2" component="h1">
        {interpolate(loggedHome.greeting, { name: home.member.name })}
      </Typography>
      <LoggedHomeScreenDateLine
        className={loggedHomeScreenClasses.dateLine}
        variant="body2"
      >
        {formatDay(locale, context.today, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
        <span aria-hidden>·</span>
        <LoggedHomeScreenStatus className={loggedHomeScreenClasses.status}>
          <LoggedHomeScreenStatusDot
            className={loggedHomeScreenClasses.statusDot}
            ownerState={{ status: home.sync.status }}
          />
          {loggedHome.sync[home.sync.status]}
        </LoggedHomeScreenStatus>
      </LoggedHomeScreenDateLine>
    </div>
  );

  if (home.firstSteps) {
    return (
      <LoggedHomeScreenRoot className={loggedHomeScreenClasses.root}>
        <FirstSteps
          heading={heading}
          balance={<BalanceSummary hours={home.balanceHours} variant="intro" />}
          done={home.firstSteps.done}
        />
      </LoggedHomeScreenRoot>
    );
  }

  const notice = !home.member.emailVerified ? (
    <HomeNotice
      icon={MailWarning}
      title={notices.unverified.title}
      actions={
        <>
          {/* TODO(auth): resend and change email once the account endpoints exist. */}
          <Button variant="outlined" size="small">
            {notices.unverified.resend}
          </Button>
          <Link href="#">{notices.unverified.changeEmail}</Link>
        </>
      }
    >
      {interpolate(notices.unverified.body, {
        email: home.member.maskedEmail,
      })}
    </HomeNotice>
  ) : offline ? (
    <HomeNotice
      icon={WifiOff}
      title={notices.offline.title}
      actions={
        // TODO(api): retry the sync once the member-home endpoint exists.
        <Button variant="outlined" size="small">
          {notices.offline.retry}
        </Button>
      }
    >
      {interpolate(notices.offline.body, {
        when: formatElapsed(locale, home.sync.lastSyncedAt, now),
      })}
    </HomeNotice>
  ) : home.liveUpdate ? (
    <HomeNotice
      icon={Radio}
      // TODO(routes): point at the conversation once chat has a route.
      actions={<Link href="#">{notices.live.action}</Link>}
    >
      {interpolate(notices.live.update, {
        name: home.liveUpdate.counterpart,
        listing: home.liveUpdate.listing,
      })}
    </HomeNotice>
  ) : undefined;

  const entries = home.pending.map((item) => {
    const { dueSoonLabel, ...row } = buildPendingRow(
      item,
      context,
      blockedReason,
    );

    return {
      id: item.id,
      kind: item.kind,
      day: item.due,
      since: item.since,
      dueSoonLabel,
      node: <PendingRow {...row} />,
    };
  });

  const ownListings = buildOwnListings(home.ownListings, context);

  return (
    <LoggedHomeBoard
      locale={locale}
      today={context.today}
      entries={entries}
      marks={buildMarks(home, context)}
      copy={{
        week: loggedHome.week,
        pending: {
          title: loggedHome.pending.title,
          sort: loggedHome.pending.sort,
          dueSoon: loggedHome.pending.dueSoon,
          emptyDay: loggedHome.pending.emptyDay,
        },
      }}
      heading={heading}
      balance={<BalanceSummary hours={home.balanceHours} variant="wide" />}
      compactBalance={
        <BalanceSummary hours={home.balanceHours} variant="compact" />
      }
      notice={notice}
      upToDate={
        home.pending.length === 0 ? (
          <LoggedHomeScreenUpToDate
            className={loggedHomeScreenClasses.upToDate}
          >
            <IconBox icon={CircleCheck} tone="quiet" />
            <div>
              <Typography variant="h5" component="p">
                {loggedHome.pending.upToDate.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {loggedHome.pending.upToDate.body}
              </Typography>
            </div>
          </LoggedHomeScreenUpToDate>
        ) : undefined
      }
      aside={
        <>
          {home.waiting.length > 0 ? (
            <CollapsibleSection
              title={loggedHome.waiting.title}
              count={home.waiting.length}
            >
              {home.waiting.map((item) => (
                <WaitingRow
                  key={item.id}
                  {...buildWaitingRow(item, context)}
                  disabled={Boolean(blockedReason)}
                />
              ))}
            </CollapsibleSection>
          ) : null}
          <AppointmentList
            title={loggedHome.appointments.title}
            entries={home.appointments.map((appointment) =>
              buildAppointment(appointment, context),
            )}
          />
        </>
      }
      listings={
        home.ownListings.active > 0 ? (
          // TODO(routes): point at "Mis anuncios" once it has a route.
          <OwnListingsBar
            href="#"
            title={loggedHome.ownListings.title}
            wide={ownListings.wide}
            narrow={ownListings.narrow}
            manageLabel={loggedHome.ownListings.manage}
          />
        ) : undefined
      }
    />
  );
}
