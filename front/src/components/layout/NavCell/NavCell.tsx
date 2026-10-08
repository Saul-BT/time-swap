import { type NavCellEmphasis, NavCellRoot } from "./NavCell.style";
import { navCellClasses } from "./NavCell.util";

export type NavCellProps = {
  href: string;
  children: React.ReactNode;
  /** `solid` fills the cell with the accent. At most one per navigation. */
  emphasis?: NavCellEmphasis;
  /** The page this cell leads to is the one on screen. */
  current?: boolean;
  /** Accessible name when the content is not text, such as an avatar. */
  label?: string;
};

export default function NavCell({
  href,
  children,
  emphasis = "quiet",
  current = false,
  label,
}: NavCellProps) {
  return (
    <NavCellRoot
      className={navCellClasses.root}
      href={href}
      aria-current={current ? "page" : undefined}
      aria-label={label}
      ownerState={{ emphasis, current }}
    >
      {children}
    </NavCellRoot>
  );
}
