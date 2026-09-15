import type { Zone } from "./types";

// FIXME(api): sample zones. Replace with the zone catalogue the API exposes
// (#5, ADR 0004); precision and radius are still open there.
export const ZONES: readonly Zone[] = [
  {
    id: "z-01",
    city: "[Ciudad]",
    district: "Centro",
    neighborhood: "[Barrio] Sol",
    center: { lat: 40.4169, lng: -3.7035 },
  },
  {
    id: "z-02",
    city: "[Ciudad]",
    district: "Centro",
    neighborhood: "[Barrio] Lavapiés",
    center: { lat: 40.4088, lng: -3.7017 },
  },
  {
    id: "z-03",
    city: "[Ciudad]",
    district: "Centro",
    neighborhood: "[Barrio] Malasaña",
    center: { lat: 40.4257, lng: -3.7046 },
  },
  {
    id: "z-04",
    city: "[Ciudad]",
    district: "Arganzuela",
    neighborhood: "[Barrio] Delicias",
    center: { lat: 40.3975, lng: -3.6915 },
  },
  {
    id: "z-05",
    city: "[Ciudad]",
    district: "Arganzuela",
    neighborhood: "[Barrio] Legazpi",
    center: { lat: 40.3908, lng: -3.6952 },
  },
  {
    id: "z-06",
    city: "[Ciudad]",
    district: "Retiro",
    neighborhood: "[Barrio] Pacífico",
    center: { lat: 40.4035, lng: -3.6743 },
  },
  {
    id: "z-07",
    city: "[Ciudad]",
    district: "Retiro",
    neighborhood: "[Barrio] Ibiza",
    center: { lat: 40.4184, lng: -3.6739 },
  },
  {
    id: "z-08",
    city: "[Ciudad]",
    district: "Chamberí",
    neighborhood: "[Barrio] Trafalgar",
    center: { lat: 40.4326, lng: -3.7017 },
  },
  {
    id: "z-09",
    city: "[Ciudad]",
    district: "Chamberí",
    neighborhood: "[Barrio] Almagro",
    center: { lat: 40.4331, lng: -3.6931 },
  },
  {
    id: "z-10",
    city: "[Ciudad]",
    district: "Tetuán",
    neighborhood: "[Barrio] Bellas Vistas",
    center: { lat: 40.4536, lng: -3.7093 },
  },
];

export function findZone(id: string): Zone | undefined {
  return ZONES.find((zone) => zone.id === id);
}

/** Nearest zone by flat distance; good enough at city scale, no geodesy needed. */
export function nearestZone(point: { lat: number; lng: number }): Zone {
  let best = ZONES[0];
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const zone of ZONES) {
    const dLat = zone.center.lat - point.lat;
    const dLng = zone.center.lng - point.lng;
    const distance = dLat * dLat + dLng * dLng;

    if (distance < bestDistance) {
      best = zone;
      bestDistance = distance;
    }
  }

  return best;
}
