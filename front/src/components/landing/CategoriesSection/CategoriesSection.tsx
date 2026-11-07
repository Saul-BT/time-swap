import { getDictionary } from "@/i18n/dictionary";
import Section from "../../layout/Section";
import SectionHeader from "../../ui/SectionHeader";
import SkillChipList from "../../ui/SkillChipList";
import { getCategories } from "@/data/categories";

export default async function CategoriesSection() {
  const categoryList = await getCategories();
  const { categories } = await getDictionary();

  return (
    <Section>
      <SectionHeader title={categories.title} intro={categories.intro} />
      <SkillChipList
        label={categories.listLabel}
        items={categoryList.map(category => {return category.name})}
      />
    </Section>
  );
}
