"use client";

import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useErrorCopy } from "@/components/layout/ErrorCopy";
import FormNotice from "@/components/ui/FormNotice";
import { reportError } from "@/lib/observability/reportError";

export type SettingsPanelErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * Sits below the settings layout, so a section that fails to load is replaced
 * on its own: the masthead, the meter and the navigation stay usable and the
 * reader can walk into another section instead of reloading the page.
 */
export default function SettingsPanelError({
  error,
  retry,
}: SettingsPanelErrorProps) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  const { panel } = useErrorCopy();

  return (
    <FormNotice
      tone="error"
      title={panel.title}
      action={
        <Button variant="outlined" type="button" onClick={() => retry()}>
          {panel.retry}
        </Button>
      }
    >
      {panel.body}
    </FormNotice>
  );
}
