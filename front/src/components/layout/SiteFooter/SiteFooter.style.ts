"use client";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { bareList, rule } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "SiteFooter";

export const SiteFooterRoot = styled("footer", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    borderTop: rule(theme),
  }),
);

export const SiteFooterInner = styled(Container, { name: NAME, slot: "Inner" })(
  ({ theme }) => ({
    paddingBlock: theme.spacing(space.md),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(space.sm + 1),
  }),
);

export const SiteFooterLinks = styled(Stack, {
  name: NAME,
  slot: "Links",
})<WithComponent>({
  ...bareList,
  flexWrap: "wrap",
});

export const SiteFooterLanguages = styled(Stack, {
  name: NAME,
  slot: "Languages",
})<WithComponent>({
  ...bareList,
  flexWrap: "wrap",
});
