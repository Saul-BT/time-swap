import type { Metadata } from "next";
import AppProviders from "@/components/layout/AppProviders";
import { fontVariables } from "@/theme/fonts";
import "../../globals.css";

/** Outside `[lang]` on purpose: an internal reference, English only, copy hardcoded. */
export const metadata: Metadata = {
  title: "Time Swap · design system",
  robots: { index: false, follow: false },
};

export default function BrandBookLayout({
  children,
}: LayoutProps<"/brand-book">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
