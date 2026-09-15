import type { LucideIcon } from "lucide-react";
import { iconSize } from "@/theme/tokens";
import { IconRoot } from "./Icon.style";
import { ICON_STROKE_WIDTH, type IconSize, iconClasses } from "./Icon.util";

export type IconProps = {
  icon: LucideIcon;
  size?: IconSize;
  /** Accessible name. Without it the icon is decoration and hidden from readers. */
  label?: string;
};

/** The only way a lucide glyph enters the UI: fixed sizes, stroke 2, never an emoji. */
export default function Icon({ icon: Glyph, size = "md", label }: IconProps) {
  return (
    <IconRoot
      className={iconClasses.root}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <Glyph
        size={iconSize[size]}
        strokeWidth={ICON_STROKE_WIDTH}
        absoluteStrokeWidth
        aria-hidden
      />
    </IconRoot>
  );
}
