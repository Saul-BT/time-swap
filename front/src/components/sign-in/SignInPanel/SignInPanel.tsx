import { LEDGER_FACT_IDS } from "@/data/ledger-facts";
import { getDictionary } from "@/i18n/dictionary";
import TabularFigure from "../../ui/TabularFigure";
import {
  SignInPanelBody,
  SignInPanelDescription,
  SignInPanelEyebrow,
  SignInPanelFacts,
  SignInPanelRoot,
  SignInPanelTitle,
} from "./SignInPanel.style";
import { signInPanelClasses } from "./SignInPanel.util";

/** Editorial half of the sign-in split: a reason to come back and the three account rules. */
export default async function SignInPanel() {
  const { signIn, howItWorks } = await getDictionary();

  return (
    <SignInPanelRoot className={signInPanelClasses.root}>
      <div>
        <SignInPanelEyebrow className={signInPanelClasses.eyebrow}>
          {signIn.panel.eyebrow}
        </SignInPanelEyebrow>
        <SignInPanelTitle
          className={signInPanelClasses.title}
          variant="h2"
          component="p"
        >
          {signIn.panel.title}
        </SignInPanelTitle>
        <SignInPanelBody
          className={signInPanelClasses.body}
          variant="subtitle1"
        >
          {signIn.panel.body}
        </SignInPanelBody>
      </div>

      <SignInPanelFacts
        className={signInPanelClasses.facts}
        aria-label={signIn.panel.factsLabel}
      >
        {LEDGER_FACT_IDS.map((id) => (
          <div key={id}>
            <TabularFigure component="dt" variant="h3" gutterBottom>
              {howItWorks.facts[id].figure}
            </TabularFigure>
            <SignInPanelDescription className={signInPanelClasses.description}>
              {signIn.panel.facts[id]}
            </SignInPanelDescription>
          </div>
        ))}
      </SignInPanelFacts>
    </SignInPanelRoot>
  );
}
