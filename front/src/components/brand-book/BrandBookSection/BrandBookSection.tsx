import {
  BrandBookSectionBody,
  BrandBookSectionRoot,
  BrandBookSectionTitle,
} from "./BrandBookSection.style";
import { brandBookSectionClasses } from "./BrandBookSection.util";

export type BrandBookSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export default function BrandBookSection({
  id,
  title,
  children,
}: BrandBookSectionProps) {
  return (
    <BrandBookSectionRoot className={brandBookSectionClasses.root} id={id}>
      <BrandBookSectionTitle
        className={brandBookSectionClasses.title}
        variant="h2"
      >
        {title}
      </BrandBookSectionTitle>
      <BrandBookSectionBody className={brandBookSectionClasses.body}>
        {children}
      </BrandBookSectionBody>
    </BrandBookSectionRoot>
  );
}
