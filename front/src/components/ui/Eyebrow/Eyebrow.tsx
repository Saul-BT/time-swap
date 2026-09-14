import type { TypographyProps } from "@mui/material/Typography";
import { joinClasses } from "@/lib/mui/componentClasses";
import { EyebrowRoot } from "./Eyebrow.style";
import { eyebrowClasses } from "./Eyebrow.util";

/** Renders a `p` by default so it never introduces a heading level; colour stays overridable. */
export default function Eyebrow({ className, ...props }: TypographyProps) {
  return (
    <EyebrowRoot
      variant="overline"
      component="p"
      className={joinClasses(eyebrowClasses.root, className)}
      {...props}
    />
  );
}
