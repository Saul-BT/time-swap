import type { LucideIcon } from "lucide-react";
import Icon from "../Icon";
import { TagRoot } from "./Tag.style";
import { type TagTone, tagClasses } from "./Tag.util";

export type TagProps = {
  children: React.ReactNode;
  tone?: TagTone;
  icon?: LucideIcon;
};

/** A short uppercase label on a 2 px frame: a day, a state. Never a control. */
export default function Tag({ children, tone = "solid", icon }: TagProps) {
  return (
    <TagRoot className={tagClasses.root} ownerState={{ tone }}>
      {icon ? <Icon icon={icon} size="sm" /> : null}
      {children}
    </TagRoot>
  );
}
