import { type ReactNode, Suspense } from "react";
import { PANEL_SKELETON_ROWS } from "@/data/settings";
import type { PanelContext } from "@/lib/settings/panel";
import PanelHeader from "../PanelHeader";
import PanelSkeleton from "../PanelSkeleton";

export type SectionPanelProps = {
  context: PanelContext;
  lead: string;
  /** The form, which loads the profile itself. */
  children: ReactNode;
};

/** The heading needs only copy, so it renders before the form's data arrives. */
export default function SectionPanel({
  context: { section, chrome, titleId },
  lead,
  children,
}: SectionPanelProps) {
  return (
    <>
      <PanelHeader
        titleId={titleId}
        step={chrome.step}
        title={chrome.title}
        lead={lead}
      />
      <Suspense
        fallback={
          <PanelSkeleton
            rows={PANEL_SKELETON_ROWS[section]}
            label={chrome.title}
            head={false}
          />
        }
      >
        {children}
      </Suspense>
    </>
  );
}
