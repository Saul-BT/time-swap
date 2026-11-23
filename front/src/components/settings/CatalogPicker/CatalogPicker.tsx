"use client";

import { Autocomplete, createFilterOptions } from "@mui/material";
import { Plus, X } from "lucide-react";
import { useMemo } from "react";
import type { CatalogEntry } from "@/data/types";
import { interpolate } from "@/lib/i18n/interpolate";
import AutocompleteInput from "@/lib/mui/AutocompleteInput";
import Icon from "../../ui/Icon";
import {
  CatalogPickerChip,
  CatalogPickerEmpty,
  CatalogPickerList,
  CatalogPickerRoot,
  CatalogPickerSuggestion,
} from "./CatalogPicker.style";
import {
  type CatalogPickerCopy,
  catalogPickerClasses,
  pickSuggestions,
} from "./CatalogPicker.util";

/** Stable across renders: a new options array per render makes the popup loop. */
const filterByName = createFilterOptions<CatalogEntry>({
  stringify: (entry) => entry.name,
});

export type CatalogPickerProps = {
  id: string;
  name: string;
  catalog: readonly CatalogEntry[];
  value: readonly string[];
  onChange: (ids: string[]) => void;
  copy: CatalogPickerCopy;
  suggestionCount: number;
  /** Shown under the search while nothing is chosen. */
  emptyMessage?: string;
  disabled?: boolean;
  /** Ids of the texts describing the field, for the search input. */
  describedBy?: string;
};

/**
 * Search over a closed catalogue. Free text never becomes a value: what is
 * not in the list cannot be chosen, so members find each other by the same name.
 */
export default function CatalogPicker({
  id,
  name,
  catalog,
  value,
  onChange,
  copy,
  suggestionCount,
  emptyMessage,
  disabled,
  describedBy,
}: CatalogPickerProps) {
  // Identity matters: Autocomplete resets its input whenever `value` changes.
  const chosen = useMemo(
    () =>
      value
        .map((entryId) => catalog.find((entry) => entry.id === entryId))
        .filter((entry): entry is CatalogEntry => entry !== undefined),
    [catalog, value],
  );
  const suggestions = pickSuggestions(catalog, value, suggestionCount);

  const add = (entryId: string) => {
    if (!value.includes(entryId)) {
      onChange([...value, entryId]);
    }
  };

  return (
    <CatalogPickerRoot className={catalogPickerClasses.root}>
      <Autocomplete
        className={catalogPickerClasses.search}
        id={id}
        multiple
        options={catalog}
        value={chosen}
        onChange={(_, entries) => onChange(entries.map((entry) => entry.id))}
        filterOptions={filterByName}
        filterSelectedOptions
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        renderValue={() => null}
        disabled={disabled}
        noOptionsText={copy.noMatch}
        autoHighlight
        renderInput={(params) => (
          <AutocompleteInput
            params={params}
            placeholder={copy.search}
            describedBy={describedBy}
          />
        )}
      />
      <input type="hidden" name={name} value={value.join(",")} />

      {chosen.length > 0 ? (
        <CatalogPickerList
          className={catalogPickerClasses.selected}
          aria-label={copy.selectedLabel}
        >
          {chosen.map((entry) => (
            <li key={entry.id}>
              <CatalogPickerChip
                className={catalogPickerClasses.chip}
                label={entry.name}
                onDelete={
                  disabled
                    ? undefined
                    : () => onChange(value.filter((v) => v !== entry.id))
                }
                deleteIcon={
                  <span
                    role="img"
                    aria-label={interpolate(copy.remove, { name: entry.name })}
                  >
                    <Icon icon={X} size="sm" />
                  </span>
                }
              />
            </li>
          ))}
        </CatalogPickerList>
      ) : emptyMessage ? (
        <CatalogPickerEmpty className={catalogPickerClasses.empty}>
          {emptyMessage}
        </CatalogPickerEmpty>
      ) : null}

      {suggestions.length > 0 ? (
        <CatalogPickerList
          className={catalogPickerClasses.suggestions}
          aria-label={copy.suggestionsLabel}
        >
          {suggestions.map((entry) => (
            <li key={entry.id}>
              <CatalogPickerSuggestion
                className={catalogPickerClasses.suggestion}
                variant="outlined"
                clickable
                disabled={disabled}
                icon={<Icon icon={Plus} size="sm" />}
                label={entry.name}
                aria-label={interpolate(copy.add, { name: entry.name })}
                onClick={() => add(entry.id)}
              />
            </li>
          ))}
        </CatalogPickerList>
      ) : null}
    </CatalogPickerRoot>
  );
}
