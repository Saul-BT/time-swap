import type { Filter } from "./types";

/** Static preview; filtering is not implemented yet. */
export const LISTING_FILTERS: readonly Filter[] = [
  { id: "all", active: true },
  { id: "offers" },
  { id: "requests" },
  { id: "inPerson" },
  { id: "remote" },
  { id: "nearby" },
  { id: "barter" },
];
