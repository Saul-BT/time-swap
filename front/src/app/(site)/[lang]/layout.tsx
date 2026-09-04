import type { Metadata } from "next";
import AppProviders from "@/components/layout/AppProviders";
import { LOCALES } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { fontVariables } from "@/theme/fonts";
import "../../globals.css";

/**
 * `[lang]` sits above this root layout, which makes it a root param readable
 * with `next/root-params` from any server component.
 */

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getDictionary();

  return { title: metadata.title, description: metadata.description };
}

export default async function SiteLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
