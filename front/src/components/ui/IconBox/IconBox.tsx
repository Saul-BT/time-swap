import type { LucideIcon } from "lucide-react";
import Icon from "../Icon";
import { IconBoxRoot } from "./IconBox.style";
import {
  type IconBoxSize,
  type IconBoxTone,
  iconBoxClasses,
} from "./IconBox.util";

export type IconBoxProps = {
  icon: LucideIcon;
  tone?: IconBoxTone;
  size?: IconBoxSize;
};

/** A glyph in a ruled square that leads a list row. Decorative: the row says what it is. */
export default function IconBox({
  icon,
  tone = "plain",
  size = "md",
}: IconBoxProps) {
  return (
    <IconBoxRoot
      className={iconBoxClasses.root}
      ownerState={{ tone, size }}
      aria-hidden
    >
      <Icon icon={icon} size={size === "md" ? "md" : "sm"} />
    </IconBoxRoot>
  );
}
