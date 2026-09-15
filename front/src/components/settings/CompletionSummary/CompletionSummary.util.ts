import { SETTINGS_SECTIONS } from "@/data/settings";
import type { CompletionStatus } from "@/data/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { interpolate } from "@/lib/i18n/interpolate";
import { createComponentClasses } from "@/lib/mui/componentClasses";

export const completionSummaryClasses = createComponentClasses(
  "CompletionSummary",
  ["root"],
);

export function countDone(completion: CompletionStatus): number {
  return SETTINGS_SECTIONS.filter(
    (section) => completion.sections[section] === "done",
  ).length;
}

/**
 * "3 de 5 listos. Presentación por revisar; falta zona." One sentence rather
 * than a list, because it is also the accessible name of the ribbon.
 */
export function completionSentence(
  settings: Dictionary["settings"],
  locale: Locale,
  completion: CompletionStatus,
): string {
  const done = countDone(completion);
  const pending = SETTINGS_SECTIONS.flatMap((section) => {
    const status = completion.sections[section];
    const name = settings.sections[section].toLocaleLowerCase(locale);

    if (status === "review") {
      return [interpolate(settings.completion.review, { section: name })];
    }
    if (status === "missing") {
      return [interpolate(settings.completion.missing, { section: name })];
    }
    return [];
  });

  const tail =
    pending.length > 0
      ? `${capitalize(pending.join("; "))}.`
      : settings.completion.canPublish;

  return [
    interpolate(settings.completion.sentence, {
      done,
      total: SETTINGS_SECTIONS.length,
    }),
    tail,
  ].join(" ");
}

function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}
