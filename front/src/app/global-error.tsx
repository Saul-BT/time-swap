"use client";

import { useEffect } from "react";
import { FALLBACK_ERROR_COPY } from "@/components/layout/ErrorCopy";
import { reportError } from "@/lib/observability/reportError";

export type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * Replaces the root layout, so it cannot use the theme, the fonts or the
 * dictionary: whatever failed may be one of them. Spanish and inline styles on
 * purpose; this is the last thing standing.
 */
export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  const { page } = FALLBACK_ERROR_COPY;

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#F3F2F5",
          color: "#151318",
        }}
      >
        <main style={{ maxWidth: 480 }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 24 }}>{page.title}</h1>
          <p style={{ margin: "0 0 24px" }}>{page.body}</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              minHeight: 52,
              paddingInline: 24,
              border: "2px solid #151318",
              background: "transparent",
              font: "inherit",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {page.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
