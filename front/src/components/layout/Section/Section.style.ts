"use client";

import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import { rule, sectionSpacingY } from "@/theme/rules";

const NAME = "Section";

/** `inverted` flips to ink; `framed` is a surface band closed by the rule. */
export type SectionTone = "plain" | "inverted" | "framed";

export const SectionRoot = styled("section", {
  name: NAME,
  slot: "Root",
})<{ ownerState: { tone: SectionTone } }>(({ theme, ownerState }) => {
  if (ownerState.tone === "inverted") {
    return {
      backgroundColor: theme.palette.text.primary,
      color: theme.palette.background.default,
    };
  }

  if (ownerState.tone === "framed") {
    return {
      backgroundColor: theme.palette.background.paper,
      borderTop: rule(theme),
      borderBottom: rule(theme),
    };
  }

  return {};
});

export const SectionInner = styled(Container, {
  name: NAME,
  slot: "Inner",
})<{ ownerState: { top: boolean; bottom: boolean } }>(({ theme, ownerState }) =>
  sectionSpacingY(theme, ownerState),
);
