import { getDictionary } from "@/i18n/dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import FilterList from "../FilterList";
import SearchForm from "../SearchForm";
import {
  HeroSectionEyebrow,
  HeroSectionLead,
  HeroSectionRoot,
  HeroSectionTitle,
} from "./HeroSection.style";
import { heroSectionClasses } from "./HeroSection.util";

export default async function HeroSection() {
  const { hero, placeholder } = await getDictionary();

  return (
    <HeroSectionRoot className={heroSectionClasses.root} component="section">
      <HeroSectionEyebrow className={heroSectionClasses.eyebrow}>
        {interpolate(hero.eyebrow, { city: placeholder.city })}
      </HeroSectionEyebrow>

      <HeroSectionTitle className={heroSectionClasses.title} variant="h1">
        {hero.title}
      </HeroSectionTitle>

      <HeroSectionLead className={heroSectionClasses.lead} variant="subtitle1">
        {interpolate(hero.lead, { city: placeholder.city })}
      </HeroSectionLead>

      <SearchForm />
      <FilterList />
    </HeroSectionRoot>
  );
}
