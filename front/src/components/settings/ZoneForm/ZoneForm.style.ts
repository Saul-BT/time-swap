"use client";

import { styled } from "@mui/material/styles";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { fieldErrorClasses } from "@/components/ui/FieldError";
import { bareFieldset } from "@/theme/rules";
import { space } from "@/theme/tokens";

const NAME = "ZoneForm";

export const ZoneFormGroup = styled("fieldset", { name: NAME, slot: "Group" })(
  ({ theme }) => ({
    ...bareFieldset,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.xs),
  }),
);

/** Wraps a control that is not a `FormField` with the text that follows it. */
export const ZoneFormField = styled("div", { name: NAME, slot: "Field" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(space.xs),
    [`& .${fieldErrorClasses.root}`]: {
      marginTop: 0,
    },
  }),
);

export const ZoneFormPrecision = styled(ToggleButtonGroup, {
  name: NAME,
  slot: "Precision",
})({
  alignSelf: "flex-start",
});

export const ZoneFormLegend = styled("legend", { name: NAME, slot: "Legend" })(
  ({ theme }) => ({
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightBold,
    padding: 0,
    marginBottom: theme.spacing(space.xs),
  }),
);

/** Modality checks sit side by side with no rule between them, as decided. */
export const ZoneFormOptions = styled("div", { name: NAME, slot: "Options" })(
  ({ theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    columnGap: theme.spacing(space.md),
  }),
);

export const ZoneFormHint = styled("p", { name: NAME, slot: "Hint" })(
  ({ theme }) => ({
    ...theme.typography.caption,
    margin: 0,
    color: theme.palette.text.secondary,
  }),
);
