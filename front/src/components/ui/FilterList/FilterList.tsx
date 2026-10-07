import { LISTING_FILTERS } from "@/data/filters";
import { getDictionary } from "@/i18n/dictionary";
import { FilterChip, FilterListRoot } from "./FilterList.style";
import { filterListClasses } from "./FilterList.util";

/**
 * Read-only preview of the filters: a list with `aria-current`, not buttons
 * that would do nothing when pressed.
 */
export default async function FilterList() {
  const { hero } = await getDictionary();

  return (
    <FilterListRoot
      className={filterListClasses.root}
      component="ul"
      aria-label={hero.filters.label}
      direction="row"
      spacing={1}
    >
      {LISTING_FILTERS.map((filter) => (
        <li key={filter.id} aria-current={filter.active ? "true" : undefined}>
          <FilterChip
            className={filterListClasses.chip}
            label={hero.filters[filter.id]}
            ownerState={{ active: Boolean(filter.active) }}
          />
        </li>
      ))}
    </FilterListRoot>
  );
}
