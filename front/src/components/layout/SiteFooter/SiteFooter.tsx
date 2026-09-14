import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { FOOTER_LINKS } from "@/data/navigation";
import { LOCALE_NAME, LOCALES } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import {
  SiteFooterInner,
  SiteFooterLanguages,
  SiteFooterLinks,
  SiteFooterRoot,
} from "./SiteFooter.style";
import { siteFooterClasses } from "./SiteFooter.util";

export default async function SiteFooter() {
  const { footer } = await getDictionary();
  const current = await getLocale();

  return (
    <SiteFooterRoot className={siteFooterClasses.root}>
      <SiteFooterInner className={siteFooterClasses.inner}>
        <Typography variant="caption" color="textSecondary">
          {footer.tagline}
        </Typography>

        <SiteFooterLinks
          className={siteFooterClasses.links}
          component="ul"
          aria-label={footer.legalLabel}
          direction="row"
          spacing={3}
        >
          {FOOTER_LINKS.map((link) => (
            <li key={link.id}>
              <Link href={link.href} variant="caption">
                {footer.links[link.id]}
              </Link>
            </li>
          ))}
        </SiteFooterLinks>

        {/*
          Plain links, so switching language needs no client JavaScript. The
          landing is a single route, so the target is just the locale root.
        */}
        <SiteFooterLanguages
          className={siteFooterClasses.languages}
          component="ul"
          aria-label={footer.languageLabel}
          direction="row"
          spacing={2}
        >
          {LOCALES.map((locale) => (
            <li key={locale}>
              {locale === current ? (
                <Typography
                  variant="caption"
                  component="span"
                  aria-current="true"
                >
                  {LOCALE_NAME[locale]}
                </Typography>
              ) : (
                <Link href={`/${locale}`} variant="caption" hrefLang={locale}>
                  {LOCALE_NAME[locale]}
                </Link>
              )}
            </li>
          ))}
        </SiteFooterLanguages>
      </SiteFooterInner>
    </SiteFooterRoot>
  );
}
