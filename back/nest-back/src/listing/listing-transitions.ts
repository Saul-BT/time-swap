import { ListingStatus } from './enums/listing-status.enum';

// Para cada estado: a qué estados se puede pasar (máquina de estados del dominio)
export const ALLOWED_TRANSITIONS: Record<ListingStatus, ListingStatus[]> = {
    [ListingStatus.DRAFT]: [ListingStatus.ACTIVE, ListingStatus.REMOVED],
    [ListingStatus.ACTIVE]: [ListingStatus.PAUSED, ListingStatus.EXPIRED, ListingStatus.REMOVED],
    [ListingStatus.PAUSED]: [ListingStatus.ACTIVE, ListingStatus.REMOVED],
    [ListingStatus.EXPIRED]: [ListingStatus.ACTIVE, ListingStatus.REMOVED],
    [ListingStatus.REMOVED]: [],
    // Lo gestiona moderación, el autor no puede cambiarlo
    [ListingStatus.MODERATION_HOLD]: [],
};

export function canTransition(from: ListingStatus, to: ListingStatus): boolean {
    return ALLOWED_TRANSITIONS[from].includes(to);
}