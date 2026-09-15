import Link from "next/link";

/**
 * Root-level on purpose. The root layout of this app lives under `[lang]`, and
 * a `not-found.tsx` nested there is never reached: an unmatched URL has no
 * `lang` to match, so Next renders this one outside every layout. That is also
 * why the styles are inline and the copy is not localized — there is no
 * dictionary to read without a locale.
 *
 * TODO(i18n): to localize it, `proxy.ts` would have to forward the negotiated
 * locale as a request header for this file to read with `headers()`.
 */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 8,
        padding: 32,
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#F3F2F5",
        color: "#151318",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 24 }}>Esta página no existe</h1>
      <p style={{ margin: "0 0 24px", maxWidth: 480 }}>
        Puede que el enlace esté roto o que el contenido ya no esté disponible.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: 52,
          paddingInline: 24,
          border: "2px solid #151318",
          color: "inherit",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Volver al inicio
      </Link>
    </main>
  );
}
