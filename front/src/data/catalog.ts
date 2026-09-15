import type { CatalogEntry } from "./types";

// FIXME(api): sample catalogues. Replace with GET /catalog/skills and
// GET /catalog/interests (#5); keep the `CatalogEntry` type.
export const SKILLS_CATALOG: readonly CatalogEntry[] = [
  { id: "computers", name: "Informática y móviles" },
  { id: "paperwork", name: "Trámites y papeleo" },
  { id: "writing", name: "Escritura y CV" },
  { id: "languages", name: "Idiomas" },
  { id: "tutoring", name: "Apoyo escolar" },
  { id: "photography", name: "Fotografía" },
  { id: "cooking", name: "Cocina" },
  { id: "sewing", name: "Costura" },
  { id: "gardening", name: "Jardinería" },
  { id: "diy", name: "Bricolaje y pequeñas reparaciones" },
  { id: "bikes", name: "Bicicletas" },
  { id: "music", name: "Música" },
  { id: "care", name: "Acompañamiento" },
  { id: "pets", name: "Cuidado de animales" },
];

export const INTERESTS_CATALOG: readonly CatalogEntry[] = SKILLS_CATALOG;

export function findCatalogEntry(
  catalog: readonly CatalogEntry[],
  id: string,
): CatalogEntry | undefined {
  return catalog.find((entry) => entry.id === id);
}
