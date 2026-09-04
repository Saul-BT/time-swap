import type esDictionary from "./dictionaries/es.json";

/**
 * Kept apart from `dictionary.ts`, which is server-only: importing a type
 * must not drag `next/root-params` into a client module.
 */
export type Dictionary = typeof esDictionary;
