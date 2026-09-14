import Button from "@mui/material/Button";
import { SECTION_ID } from "@/data/navigation";
import { getDictionary } from "@/i18n/dictionary";
import {
  SearchFormAreaCell,
  SearchFormInput,
  SearchFormRoot,
} from "./SearchForm.style";
import { searchFormClasses } from "./SearchForm.util";

/** A plain HTML form: no client JavaScript, so the page stays a server component. */
export default async function SearchForm() {
  const { hero, placeholder } = await getDictionary();

  return (
    <SearchFormRoot
      className={searchFormClasses.root}
      component="form"
      role="search"
      action={`#${SECTION_ID.listings}`}
    >
      <SearchFormInput
        className={searchFormClasses.input}
        id="search-skill"
        name="habilidad"
        inputProps={{ "aria-label": hero.search.skillLabel }}
        placeholder={hero.search.skillPlaceholder}
      />

      <SearchFormAreaCell className={searchFormClasses.areaCell}>
        <SearchFormInput
          id="search-area"
          name="zona"
          inputProps={{ "aria-label": hero.search.areaLabel }}
          placeholder={placeholder.area}
        />
      </SearchFormAreaCell>

      <Button type="submit" variant="contained" sx={{ px: 4 }}>
        {hero.search.submit}
      </Button>
    </SearchFormRoot>
  );
}
