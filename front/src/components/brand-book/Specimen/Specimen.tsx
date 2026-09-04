import Typography from "@mui/material/Typography";
import {
  SpecimenName,
  SpecimenRoot,
  SpecimenStage,
  SpecimenVariant,
  SpecimenVariants,
} from "./Specimen.style";
import { specimenClasses } from "./Specimen.util";

export type SpecimenVariantEntry = {
  /** As written in code: `variant="contained"`. */
  label: string;
  children: React.ReactNode;
};

export type SpecimenProps = {
  /** The component's export name. */
  name: string;
  variants: readonly SpecimenVariantEntry[];
};

export default function Specimen({ name, variants }: SpecimenProps) {
  return (
    <SpecimenRoot className={specimenClasses.root}>
      <SpecimenName
        className={specimenClasses.name}
        variant="h3"
        component="h3"
      >
        {name}
      </SpecimenName>
      <SpecimenVariants className={specimenClasses.variants}>
        {variants.map((variant) => (
          <SpecimenVariant
            className={specimenClasses.variant}
            key={variant.label}
          >
            <Typography
              className={specimenClasses.variantLabel}
              variant="subtitle2"
              component="p"
              color="textSecondary"
            >
              {variant.label}
            </Typography>
            <SpecimenStage className={specimenClasses.stage}>
              {variant.children}
            </SpecimenStage>
          </SpecimenVariant>
        ))}
      </SpecimenVariants>
    </SpecimenRoot>
  );
}
