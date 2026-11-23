import { Suspense } from "react";
import { getCategories } from "@/data/categories";
import { getDictionary } from "@/i18n/dictionary";
import Section from "../../layout/Section";
import SectionHeader from "../../ui/SectionHeader";
import SkillChipList from "../../ui/SkillChipList";

async function CategoryChips({ label }: { label: string }) {
  const categories = await getCategories();

  return (
    <SkillChipList
      label={label}
      items={categories.map((category) => category.name)}
    />
  );
}

export default async function CategoriesSection() {
  const { categories } = await getDictionary();

  return (
    <Section>
      <SectionHeader title={categories.title} intro={categories.intro} />
      <Suspense>
        <CategoryChips label={categories.listLabel} />
      </Suspense>
    </Section>
  );
}
