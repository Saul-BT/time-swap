"use client";

import Button from "@mui/material/Button";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useErrorCopy } from "@/components/layout/ErrorCopy";
import Section from "@/components/layout/Section";
import FormNotice from "@/components/ui/FormNotice";
import { isLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routes";
import { reportError } from "@/lib/observability/reportError";

export type SiteErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * Catches what the panel boundary cannot: a failure in a layout, which renders
 * above its own segment's `error.tsx`.
 */
export default function SiteError({ error, retry }: SiteErrorProps) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  const { page } = useErrorCopy();
  const { lang } = useParams<{ lang: string }>();
  const home = localizePath(isLocale(lang) ? lang : "es", "home");

  return (
    <Section>
      <FormNotice
        tone="error"
        title={page.title}
        action={
          <>
            <Button variant="contained" type="button" onClick={() => retry()}>
              {page.retry}
            </Button>
            <Button variant="outlined" href={home}>
              {page.home}
            </Button>
          </>
        }
      >
        {page.body}
      </FormNotice>
    </Section>
  );
}
