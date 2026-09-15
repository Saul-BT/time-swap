"use client";

import Typography from "@mui/material/Typography";
import { ChevronLeft, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import type { AccountNavId } from "@/data/types";
import { interpolate } from "@/lib/i18n/interpolate";
import GuardedLink from "../../settings/GuardedLink";
import { useSettingsPlace } from "../../settings/SettingsPlace";
import Eyebrow from "../../ui/Eyebrow";
import Icon from "../../ui/Icon";
import TabularFigure from "../../ui/TabularFigure";
import {
  SettingsShellDetailBack,
  SettingsShellDetailBar,
  SettingsShellFrame,
  SettingsShellHead,
  SettingsShellHeadText,
  SettingsShellMain,
  SettingsShellMeter,
  SettingsShellPanel,
  SettingsShellViewPublic,
} from "./SettingsShell.style";
import {
  SETTINGS_SECTION_COUNT,
  sectionNumber,
  settingsShellClasses,
} from "./SettingsShell.util";

export type SettingsShellBodyProps = {
  copy: {
    breadcrumb: string;
    accounts: Record<AccountNavId, string>;
    title: string;
    leadIndex: string;
    leadDetail: string;
    viewPublic: string;
    back: string;
    stepOf: string;
  };
  backHref: string;
  publicHref: string;
  meter: ReactNode;
  rail: ReactNode;
  index: ReactNode;
  children: ReactNode;
};

/** Picks the arrangement: the index of sections, or one section open. */
export default function SettingsShellBody({
  copy,
  backHref,
  publicHref,
  meter,
  rail,
  index,
  children,
}: SettingsShellBodyProps) {
  const { active, account } = useSettingsPlace();
  const detail = active !== null;

  const viewPublic = (placement: "head" | "foot") => (
    <SettingsShellViewPublic
      className={settingsShellClasses.viewPublic}
      ownerState={{ placement }}
      variant="outlined"
      href={publicHref}
    >
      <Icon icon={ExternalLink} size="sm" />
      {copy.viewPublic}
    </SettingsShellViewPublic>
  );

  return (
    <SettingsShellMain
      className={settingsShellClasses.main}
      component="main"
      ownerState={{ detail }}
    >
      {active ? (
        <SettingsShellDetailBar className={settingsShellClasses.detailBar}>
          <GuardedLink
            link={SettingsShellDetailBack}
            className={settingsShellClasses.detailBack}
            href={backHref}
          >
            <Icon icon={ChevronLeft} />
            {copy.back}
          </GuardedLink>
          <TabularFigure
            className={settingsShellClasses.detailStep}
            variant="subtitle2"
            component="span"
          >
            {interpolate(copy.stepOf, {
              n: sectionNumber(active),
              total: SETTINGS_SECTION_COUNT,
            })}
          </TabularFigure>
        </SettingsShellDetailBar>
      ) : null}

      <SettingsShellHead
        className={settingsShellClasses.head}
        ownerState={{ detail }}
      >
        <SettingsShellHeadText className={settingsShellClasses.headText}>
          <Eyebrow className={settingsShellClasses.breadcrumb}>
            {copy.breadcrumb} · {copy.accounts[account]}
          </Eyebrow>
          <Typography
            className={settingsShellClasses.title}
            variant="h2"
            component="h1"
          >
            {copy.title}
          </Typography>
          <Typography className={settingsShellClasses.lead} variant="body1">
            {detail ? copy.leadDetail : copy.leadIndex}
          </Typography>
        </SettingsShellHeadText>
        {viewPublic("head")}
      </SettingsShellHead>

      <SettingsShellMeter
        className={settingsShellClasses.meter}
        ownerState={{ detail }}
      >
        {meter}
      </SettingsShellMeter>

      <SettingsShellFrame
        className={settingsShellClasses.frame}
        ownerState={{ detail }}
      >
        <div className={settingsShellClasses.rail}>{rail}</div>
        <div className={settingsShellClasses.index}>{index}</div>
        <SettingsShellPanel
          className={settingsShellClasses.panel}
          ownerState={{ detail }}
        >
          {children}
        </SettingsShellPanel>
      </SettingsShellFrame>

      {detail ? null : viewPublic("foot")}
    </SettingsShellMain>
  );
}
