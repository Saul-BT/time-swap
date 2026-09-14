"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import type { WithComponent } from "@/lib/mui/polymorphic";
import { bareList } from "@/theme/rules";

const NAME = "SkillChipList";

export const SkillChipListRoot = styled(Stack, {
  name: NAME,
  slot: "Root",
})<WithComponent>({
  ...bareList,
  flexWrap: "wrap",
});

export const SkillChip = styled(Chip, {
  name: NAME,
  slot: "Chip",
})<{ ownerState: { compact: boolean } }>(({ ownerState }) =>
  // Inside a card the 52 px control height is too tall for a passive label.
  ownerState.compact ? { minHeight: 32 } : {},
);
