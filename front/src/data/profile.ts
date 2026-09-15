import type { CompletionStatus, Profile } from "./types";

// FIXME(api): sample member. Replace with GET /profile/me (#5) and keep the
// types; every settings page reads from here until then.
export const SAMPLE_PROFILE: Profile = {
  userId: "m-0001",
  displayName: "Marta R.",
  initials: "MR",
  pronouns: "",
  bio: "Vivo en [Barrio] desde hace años. Trabajo con ordenadores y se me da bien explicar cosas técnicas con calma. Si quieres, llámame al 6XX XXX XXX.",
  skills: ["computers", "paperwork", "writing"],
  interests: ["sewing", "gardening"],
  modalities: ["in_person", "remote"],
  availability: [
    "mon.evening",
    "tue.afternoon",
    "tue.evening",
    "thu.afternoon",
    "sat.morning",
    "sat.afternoon",
  ],
  approximateLocation: null,
  privacySettings: {
    visibleToVisitors: false,
    searchable: false,
    reveal: {
      bio: "visitor",
      skills: "visitor",
      interests: "member",
      availability: "contact",
      neighborhood: "contact",
    },
  },
};

// FIXME(api): computed by the API on every save (#5). Static here so the
// screen can show the "3 of 5" state from the design.
export const SAMPLE_COMPLETION: CompletionStatus = {
  sections: {
    presentation: "review",
    skills: "done",
    availability: "done",
    zone: "missing",
    privacy: "done",
  },
  canPublish: false,
};
