import { SkillChip, SkillChipListRoot } from "./SkillChipList.style";
import { skillChipListClasses } from "./SkillChipList.util";

export type SkillChipListProps = {
  items: readonly string[];
  /** Accessible name for the list. */
  label: string;
  /** Chips below the control height, for dense contexts. */
  compact?: boolean;
};

/** Non-interactive chips, marked up as a real list so the count is announced. */
export default function SkillChipList({
  items,
  label,
  compact = false,
}: SkillChipListProps) {
  return (
    <SkillChipListRoot
      className={skillChipListClasses.root}
      component="ul"
      aria-label={label}
      direction="row"
      spacing={1}
    >
      {items.map((item) => (
        <li key={item}>
          <SkillChip
            className={skillChipListClasses.chip}
            label={item}
            ownerState={{ compact }}
          />
        </li>
      ))}
    </SkillChipListRoot>
  );
}
