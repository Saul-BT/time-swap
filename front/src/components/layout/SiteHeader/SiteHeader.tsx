import { HEADER_LINKS, SECTION_ID } from "@/data/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import Ribbon from "../../ui/Ribbon";
import NavCell from "../NavCell";
import {
  SiteHeaderBar,
  SiteHeaderBrand,
  SiteHeaderBrandName,
  SiteHeaderNav,
} from "./SiteHeader.style";
import { siteHeaderClasses } from "./SiteHeader.util";

export default async function SiteHeader() {
  const { brand, nav } = await getDictionary();
  const locale = await getLocale();

  return (
    <header className={siteHeaderClasses.root}>
      <Ribbon variant="page" />
      <SiteHeaderBar className={siteHeaderClasses.bar}>
        <SiteHeaderBrand className={siteHeaderClasses.brand}>
          <SiteHeaderBrandName
            className={siteHeaderClasses.brandName}
            variant="h3"
            component="p"
          >
            {brand.name}
          </SiteHeaderBrandName>
        </SiteHeaderBrand>

        <SiteHeaderNav className={siteHeaderClasses.nav} aria-label={nav.label}>
          {HEADER_LINKS.map((link) => {
            // FIXME: use `localizePath` util (from #20).
            const href = link.href.startsWith("/")
              ? `/${locale}${link.href}`
              : link.href;

            return (
              <NavCell key={link.id} href={href}>
                {nav[link.id]}
              </NavCell>
            );
          })}
          <NavCell href={`#${SECTION_ID.signUp}`} emphasis="solid">
            {nav.signUp}
          </NavCell>
        </SiteHeaderNav>
      </SiteHeaderBar>
    </header>
  );
}
