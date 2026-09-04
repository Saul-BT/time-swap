import type { TypographyProps } from "@mui/material/Typography";
import { joinClasses } from "@/lib/mui/componentClasses";
import { TabularFigureRoot } from "./TabularFigure.style";
import { tabularFigureClasses } from "./TabularFigure.util";

/** A number meant to be compared down a column: balances, hours, movements. */
export default function TabularFigure({
  className,
  ...props
}: TypographyProps) {
  return (
    <TabularFigureRoot
      className={joinClasses(tabularFigureClasses.root, className)}
      {...props}
    />
  );
}
