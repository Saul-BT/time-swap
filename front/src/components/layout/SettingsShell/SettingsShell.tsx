import { Suspense } from "react";
import { ACCOUNT_NAV } from "@/data/settings";
import type { AccountNavId } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import { getSessionMemberId } from "@/lib/api/profile";
import CompletionSummary, {
  CompletionSummarySkeleton,
  CompletionSummaryUnavailable,
} from "../../settings/CompletionSummary";
import { SettingsPlaceProvider } from "../../settings/SettingsPlace";
import { UnsavedChangesProvider } from "../../settings/UnsavedChanges";
import SlotBoundary from "../../ui/SlotBoundary";
import AccountNav from "../AccountNav";
import SettingsNav, {
  SettingsNavSkeleton,
  SettingsNavView,
} from "../SettingsNav";
import SiteHeader from "../SiteHeader";
import { SettingsShellRoot } from "./SettingsShell.style";
import { settingsShellClasses } from "./SettingsShell.util";
import SettingsShellBody from "./SettingsShellBody";

export type SettingsShellProps = {
  children: React.ReactNode;
};

/**
 * Page chrome shared by the six settings routes: masthead, account row,
 * heading, completion meter and the framed rail + panel. Lives in
 * `settings/layout.tsx`, so a section page only renders its own panel.
 *
 * Everything that needs the profile hangs off a `Suspense` boundary. A layout
 * renders above its own `loading.tsx`, so anything awaited here directly would
 * block every navigation into settings instead of streaming.
 */
export default async function SettingsShell({ children }: SettingsShellProps) {
  const { settings } = await getDictionary();
  const locale = await getLocale();
  const memberId = await getSessionMemberId();

  return (
    <SettingsShellRoot className={settingsShellClasses.root}>
      <SettingsPlaceProvider>
        <SiteHeader />
        <AccountNav />
        <UnsavedChangesProvider
          copy={{
            title: settings.panel.unsavedTitle,
            body: settings.panel.unsavedBody,
            stay: settings.panel.unsavedStay,
            leave: settings.panel.unsavedLeave,
          }}
        >
          <SettingsShellBody
            copy={{
              breadcrumb: settings.shell.breadcrumb,
              accounts: Object.fromEntries(
                ACCOUNT_NAV.map(({ id }) => [id, settings.account[id]]),
              ) as Record<AccountNavId, string>,
              title: settings.shell.title,
              leadIndex: settings.shell.leadIndex,
              leadDetail: settings.shell.leadDetail,
              viewPublic: settings.shell.viewPublic,
              back: settings.shell.back,
              stepOf: settings.shell.stepOf,
            }}
            backHref={localizePath(locale, "settingsProfile")}
            publicHref={localizePath(locale, "memberProfile", { id: memberId })}
            meter={
              <SlotBoundary
                fallback={
                  <CompletionSummaryUnavailable
                    message={settings.shell.progressUnavailable}
                  />
                }
              >
                <Suspense fallback={<CompletionSummarySkeleton />}>
                  <CompletionSummary />
                </Suspense>
              </SlotBoundary>
            }
            rail={
              <SlotBoundary
                fallback={<SettingsNavView variant="tabs" completion={null} />}
              >
                <Suspense
                  fallback={
                    <SettingsNavSkeleton
                      variant="tabs"
                      label={settings.shell.navLabel}
                    />
                  }
                >
                  <SettingsNav variant="tabs" />
                </Suspense>
              </SlotBoundary>
            }
            index={
              <SlotBoundary
                fallback={<SettingsNavView variant="index" completion={null} />}
              >
                <Suspense
                  fallback={
                    <SettingsNavSkeleton
                      variant="index"
                      label={settings.shell.navLabel}
                    />
                  }
                >
                  <SettingsNav variant="index" />
                </Suspense>
              </SlotBoundary>
            }
          >
            {children}
          </SettingsShellBody>
        </UnsavedChangesProvider>
      </SettingsPlaceProvider>
    </SettingsShellRoot>
  );
}
