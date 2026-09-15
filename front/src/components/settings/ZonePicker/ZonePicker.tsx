"use client";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import { LocateFixed, MapPin } from "lucide-react";
import { useState } from "react";
import type { Zone } from "@/data/types";
import { nearestZone } from "@/data/zones";
import { interpolate } from "@/lib/i18n/interpolate";
import Eyebrow from "../../ui/Eyebrow";
import FormField from "../../ui/FormField";
import Icon from "../../ui/Icon";
import {
  ZonePickerActions,
  ZonePickerCurrent,
  ZonePickerCurrentValue,
  ZonePickerNotice,
  ZonePickerNoticeBody,
  ZonePickerNoticeTitle,
  ZonePickerRoot,
} from "./ZonePicker.style";
import {
  phaseFor,
  type ZonePickerCopy,
  type ZonePickerPhase,
  zonePickerClasses,
} from "./ZonePicker.util";

export type ZonePickerProps = {
  id: string;
  name: string;
  zones: readonly Zone[];
  value: Zone | null;
  onChange: (zone: Zone | null) => void;
  copy: ZonePickerCopy;
  disabled?: boolean;
  /** Ids of the texts describing the field, for the search input. */
  describedBy?: string;
};

const filterZones = createFilterOptions<Zone>({
  stringify: (zone) => `${zone.neighborhood} ${zone.district}`,
});

/**
 * Two ways to set a zone: pick the neighbourhood by hand or let the browser
 * approximate it. Only the zone id leaves this component; the coordinates
 * never do (ADR 0004).
 */
export default function ZonePicker({
  id,
  name,
  zones,
  value,
  onChange,
  copy,
  disabled,
  describedBy,
}: ZonePickerProps) {
  const [phase, setPhase] = useState<ZonePickerPhase>(() => phaseFor(value));

  const approximate = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setPhase("unsupported");
      return;
    }

    setPhase("approximating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange(
          nearestZone({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        );
        setPhase("set");
      },
      () => setPhase("denied"),
      { timeout: 10_000, maximumAge: 300_000 },
    );
  };

  const pickButton = (
    <Button
      variant="contained"
      type="button"
      onClick={() => setPhase("picking")}
      disabled={disabled}
    >
      <Icon icon={MapPin} size="sm" />
      {copy.pick}
    </Button>
  );

  const hiddenInput = (
    <input type="hidden" name={name} value={value?.id ?? ""} />
  );

  if (phase === "set" && value) {
    return (
      <ZonePickerRoot className={zonePickerClasses.root}>
        <ZonePickerCurrent className={zonePickerClasses.current}>
          <div>
            <Eyebrow className={zonePickerClasses.currentTitle}>
              {copy.currentTitle}
            </Eyebrow>
            <ZonePickerCurrentValue className={zonePickerClasses.currentValue}>
              {interpolate(copy.current, {
                neighborhood: value.neighborhood,
                district: value.district,
              })}
            </ZonePickerCurrentValue>
          </div>
          <Button
            variant="text"
            type="button"
            onClick={() => setPhase("picking")}
            disabled={disabled}
          >
            {copy.change}
          </Button>
        </ZonePickerCurrent>
        {hiddenInput}
      </ZonePickerRoot>
    );
  }

  if (phase === "picking") {
    return (
      <ZonePickerRoot className={zonePickerClasses.root}>
        <FormField htmlFor={id} label={copy.pickerLabel}>
          <Autocomplete
            className={zonePickerClasses.search}
            id={id}
            options={zones}
            value={value}
            onChange={(_, zone) => {
              onChange(zone);
              if (zone) {
                setPhase("set");
              }
            }}
            filterOptions={filterZones}
            groupBy={(zone) => zone.district}
            getOptionLabel={(zone) => zone.neighborhood}
            isOptionEqualToValue={(zone, selected) => zone.id === selected.id}
            noOptionsText={copy.noMatch}
            openOnFocus
            autoHighlight
            disabled={disabled}
            renderInput={(params) => {
              // InputBase only chains focus, blur and change from `inputProps`.
              const { ref: htmlInputRef, ...htmlInput } =
                params.slotProps.htmlInput;

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
                  placeholder={copy.pickerPlaceholder}
                  autoFocus
                  fullWidth
                />
              );
            }}
          />
        </FormField>
        {hiddenInput}
      </ZonePickerRoot>
    );
  }

  const isRefusal = phase === "denied" || phase === "unsupported";
  const title =
    phase === "denied"
      ? copy.deniedTitle
      : phase === "unsupported"
        ? copy.unsupportedTitle
        : copy.emptyTitle;
  const body =
    phase === "denied"
      ? copy.deniedBody
      : phase === "unsupported"
        ? copy.unsupportedBody
        : copy.emptyBody;

  return (
    <ZonePickerRoot className={zonePickerClasses.root}>
      <ZonePickerNotice
        className={zonePickerClasses.notice}
        ownerState={{ tone: "warning" }}
        role={isRefusal ? "alert" : undefined}
      >
        <ZonePickerNoticeTitle className={zonePickerClasses.noticeTitle}>
          {title}
        </ZonePickerNoticeTitle>
        <ZonePickerNoticeBody className={zonePickerClasses.noticeBody}>
          {body}
        </ZonePickerNoticeBody>
        <ZonePickerActions className={zonePickerClasses.actions}>
          {pickButton}
          {phase === "unsupported" ? null : (
            <Button
              variant="outlined"
              type="button"
              onClick={approximate}
              disabled={disabled || phase === "approximating"}
              aria-busy={phase === "approximating"}
            >
              <Icon icon={LocateFixed} size="sm" />
              {phase === "approximating"
                ? copy.approximating
                : copy.approximate}
            </Button>
          )}
        </ZonePickerActions>
      </ZonePickerNotice>
      {hiddenInput}
    </ZonePickerRoot>
  );
}
