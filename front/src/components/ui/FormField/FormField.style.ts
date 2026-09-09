"use client";

import FormLabel, { formLabelClasses } from "@mui/material/FormLabel";
import { styled } from "@mui/material/styles";
import { space } from "@/theme/tokens";

const NAME = "FormField";

export const FormFieldRoot = styled("div", { name: NAME, slot: "Root" })(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.spacing(space.sm + 0.5),
  }),
);

export const FormFieldHead = styled("div", { name: NAME, slot: "Head" })(
  ({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: theme.spacing(space.sm),
    marginBottom: theme.spacing(space.xs),
  }),
);

/** The label sits above the control, so it never floats and never shrinks. */
export const FormFieldLabel = styled(FormLabel, { name: NAME, slot: "Label" })(
  ({ theme }) => ({
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    [`&.${formLabelClasses.focused}, &.${formLabelClasses.error}`]: {
      color: theme.palette.text.primary,
    },
  }),
);
