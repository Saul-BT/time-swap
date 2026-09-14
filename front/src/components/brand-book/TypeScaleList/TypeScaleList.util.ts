import { createComponentClasses } from "@/lib/mui/componentClasses";
import { FAMILY_NAME, type TypeScaleVariant, typeScale } from "@/theme/tokens";

export const typeScaleListClasses = createComponentClasses("TypeScaleList", [
  "root",
  "item",
]);

export const TYPE_SCALE_VARIANTS = Object.keys(typeScale) as TypeScaleVariant[];

/**
 * @example
 * describeVariant("h1"); // "Oswald 700 · clamp(3rem, 7.5vw, 6rem) / 1.06 · uppercase"
 */
export function describeVariant(variant: TypeScaleVariant): string {
  const step = typeScale[variant];

  return [
    `${FAMILY_NAME[step.family]} ${step.weight}`,
    `${step.size} / ${step.lineHeight}`,
    step.uppercase ? "uppercase" : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
