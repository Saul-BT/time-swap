"use client";

import { useEffect, useState } from "react";
import { useUnsavedChanges } from "../UnsavedChanges";
import {
  PanelFooterFeedback,
  PanelFooterNext,
  PanelFooterRoot,
  PanelFooterSave,
} from "./PanelFooter.style";
import {
  type PanelFooterCopy,
  panelFooterClasses,
  SAVED_FEEDBACK_MS,
} from "./PanelFooter.util";

export type PanelFooterProps = {
  copy: PanelFooterCopy;
  /** Where «Siguiente» goes; the last section links to the public profile instead. */
  nextHref?: string;
  pending: boolean;
  /** Timestamp of the last successful save; drives the transient confirmation. */
  savedAt?: number;
};

export default function PanelFooter({
  copy,
  nextHref,
  pending,
  savedAt,
}: PanelFooterProps) {
  const { guard } = useUnsavedChanges();
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!savedAt) {
      return;
    }

    setShowSaved(true);
    const timer = window.setTimeout(
      () => setShowSaved(false),
      SAVED_FEEDBACK_MS,
    );

    return () => window.clearTimeout(timer);
  }, [savedAt]);

  return (
    <PanelFooterRoot className={panelFooterClasses.root}>
      <PanelFooterSave
        className={panelFooterClasses.save}
        type="submit"
        variant="contained"
        disabled={pending}
      >
        {pending ? copy.saving : copy.save}
      </PanelFooterSave>
      {nextHref && copy.next ? (
        <PanelFooterNext
          className={panelFooterClasses.next}
          variant="outlined"
          href={nextHref}
          disabled={pending}
          onClick={(event) => guard(nextHref, event)}
        >
          {copy.next}
        </PanelFooterNext>
      ) : null}
      <PanelFooterFeedback
        className={panelFooterClasses.feedback}
        role="status"
        aria-live="polite"
      >
        {showSaved ? copy.saved : null}
      </PanelFooterFeedback>
    </PanelFooterRoot>
  );
}
