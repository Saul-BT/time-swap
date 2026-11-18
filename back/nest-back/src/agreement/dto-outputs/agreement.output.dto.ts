import { AgreementModality } from '../enums/agreement-modality.enum';
import { AgreementStatus } from '../enums/agreement-status.enum';
import { ExchangeMode } from '../enums/exchange-mode.enum';
import type { ExpenseItem, ServiceItem } from '../entities/agreement-version.entity';

export class AgreementVersionOutputDto {
    version!: number;
    exchangeMode!: ExchangeMode;
    services!: ServiceItem[];
    modality!: AgreementModality;
    locationOrChannel!: string | null;
    startDateTime!: Date | null;
    expenses!: ExpenseItem[];
    cancellationTerms!: string;
    proposedById!: number;
    createdAt!: Date;
}

export class AgreementOutputDto {
    id!: number;
    conversationId!: number;
    listingId!: number;
    providerId!: number;
    receiverId!: number;
    status!: AgreementStatus;
    currentVersion!: number;
    // Quién ha aceptado ya la versión vigente
    acceptedByUserIds!: number[];
    // Todas las versiones, de la más antigua a la más reciente
    versions!: AgreementVersionOutputDto[];
    createdAt!: Date;
}