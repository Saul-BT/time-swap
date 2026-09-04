import { HEADER_LINKS, SECTION_ID } from "@/data/navigation";
import { getDictionary } from "@/i18n/dictionary";
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
            <NavCell key={link.id} href={link.href}>
              {nav[link.id]}
            </NavCell>
          ))}
          <NavCell href={`#${SECTION_ID.signUp}`} emphasis="solid">
            {nav.signUp}
          </NavCell>
        </SiteHeaderNav>
      </SiteHeaderBar>
    </header>
  );
}
