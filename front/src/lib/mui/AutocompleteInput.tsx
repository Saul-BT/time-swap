"use client";

import {
  type AutocompleteRenderInputParams,
  OutlinedInput,
} from "@mui/material";

export type AutocompleteInputProps = {
  params: AutocompleteRenderInputParams;
  placeholder?: string;
  /** Ids of the texts describing the field. */
  describedBy?: string;
  autoFocus?: boolean;
};

/**
 * `OutlinedInput` as an `Autocomplete` input. `InputBase` only chains focus,
 * blur and change from `inputProps`; `slotProps.input` is merged after, so the
 * handlers must travel there or the popup never opens.
 *
 * @example
 * <Autocomplete renderInput={(params) => <AutocompleteInput params={params} />} />
 */
export default function AutocompleteInput({
  params,
  placeholder,
  describedBy,
  autoFocus,
}: AutocompleteInputProps) {
  const { ref: htmlInputRef, ...htmlInput } = params.slotProps.htmlInput;

  return (
    <OutlinedInput
      ref={params.slotProps.input.ref}
      className={params.slotProps.input.className}
      startAdornment={params.slotProps.input.startAdornment}
      endAdornment={params.slotProps.input.endAdornment}
      onMouseDown={params.slotProps.input.onMouseDown}
      disabled={params.disabled}
      inputRef={htmlInputRef}
      inputProps={{ ...htmlInput, "aria-describedby": describedBy }}
      placeholder={placeholder}
      autoFocus={autoFocus}
      fullWidth
    />
  );
}
