"use client";

import Button from "@mui/material/Button";
import { useState } from "react";
import { SKILLS_CATALOG } from "@/data/catalog";
import type { AvailabilityCell, RevealMoment, Zone } from "@/data/types";
import { ZONES } from "@/data/zones";
import CatalogPicker from "../../settings/CatalogPicker";
import ConsequenceRow from "../../settings/ConsequenceRow";
import PanelFooter from "../../settings/PanelFooter";
import PanelHeader from "../../settings/PanelHeader";
import PanelSkeleton from "../../settings/PanelSkeleton";
import RevealLadder from "../../settings/RevealLadder";
import ServerErrorNotice from "../../settings/ServerErrorNotice";
import {
  UnsavedChangesProvider,
  useUnsavedChanges,
} from "../../settings/UnsavedChanges";
import VisibilityMatrix, {
  type RevealMap,
} from "../../settings/VisibilityMatrix";
import WeekGrid from "../../settings/WeekGrid";
import ZonePicker from "../../settings/ZonePicker";
import Specimen from "../Specimen";
import { SettingsSpecimensRoot } from "./SettingsSpecimens.style";
import { settingsSpecimensClasses } from "./SettingsSpecimens.util";

const MOMENTS: Record<RevealMoment, string> = {
  visitor: "Visitor",
  member: "Member",
  contact: "Contact",
  agreement: "Agreement",
};

const MOMENTS_SHORT: Record<RevealMoment, string> = {
  visitor: "V",
  member: "M",
  contact: "C",
  agreement: "A",
};

const HINTS: Record<RevealMoment, string> = {
  visitor: "Anyone can see it, even without an account.",
  member: "Only with a verified account.",
  contact: "Once you accept a contact request.",
  agreement: "Only with a closed agreement.",
};

const DAYS = {
  mon: "M",
  tue: "T",
  wed: "W",
  thu: "T",
  fri: "F",
  sat: "S",
  sun: "S",
};
const DAYS_LONG = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
const SLOTS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function DirtyToggle() {
  const { dirty, setDirty } = useUnsavedChanges();

  return (
    <Button variant="outlined" type="button" onClick={() => setDirty(!dirty)}>
      {dirty ? "Mark as saved" : "Mark as dirty"}
    </Button>
  );
}

/** Interactive settings controls with local state, since the brand book page is a server component. */
export default function SettingsSpecimens() {
  const [moment, setMoment] = useState<RevealMoment>("member");
  const [cells, setCells] = useState<AvailabilityCell[]>([
    "tue.afternoon",
    "sat.morning",
  ]);
  const reveal: RevealMap = {
    bio: "visitor",
    skills: "visitor",
    interests: "member",
    availability: "contact",
    neighborhood: "contact",
  };
  const [skills, setSkills] = useState<string[]>(["computers"]);
  const [zone, setZone] = useState<Zone | null>(ZONES[0] ?? null);
  const [on, setOn] = useState(false);
  const [savedAt, setSavedAt] = useState<number>();

  return (
    <SettingsSpecimensRoot className={settingsSpecimensClasses.root}>
      <Specimen
        name="PanelHeader"
        variants={[
          {
            label: "root",
            children: (
              <div style={{ width: "100%" }}>
                <PanelHeader
                  titleId="bb-panel-title"
                  step="Section 1 of 5"
                  title="Presentation"
                  lead="How people see you in your listings, your profile and the chat."
                />
              </div>
            ),
          },
        ]}
      />
      <Specimen
        name="RevealLadder"
        variants={[
          {
            label: "root",
            children: (
              <div style={{ width: "100%" }}>
                <RevealLadder
                  id="bb-reveal"
                  name="bb-reveal"
                  value={moment}
                  onChange={setMoment}
                  copy={{
                    legend: "Who sees your presentation",
                    moments: MOMENTS,
                    hints: HINTS,
                  }}
                />
              </div>
            ),
          },
        ]}
      />
      <Specimen
        name="WeekGrid"
        variants={[
          {
            label: "root",
            children: (
              <div style={{ width: "100%" }}>
                <WeekGrid
                  name="bb-availability"
                  value={cells}
                  onChange={setCells}
                  copy={{
                    label: "Tap the cells where you usually have a moment",
                    days: DAYS,
                    daysLong: DAYS_LONG,
                    slots: SLOTS,
                    cellLabel: "{day} · {slot}",
                  }}
                />
              </div>
            ),
          },
        ]}
      />
      <Specimen
        name="VisibilityMatrix"
        variants={[
          {
            label: "root",
            children: (
              <div style={{ width: "100%" }}>
                <VisibilityMatrix
                  value={reveal}
                  editHref={{
                    bio: "#",
                    skills: "#",
                    interests: "#",
                    availability: "#",
                    neighborhood: "#",
                  }}
                  copy={{
                    label: "From when each piece of data is visible",
                    dataHeader: "Data",
                    moments: MOMENTS,
                    momentsShort: MOMENTS_SHORT,
                    rows: {
                      nameAndModality: "Name and modality",
                      district: "District",
                      bio: "Presentation",
                      skills: "Skills",
                      interests: "Interests",
                      availability: "Availability",
                      neighborhood: "Neighbourhood",
                      contact: "Email, phone, address, balance",
                    },
                    fixed: "fixed",
                    never: "Never",
                    cellLabel: "{field} · {moment}",
                    change: "Change {field}",
                    footnote: "Name, modality and district: always public.",
                  }}
                />
              </div>
            ),
          },
        ]}
      />
      <Specimen
        name="CatalogPicker"
        variants={[
          {
            label: "root",
            children: (
              <div style={{ width: "100%" }}>
                <CatalogPicker
                  id="bb-catalog"
                  name="bb-skills"
                  catalog={SKILLS_CATALOG}
                  value={skills}
                  onChange={setSkills}
                  suggestionCount={3}
                  emptyMessage="Nothing chosen yet."
                  copy={{
                    search: "Search the catalogue",
                    selectedLabel: "Selected",
                    suggestionsLabel: "Suggestions",
                    add: "Add {name}",
                    remove: "Remove {name}",
                    noMatch: "Nothing in the catalogue with that name.",
                  }}
                />
              </div>
            ),
          },
        ]}
      />
      <Specimen
        name="ZonePicker"
        variants={[
          {
            label: "set",
            children: (
              <div style={{ width: "100%" }}>
                <ZonePicker
                  id="bb-zone"
                  name="bb-zone"
                  zones={ZONES}
                  value={zone}
                  onChange={setZone}
                  copy={{
                    emptyTitle: "You have not chosen a zone yet.",
                    emptyBody:
                      "We store the centre of your zone, never your address.",
                    pick: "Choose my neighbourhood",
                    approximate: "Approximate",
                    approximating: "Finding your zone…",
                    deniedTitle: "The browser did not share your location.",
                    deniedBody:
                      "No problem: choose your neighbourhood by hand.",
                    unsupportedTitle:
                      "This browser cannot approximate your zone.",
                    unsupportedBody: "Choose your neighbourhood by hand.",
                    pickerLabel: "Your neighbourhood",
                    pickerPlaceholder: "Search your neighbourhood",
                    noMatch: "We could not find that neighbourhood.",
                    currentTitle: "Your zone",
                    current: "{neighborhood}, {district}",
                    change: "Change",
                  }}
                />
              </div>
            ),
          },
        ]}
      />
      <Specimen
        name="ConsequenceRow"
        variants={[
          {
            label: "root",
            children: (
              <div style={{ width: "100%" }}>
                <ConsequenceRow
                  name="bb-switch"
                  title="My profile is visible without an account"
                  body="Anyone arriving from outside can read your presentation and your skills."
                  nowLabel="Right now:"
                  nowValue={on ? "anyone" : "verified members only"}
                  checked={on}
                  onChange={setOn}
                />
              </div>
            ),
          },
        ]}
      />
      <Specimen
        name="ServerErrorNotice"
        variants={[
          {
            label: "root",
            children: (
              <div style={{ width: "100%" }}>
                <ServerErrorNotice
                  copy={{
                    title: "We could not save",
                    body: "Your changes are still here. Try again in a moment.",
                    retry: "Retry",
                  }}
                  onRetry={() => {}}
                />
              </div>
            ),
          },
        ]}
      />
      <UnsavedChangesProvider
        copy={{
          title: "You have unsaved changes",
          body: "If you leave now, the changes in this section are lost.",
          stay: "Keep editing",
          leave: "Leave without saving",
        }}
      >
        <Specimen
          name="PanelFooter"
          variants={[
            {
              label: "idle · saved",
              children: (
                <div style={{ width: "100%" }}>
                  <PanelFooter
                    copy={{
                      save: "Save section",
                      saving: "Saving…",
                      saved: "Saved",
                      next: "Next: Skills",
                    }}
                    nextHref="#"
                    pending={false}
                    savedAt={savedAt}
                  />
                  <Button
                    variant="text"
                    type="button"
                    onClick={() => setSavedAt(Date.now())}
                  >
                    Show saved feedback
                  </Button>
                </div>
              ),
            },
            {
              label: "pending",
              children: (
                <div style={{ width: "100%" }}>
                  <PanelFooter
                    copy={{
                      save: "Save section",
                      saving: "Saving…",
                      saved: "Saved",
                      next: "Next: Skills",
                    }}
                    nextHref="#"
                    pending
                  />
                </div>
              ),
            },
          ]}
        />
        <Specimen
          name="UnsavedChangesDialog"
          variants={[
            {
              label: "guard on a dirty section",
              children: (
                <>
                  <DirtyToggle />
                  <PanelFooter
                    copy={{
                      save: "Save",
                      saving: "Saving…",
                      saved: "Saved",
                      next: "Next (guarded)",
                    }}
                    nextHref="#unsaved"
                    pending={false}
                  />
                </>
              ),
            },
          ]}
        />
      </UnsavedChangesProvider>
      <Specimen
        name="PanelSkeleton"
        variants={[
          {
            label: "rows={3}",
            children: (
              <div style={{ width: "100%" }}>
                <PanelSkeleton rows={3} label="Loading section" />
              </div>
            ),
          },
        ]}
      />
    </SettingsSpecimensRoot>
  );
}
