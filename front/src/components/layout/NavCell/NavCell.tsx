import { type NavCellEmphasis, NavCellRoot } from "./NavCell.style";
import { navCellClasses } from "./NavCell.util";

export type NavCellProps = {
  href: string;
  children: React.ReactNode;
  /** `solid` fills the cell with the accent. At most one per navigation. */
  emphasis?: NavCellEmphasis;
};

export default function NavCell({
  href,
  children,
  emphasis = "quiet",
}: NavCellProps) {
  return (
    <NavCellRoot
      className={navCellClasses.root}
      href={href}
      ownerState={{ emphasis }}
    >
      {children}
    </NavCellRoot>
  );
}
