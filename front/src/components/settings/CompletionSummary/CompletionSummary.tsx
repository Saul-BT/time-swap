import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { SETTINGS_SECTIONS } from "@/data/settings";
import { getDictionary, getLocale } from "@/i18n/dictionary";
import { getCompletion } from "@/lib/api/profile";
import { structure } from "@/theme/tokens";
import CompletionMeter from "../../ui/CompletionMeter";
import { CompletionSummaryRoot } from "./CompletionSummary.style";
import {
  completionSentence,
  completionSummaryClasses,
  countDone,
} from "./CompletionSummary.util";

/** Loads its own completion so the chrome around it can render without waiting. */
export default async function CompletionSummary() {
  const { settings } = await getDictionary();
  const locale = await getLocale();
  const completion = await getCompletion();

  return (
    <CompletionMeter
      done={countDone(completion)}
      total={SETTINGS_SECTIONS.length}
      sentence={completionSentence(settings, locale, completion)}
    />
  );
}

/** The sentence alone, without the ribbon: there is no progress to draw. */
export function CompletionSummaryUnavailable({ message }: { message: string }) {
  return (
    <CompletionSummaryRoot className={completionSummaryClasses.root}>
      <Typography variant="body2" component="p" color="textSecondary">
        {message}
      </Typography>
    </CompletionSummaryRoot>
  );
}

/** Same two blocks, same heights: the meter must not move when it arrives. */
export function CompletionSummarySkeleton() {
  return (
    <CompletionSummaryRoot
      className={completionSummaryClasses.root}
      role="status"
      aria-busy
    >
      <Skeleton
        variant="rectangular"
        height={structure.cardRibbonHeight}
        sx={{ transform: "none" }}
      />
      <Skeleton variant="text" width="40%" />
    </CompletionSummaryRoot>
  );
}
