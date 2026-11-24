import { Button, Typography } from "@mui/material";
import Eyebrow from "@/components/ui/Eyebrow";
import { LEDGER_FACT_IDS } from "@/data/ledger-facts";
import type { FirstStepId } from "@/data/types";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { localizePath } from "@/i18n/routes";
import { interpolate } from "@/lib/i18n/interpolate";
import BoardSectionHead from "../BoardSectionHead";
import {
  FirstStepsAside,
  FirstStepsDescription,
  FirstStepsFact,
  FirstStepsFacts,
  FirstStepsFigure,
  FirstStepsLead,
  FirstStepsMain,
  FirstStepsNumber,
  FirstStepsRoot,
  FirstStepsStep,
  FirstStepsSteps,
  FirstStepsStepText,
} from "./FirstSteps.style";
import {
  FIRST_STEP_IDS,
  FIRST_STEP_TARGET,
  firstStepsClasses,
} from "./FirstSteps.util";

export type FirstStepsProps = {
  heading: React.ReactNode;
  balance: React.ReactNode;
  done: readonly FirstStepId[];
};

const TITLE_ID = "first-steps-title";

/** Replaces the board until the member has somewhere to be found and something to offer. */
export default async function FirstSteps({
  heading,
  balance,
  done,
}: FirstStepsProps) {
  const { loggedHome, howItWorks } = await getDictionary();
  const locale = await getLocale();
  const { firstTime } = loggedHome;
  const nextStep = FIRST_STEP_IDS.find((id) => !done.includes(id));

  return (
    <FirstStepsRoot className={firstStepsClasses.root}>
      <FirstStepsMain className={firstStepsClasses.main}>
        <div>
          {heading}
          <FirstStepsLead className={firstStepsClasses.lead} variant="body1">
            {firstTime.lead}
          </FirstStepsLead>
        </div>

        <section aria-labelledby={TITLE_ID}>
          <BoardSectionHead
            id={TITLE_ID}
            title={firstTime.title}
            end={
              <Eyebrow component="span">
                {interpolate(firstTime.progress, {
                  done: done.length,
                  total: FIRST_STEP_IDS.length,
                })}
              </Eyebrow>
            }
          />
          <FirstStepsSteps className={firstStepsClasses.steps}>
            {FIRST_STEP_IDS.map((id, index) => (
              <FirstStepsStep key={id} className={firstStepsClasses.step}>
                <FirstStepsNumber
                  className={firstStepsClasses.number}
                  aria-hidden
                >
                  {index + 1}
                </FirstStepsNumber>
                <FirstStepsStepText className={firstStepsClasses.stepText}>
                  <Typography variant="h5" component="h3">
                    {firstTime.steps[id].title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {firstTime.steps[id].body}
                  </Typography>
                  <Button
                    href={localizePath(locale, FIRST_STEP_TARGET[id])}
                    variant={id === nextStep ? "contained" : "outlined"}
                    size="small"
                  >
                    {firstTime.steps[id].action}
                  </Button>
                </FirstStepsStepText>
              </FirstStepsStep>
            ))}
          </FirstStepsSteps>
        </section>
      </FirstStepsMain>

      <FirstStepsAside className={firstStepsClasses.aside}>
        {balance}
        <div>
          <Eyebrow>{firstTime.factsTitle}</Eyebrow>
          <FirstStepsFacts className={firstStepsClasses.facts}>
            {LEDGER_FACT_IDS.map((id) => (
              <FirstStepsFact key={id} className={firstStepsClasses.fact}>
                <FirstStepsFigure
                  className={firstStepsClasses.figure}
                  component="dt"
                >
                  {howItWorks.facts[id].figure}
                </FirstStepsFigure>
                <FirstStepsDescription
                  className={firstStepsClasses.description}
                >
                  {firstTime.facts[id]}
                </FirstStepsDescription>
              </FirstStepsFact>
            ))}
          </FirstStepsFacts>
        </div>
      </FirstStepsAside>
    </FirstStepsRoot>
  );
}
