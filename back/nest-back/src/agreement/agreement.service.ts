import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager, In } from 'typeorm';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Conversation } from '../conversation/entities/conversation.entity';
import { ListingKind } from '../listing/enums/listing-kind.enum';
import {
    AgreementOutputDto,
    AgreementVersionOutputDto,
} from './dto-outputs/agreement.output.dto';
import { AcceptAgreementDto } from './dto/accept-agreement.dto';
import { AgreementTermsDto } from './dto/agreement-terms.dto';
import { ProposeAgreementDto } from './dto/propose-agreement.dto';
import { AgreementAcceptance } from './entities/agreement-acceptance.entity';
import { AgreementVersion } from './entities/agreement-version.entity';
import { Agreement } from './entities/agreement.entity';
import { Exchange } from './entities/exchange.entity';
import { Obligation } from './entities/obligation.entity';
import { AgreementStatus } from './enums/agreement-status.enum';
import { ExchangeMode } from './enums/exchange-mode.enum';

// Estados en los que un acuerdo cuenta como "abierto" en su conversación
const OPEN_STATUSES = [AgreementStatus.PROPOSED, AgreementStatus.ACCEPTED, AgreementStatus.ACTIVE];

// Código de error de Postgres cuando se rompe una restricción única
const UNIQUE_VIOLATION = '23505';

@Injectable()
export class AgreementService {
    constructor(private readonly dataSource: DataSource) {}

    // 1. Proponer un acuerdo (versión 1)
    async propose(dto: ProposeAgreementDto, user: UserActiveInterface): Promise<AgreementOutputDto> {
        const conversation = await this.dataSource.manager.findOne(Conversation, {
            where: [
                { id: dto.conversationId, requester: { id: user.id } },
                { id: dto.conversationId, owner: { id: user.id } },
            ],
            relations: { listing: true, requester: true, owner: true },
        });
        // Si no participas, es como si no existiera
        if (!conversation) throw new NotFoundException('Conversation not found');

        // Quien presta es quien marca el anuncio: en una oferta, el autor; en una petición, quien contacta
        const isOffer = conversation.listing.kind === ListingKind.OFFER;
        const provider = isOffer ? conversation.owner : conversation.requester;
        const receiver = isOffer ? conversation.requester : conversation.owner;

        this.validateTerms(dto, provider.id, receiver.id);

        try {
            const agreementId = await this.dataSource.transaction(async (manager) => {
                const open = await manager.findOne(Agreement, {
                    where: { conversation: { id: conversation.id }, status: In(OPEN_STATUSES) },
                });
                if (open) {
                    throw new ConflictException('This conversation already has an open agreement');
                }

                const agreement = await manager.save(
                    manager.create(Agreement, {
                        conversation: { id: conversation.id },
                        listing: { id: conversation.listing.id },
                        provider: { id: provider.id },
                        receiver: { id: receiver.id },
                        status: AgreementStatus.PROPOSED,
                        currentVersion: 1,
                    }),
                );
                await this.saveVersion(manager, agreement.id, 1, dto, user.id);
                return agreement.id;
            });
            // TODO: publicar el evento AgreementProposed (cuando se decida la librería de eventos)
            return await this.getOutput(agreementId);
        } catch (error) {
            // Dos propuestas a la vez: la base de datos rechaza la segunda
            if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
                throw new ConflictException('This conversation already has an open agreement');
            }
            throw error;
        }
    }

    // 2. Contrapropuesta: crea una versión nueva y las aceptaciones anteriores dejan de valer
    async counter(id: number, terms: AgreementTermsDto, user: UserActiveInterface): Promise<AgreementOutputDto> {
        await this.dataSource.transaction(async (manager) => {
            const agreement = await this.lockAndLoad(manager, id, user.id);
            if (agreement.status !== AgreementStatus.PROPOSED) {
                throw new ConflictException('Agreement cannot be modified in its current status');
            }
            this.validateTerms(terms, agreement.provider.id, agreement.receiver.id);

            const next = agreement.currentVersion + 1;
            await this.saveVersion(manager, agreement.id, next, terms, user.id);
            await manager.update(Agreement, { id: agreement.id }, { currentVersion: next });
        });
        return this.getOutput(id);
    }

    // 3. Aceptar una versión concreta
    async accept(id: number, dto: AcceptAgreementDto, user: UserActiveInterface): Promise<AgreementOutputDto> {
        await this.dataSource.transaction(async (manager) => {
            const agreement = await this.lockAndLoad(manager, id, user.id);

            if (agreement.status !== AgreementStatus.PROPOSED) {
                throw new ConflictException('Agreement is not waiting for acceptance');
            }
            // Si mientras tanto salió otra versión, esta aceptación ya no sirve
            if (dto.version !== agreement.currentVersion) {
                throw new ConflictException('Version is outdated');
            }

            const already = await manager.findOne(AgreementAcceptance, {
                where: { agreement: { id }, version: dto.version, user: { id: user.id } },
            });
            if (already) throw new ConflictException('You already accepted this version');

            await manager.save(
                manager.create(AgreementAcceptance, {
                    agreement: { id },
                    version: dto.version,
                    user: { id: user.id },
                }),
            );
            // TODO: publicar el evento AgreementVersionAccepted

            const accepted = await manager.count(AgreementAcceptance, {
                where: { agreement: { id }, version: dto.version },
            });
            // Solo hay dos participantes: con dos aceptaciones distintas de la misma versión, se activa
            if (accepted >= 2) {
                await this.activate(manager, agreement);
            }
        });
        return this.getOutput(id);
    }

    // 4. Abandonar antes de que se active. No se mueve ningún crédito.
    async cancel(id: number, user: UserActiveInterface): Promise<AgreementOutputDto> {
        await this.dataSource.transaction(async (manager) => {
            const agreement = await this.lockAndLoad(manager, id, user.id);
            if (agreement.status !== AgreementStatus.PROPOSED && agreement.status !== AgreementStatus.ACCEPTED) {
                throw new ConflictException('Only a pending agreement can be cancelled');
            }
            await manager.update(Agreement, { id }, { status: AgreementStatus.CANCELLED });
        });
        return this.getOutput(id);
    }

    // 5. Ver un acuerdo (solo participantes)
    async findOne(id: number, user: UserActiveInterface): Promise<AgreementOutputDto> {
        const agreement = await this.dataSource.manager.findOne(Agreement, {
            where: { id },
            relations: { provider: true, receiver: true },
        });
        if (!agreement || !this.isParticipant(agreement, user.id)) {
            throw new NotFoundException('Agreement not found');
        }
        return this.getOutput(id);
    }

    // 6. El acuerdo abierto de una conversación (solo participantes)
    async findByConversation(conversationId: number, user: UserActiveInterface): Promise<AgreementOutputDto> {
        const agreement = await this.dataSource.manager.findOne(Agreement, {
            where: { conversation: { id: conversationId }, status: In(OPEN_STATUSES) },
            relations: { provider: true, receiver: true },
        });
        if (!agreement || !this.isParticipant(agreement, user.id)) {
            throw new NotFoundException('Agreement not found');
        }
        return this.getOutput(agreement.id);
    }

    // ---------- Ayudantes privados ----------

    private isParticipant(agreement: Agreement, userId: number): boolean {
        return agreement.provider.id === userId || agreement.receiver.id === userId;
    }

    // Carga el acuerdo, comprueba que participas y lo BLOQUEA hasta acabar la transacción.
    // Así dos peticiones a la vez no se pisan.
    private async lockAndLoad(manager: EntityManager, id: number, userId: number): Promise<Agreement> {
        const agreement = await manager.findOne(Agreement, {
            where: { id },
            relations: { provider: true, receiver: true },
        });
        if (!agreement || !this.isParticipant(agreement, userId)) {
            throw new NotFoundException('Agreement not found');
        }

        // Bloqueo, y releemos estado y versión por si cambiaron mientras esperábamos
        const fresh = await manager.findOne(Agreement, {
            where: { id },
            lock: { mode: 'pessimistic_write' },
        });
        if (!fresh) throw new NotFoundException('Agreement not found');
        agreement.status = fresh.status;
        agreement.currentVersion = fresh.currentVersion;
        return agreement;
    }

    // Guarda una versión nueva y registra la aceptación automática de quien la propone
    private async saveVersion(
        manager: EntityManager,
        agreementId: number,
        version: number,
        terms: AgreementTermsDto,
        proposerId: number,
    ): Promise<void> {
        await manager.save(
            manager.create(AgreementVersion, {
                agreement: { id: agreementId },
                version,
                exchangeMode: terms.exchangeMode,
                services: terms.services.map((s) => ({
                    performerId: s.performerId,
                    recipientId: s.recipientId,
                    description: s.description,
                    expectedMinutes: s.expectedMinutes,
                })),
                modality: terms.modality,
                locationOrChannel: terms.locationOrChannel ?? null,
                startDateTime: terms.startDateTime ?? null,
                expenses: (terms.expenses ?? []).map((e) => ({
                    concept: e.concept,
                    responsibleId: e.responsibleId,
                })),
                cancellationTerms: terms.cancellationTerms,
                proposedBy: { id: proposerId },
            }),
        );
        await manager.save(
            manager.create(AgreementAcceptance, {
                agreement: { id: agreementId },
                version,
                user: { id: proposerId },
            }),
        );
    }

    // Activa el acuerdo y crea el intercambio con sus prestaciones. Va dentro de la misma transacción.
    private async activate(manager: EntityManager, agreement: Agreement): Promise<void> {
        const version = await manager.findOne(AgreementVersion, {
            where: { agreement: { id: agreement.id }, version: agreement.currentVersion },
        });
        if (!version) throw new NotFoundException('Agreement version not found');

        await manager.update(Agreement, { id: agreement.id }, { status: AgreementStatus.ACTIVE });

        const exchange = await manager.save(
            manager.create(Exchange, { agreement: { id: agreement.id } }),
        );
        // Una prestación si es por créditos, dos si es trueque
        for (const service of version.services) {
            await manager.save(
                manager.create(Obligation, {
                    exchange: { id: exchange.id },
                    performer: { id: service.performerId },
                    recipient: { id: service.recipientId },
                    description: service.description,
                    expectedMinutes: service.expectedMinutes,
                }),
            );
        }
        // TODO: publicar el evento AgreementActivated
    }

    // Comprueba que las condiciones tienen sentido para estas dos personas
    private validateTerms(terms: AgreementTermsDto, providerId: number, receiverId: number): void {
        const participants = [providerId, receiverId];

        for (const s of terms.services) {
            if (!participants.includes(s.performerId) || !participants.includes(s.recipientId)) {
                throw new BadRequestException('Services must be between the two participants');
            }
            if (s.performerId === s.recipientId) {
                throw new BadRequestException('A service needs a different performer and recipient');
            }
        }

        if (terms.exchangeMode === ExchangeMode.TIME_CREDITS) {
            const service = terms.services[0];
            if (terms.services.length !== 1 || !service) {
                throw new BadRequestException('timeCredits needs exactly 1 service');
            }
            if (service.performerId !== providerId || service.recipientId !== receiverId) {
                throw new BadRequestException('With timeCredits, the provider of the listing performs the service');
            }
        } else {
            const performers = new Set(terms.services.map((s) => s.performerId));
            if (terms.services.length !== 2 || performers.size !== 2) {
                throw new BadRequestException('directSwap needs one service from each participant');
            }
        }

        for (const e of terms.expenses ?? []) {
            if (!participants.includes(e.responsibleId)) {
                throw new BadRequestException('The person responsible for an expense must be a participant');
            }
        }

        // TODO (ANU-03): cuando el anuncio indique qué compensación admite,
        // comprobar aquí que exchangeMode es uno de los permitidos.
    }

    // Monta la respuesta completa: acuerdo, versiones y quién ha aceptado la vigente
    private async getOutput(id: number): Promise<AgreementOutputDto> {
        const em = this.dataSource.manager;
        const agreement = await em.findOne(Agreement, {
            where: { id },
            relations: { conversation: true, listing: true, provider: true, receiver: true },
        });
        if (!agreement) throw new NotFoundException('Agreement not found');

        const versions = await em.find(AgreementVersion, {
            where: { agreement: { id } },
            relations: { proposedBy: true },
            order: { version: 'ASC' },
        });
        const acceptances = await em.find(AgreementAcceptance, {
            where: { agreement: { id }, version: agreement.currentVersion },
            relations: { user: true },
        });

        return {
            id: agreement.id,
            conversationId: agreement.conversation.id,
            listingId: agreement.listing.id,
            providerId: agreement.provider.id,
            receiverId: agreement.receiver.id,
            status: agreement.status,
            currentVersion: agreement.currentVersion,
            acceptedByUserIds: acceptances.map((a) => a.user.id),
            versions: versions.map(
                (v): AgreementVersionOutputDto => ({
                    version: v.version,
                    exchangeMode: v.exchangeMode,
                    services: v.services,
                    modality: v.modality,
                    locationOrChannel: v.locationOrChannel ?? null,
                    startDateTime: v.startDateTime ?? null,
                    expenses: v.expenses,
                    cancellationTerms: v.cancellationTerms,
                    proposedById: v.proposedBy.id,
                    createdAt: v.createdAt,
                }),
            ),
            createdAt: agreement.createdAt,
        };
    }
}