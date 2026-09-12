import {
  TagToggleGroupChip,
  TagToggleGroupLegend,
  TagToggleGroupList,
  TagToggleGroupRoot,
} from "./TagToggleGroup.style";
import { tagToggleGroupClasses } from "./TagToggleGroup.util";

export type TagToggleGroupOption = { id: string; label: string };

export type TagToggleGroupProps = {
  legend: string;
  options: readonly TagToggleGroupOption[];
  selected: ReadonlySet<string>;
  onToggle: (id: string) => void;
};

/** Multi-select chip picker: every chip toggles on its own, no limit on how many. */
export default function TagToggleGroup({
  legend,
  options,
  selected,
  onToggle,
}: TagToggleGroupProps) {
  return (
    <TagToggleGroupRoot className={tagToggleGroupClasses.root}>
      <TagToggleGroupLegend className={tagToggleGroupClasses.legend}>
        {legend}
      </TagToggleGroupLegend>
      <TagToggleGroupList className={tagToggleGroupClasses.list}>
        {options.map((option) => {
          const active = selected.has(option.id);

          return (
            <TagToggleGroupChip
              key={option.id}
              className={tagToggleGroupClasses.chip}
              ownerState={{ active }}
              label={option.label}
              onClick={() => onToggle(option.id)}
              aria-pressed={active}
              clickable
            />
          );
        })}
      </TagToggleGroupList>
    </TagToggleGroupRoot>
  );
}
