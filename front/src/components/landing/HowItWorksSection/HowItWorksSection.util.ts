import { createComponentClasses } from "@/lib/mui/componentClasses";
import { space } from "@/theme/tokens";

export const howItWorksSectionClasses = createComponentClasses(
  "HowItWorksSection",
  ["eyebrow", "facts", "description"],
);

/** Plain object, not a callback: an `sx` function cannot cross into a client component. */
export const HOW_IT_WORKS_LAYOUT = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "340px 1fr" },
  gap: { xs: space.md, md: space.md * 2 },
  alignItems: "start",
} as const;
