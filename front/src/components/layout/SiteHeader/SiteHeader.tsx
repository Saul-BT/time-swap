import { HEADER_LINKS } from "@/data/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
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
          {HEADER_LINKS.map((link) => (
            <NavCell key={link.id} href={localizePath(locale, link.target)}>
              {nav[link.id]}
            </NavCell>
          ))}
          <NavCell href={localizePath(locale, "register")} emphasis="solid">
            {nav.signUp}
          </NavCell>
        </SiteHeaderNav>
      </SiteHeaderBar>
    </header>
  );
}
