import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LEDGER_FACT_IDS } from "@/data/ledger-facts";
import { SECTION_ID } from "@/data/navigation";
import { getDictionary } from "@/i18n/dictionary";
import Section from "../../layout/Section";
import TabularFigure from "../../ui/TabularFigure";
import {
  HowItWorksDescription,
  HowItWorksEyebrow,
  HowItWorksFacts,
} from "./HowItWorksSection.style";
import {
  HOW_IT_WORKS_LAYOUT,
  howItWorksSectionClasses,
} from "./HowItWorksSection.util";

export default async function HowItWorksSection() {
  const { howItWorks } = await getDictionary();

  return (
    <Section
      id={SECTION_ID.howItWorks}
      tone="inverted"
      sx={HOW_IT_WORKS_LAYOUT}
    >
      <Box>
        <HowItWorksEyebrow className={howItWorksSectionClasses.eyebrow}>
          {howItWorks.eyebrow}
        </HowItWorksEyebrow>
        <Typography variant="h2">{howItWorks.title}</Typography>
      </Box>

      <HowItWorksFacts className={howItWorksSectionClasses.facts}>
        {LEDGER_FACT_IDS.map((id) => (
          <Box key={id}>
            <TabularFigure component="dt" variant="h2" gutterBottom>
              {howItWorks.facts[id].figure}
            </TabularFigure>
            <HowItWorksDescription
              className={howItWorksSectionClasses.description}
            >
              {howItWorks.facts[id].description}
            </HowItWorksDescription>
          </Box>
        ))}
      </HowItWorksFacts>
    </Section>
  );
}
