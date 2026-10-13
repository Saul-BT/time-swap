/**
 * Estado vacío de reputación (CA-6): la ausencia de valoraciones se expresa
 * como falta de historial, nunca como mala reputación. Se rellenará de
 * verdad cuando exista INT-05.
 */
export class ReputationSummaryDto {
    hasHistory!: boolean;
    overallScore?: number;
    byService?: { service: string; score: number }[];
}

/** Se rellenará de verdad cuando exista el bloque ANU (anuncios). */
export class ActiveListingSummaryDto {
    id!: number;
    title!: string;
}

export class PublicProfileDto {
    id!: number;
    name!: string;
    presentation!: string | null;
    areaZone!: string | null;
    modalities!: string[];
    skills!: string[];
    interests!: string[];
    verified!: boolean;
    isOwnProfile!: boolean;
    activeListings!: ActiveListingSummaryDto[];
    reputation!: ReputationSummaryDto;
}