import { getDictionary } from "@/i18n/dictionary";
import Section from "../../layout/Section";
import SectionHeader from "../../ui/SectionHeader";
import SkillChipList from "../../ui/SkillChipList";
import { getCategoryLabels } from "./CategoriesSection.util";

export default async function CategoriesSection() {
  const { categories } = await getDictionary();

  return (
    <Section>
      <SectionHeader title={categories.title} intro={categories.intro} />
      <SkillChipList
        label={categories.listLabel}
        items={getCategoryLabels(categories)}
      />
    </Section>
  );
}
