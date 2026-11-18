import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Conversation } from '../../conversation/entities/conversation.entity';
import { ListingKind } from '../../listing/enums/listing-kind.enum';
import { AgreementService } from '../agreement.service';
import { ProposeAgreementDto } from '../dto/propose-agreement.dto';
import { AgreementAcceptance } from '../entities/agreement-acceptance.entity';
import { AgreementVersion } from '../entities/agreement-version.entity';
import { Agreement } from '../entities/agreement.entity';
import { Exchange } from '../entities/exchange.entity';
import { Obligation } from '../entities/obligation.entity';
import { AgreementModality } from '../enums/agreement-modality.enum';
import { AgreementStatus } from '../enums/agreement-status.enum';
import { ExchangeMode } from '../enums/exchange-mode.enum';

// Personas de ejemplo
const ana = { id: 1 } as any; // dueña del anuncio
const beto = { id: 2 } as any; // quien contacta
const carla = { id: 3 } as any; // una extraña

const conversationOffer = () => ({
    id: 100,
    listing: { id: 10, kind: ListingKind.OFFER },
    requester: { id: 2 },
    owner: { id: 1 },
});

// Un acuerdo con todas sus relaciones, tal como lo devolvería la base de datos
const agreementFixture = (status: AgreementStatus, currentVersion = 1) => ({
    id: 5,
    status,
    currentVersion,
    conversation: { id: 100 },
    listing: { id: 10 },
    provider: { id: 1 },
    receiver: { id: 2 },
    createdAt: new Date(),
});

const creditsService = {
    performerId: 1,
    recipientId: 2,
    description: 'Clases de guitarra',
    expectedMinutes: 60,
};

const versionFixture = (services: unknown[] = [creditsService], exchangeMode = ExchangeMode.TIME_CREDITS) => ({
    version: 1,
    exchangeMode,
    services,
    modality: AgreementModality.REMOTE,
    locationOrChannel: null,
    startDateTime: null,
    expenses: [],
    cancellationTerms: 'Avisar 24 horas antes',
    proposedBy: { id: 2 },
    createdAt: new Date(),
});

const creditsTerms = (): ProposeAgreementDto =>
    ({
        conversationId: 100,
        exchangeMode: ExchangeMode.TIME_CREDITS,
        services: [creditsService],
        modality: AgreementModality.REMOTE,
        cancellationTerms: 'Avisar 24 horas antes',
    }) as ProposeAgreementDto;

describe('AgreementService', () => {
    let service: AgreementService;
    let manager: Record<string, jest.Mock>;
    let dataSource: { manager: Record<string, jest.Mock>; transaction: jest.Mock };

    // Dice qué devuelve findOne para cada tabla. Si es una lista, devuelve un valor por llamada.
    function setFindOne(results: Map<unknown, unknown>) {
        manager.findOne.mockImplementation(async (entity: unknown) => {
            const value = results.get(entity);
            if (Array.isArray(value)) return value.length > 1 ? value.shift() : value[0];
            return value ?? null;
        });
    }

    // Cuántas veces se ha creado algo de esa tabla
    const createdOf = (entity: unknown) =>
        manager.create.mock.calls.filter((call: unknown[]) => call[0] === entity);

    beforeEach(async () => {
        manager = {
            findOne: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
            save: jest.fn(async (x: object) => ({ id: 5, ...x })),
            create: jest.fn((_entity: unknown, x: object) => x),
            update: jest.fn(),
        };
        // Por defecto: una versión guardada y ninguna aceptación
        manager.find.mockImplementation(async (entity: unknown) =>
            entity === AgreementVersion ? [versionFixture()] : [],
        );
        // La transacción ejecuta su contenido con el mismo gestor falso
        dataSource = {
            manager,
            transaction: jest.fn((callback: (m: unknown) => unknown) => callback(manager)),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [AgreementService, { provide: DataSource, useValue: dataSource }],
        }).compile();

        service = module.get(AgreementService);
    });

    describe('propose', () => {
        it('da 404 si no participas en la conversación', async () => {
            setFindOne(new Map([[Conversation, null]]));
            await expect(service.propose(creditsTerms(), carla)).rejects.toThrow(NotFoundException);
        });

        it('da 400 si con créditos no presta quien marca el anuncio', async () => {
            setFindOne(new Map<unknown, unknown>([[Conversation, conversationOffer()]]));
            const dto = creditsTerms();
            // En una oferta presta Ana (1); aquí se intenta que preste Beto (2)
            dto.services = [{ ...creditsService, performerId: 2, recipientId: 1 }];
            await expect(service.propose(dto, beto)).rejects.toThrow(BadRequestException);
        });

        it('da 409 si la conversación ya tiene un acuerdo abierto', async () => {
            setFindOne(
                new Map<unknown, unknown>([
                    [Conversation, conversationOffer()],
                    [Agreement, agreementFixture(AgreementStatus.PROPOSED)],
                ]),
            );
            await expect(service.propose(creditsTerms(), beto)).rejects.toThrow(ConflictException);
        });

        it('crea el acuerdo (oferta: presta el autor) y la aceptación de quien propone', async () => {
            setFindOne(
                new Map<unknown, unknown>([
                    [Conversation, conversationOffer()],
                    // 1ª llamada: ¿hay uno abierto? No. 2ª: la respuesta final.
                    [Agreement, [null, agreementFixture(AgreementStatus.PROPOSED)]],
                ]),
            );

            const result = await service.propose(creditsTerms(), beto);

            expect(createdOf(Agreement)[0]?.[1]).toEqual(
                expect.objectContaining({
                    provider: { id: 1 },
                    receiver: { id: 2 },
                    currentVersion: 1,
                    status: AgreementStatus.PROPOSED,
                }),
            );
            expect(createdOf(AgreementAcceptance)[0]?.[1]).toEqual(
                expect.objectContaining({ version: 1, user: { id: 2 } }),
            );
            expect(result.status).toBe(AgreementStatus.PROPOSED);
        });

        it('en una petición presta quien contacta', async () => {
            setFindOne(
                new Map<unknown, unknown>([
                    [
                        Conversation,
                        { ...conversationOffer(), listing: { id: 10, kind: ListingKind.REQUEST } },
                    ],
                    [Agreement, [null, agreementFixture(AgreementStatus.PROPOSED)]],
                ]),
            );
            const dto = creditsTerms();
            dto.services = [{ ...creditsService, performerId: 2, recipientId: 1 }];

            await service.propose(dto, beto);

            expect(createdOf(Agreement)[0]?.[1]).toEqual(
                expect.objectContaining({ provider: { id: 2 }, receiver: { id: 1 } }),
            );
        });
    });

    describe('counter', () => {
        it('da 404 a una persona ajena', async () => {
            setFindOne(new Map([[Agreement, agreementFixture(AgreementStatus.PROPOSED)]]));
            await expect(service.counter(5, creditsTerms(), carla)).rejects.toThrow(NotFoundException);
        });

        it('da 409 si el acuerdo ya está activo', async () => {
            setFindOne(new Map([[Agreement, agreementFixture(AgreementStatus.ACTIVE)]]));
            await expect(service.counter(5, creditsTerms(), ana)).rejects.toThrow(ConflictException);
        });

        it('crea la versión 2 y la deja como vigente', async () => {
            setFindOne(new Map([[Agreement, agreementFixture(AgreementStatus.PROPOSED, 1)]]));

            await service.counter(5, creditsTerms(), ana);

            expect(createdOf(AgreementVersion)[0]?.[1]).toEqual(
                expect.objectContaining({ version: 2, proposedBy: { id: 1 } }),
            );
            expect(manager.update).toHaveBeenCalledWith(Agreement, { id: 5 }, { currentVersion: 2 });
        });
    });

    describe('accept', () => {
        it('da 409 si la versión ya no es la vigente', async () => {
            setFindOne(new Map([[Agreement, agreementFixture(AgreementStatus.PROPOSED, 2)]]));
            await expect(service.accept(5, { version: 1 }, ana)).rejects.toThrow(ConflictException);
            expect(createdOf(AgreementAcceptance)).toHaveLength(0);
        });

        it('dos aceptaciones sobre versiones distintas: solo cuenta la vigente', async () => {
            // Ana lee la versión 1, pero cuando consigue el bloqueo Beto ya había
            // creado la versión 2. Al releer tras el bloqueo, su aceptación es obsoleta.
            setFindOne(
                new Map<unknown, unknown>([
                    [
                        Agreement,
                        [
                            agreementFixture(AgreementStatus.PROPOSED, 1), // lectura previa
                            agreementFixture(AgreementStatus.PROPOSED, 2), // tras el bloqueo
                        ],
                    ],
                ]),
            );

            await expect(service.accept(5, { version: 1 }, ana)).rejects.toThrow('Version is outdated');
            expect(createdOf(AgreementAcceptance)).toHaveLength(0);
            expect(manager.update).not.toHaveBeenCalled();
        });

        it('da 409 si ya habías aceptado esa versión', async () => {
            setFindOne(
                new Map<unknown, unknown>([
                    [Agreement, agreementFixture(AgreementStatus.PROPOSED, 1)],
                    [AgreementAcceptance, { id: 1 }],
                ]),
            );
            await expect(service.accept(5, { version: 1 }, ana)).rejects.toThrow(ConflictException);
        });

        it('con una sola aceptación no se activa', async () => {
            setFindOne(new Map([[Agreement, agreementFixture(AgreementStatus.PROPOSED, 1)]]));
            manager.count.mockResolvedValue(1);

            await service.accept(5, { version: 1 }, ana);

            expect(createdOf(AgreementAcceptance)).toHaveLength(1);
            expect(createdOf(Exchange)).toHaveLength(0);
            expect(manager.update).not.toHaveBeenCalled();
        });

        it('con las dos aceptaciones se activa y crea el intercambio con 1 prestación (créditos)', async () => {
            setFindOne(
                new Map<unknown, unknown>([
                    [Agreement, agreementFixture(AgreementStatus.PROPOSED, 1)],
                    [AgreementVersion, versionFixture()],
                ]),
            );
            manager.count.mockResolvedValue(2);

            await service.accept(5, { version: 1 }, ana);

            expect(manager.update).toHaveBeenCalledWith(Agreement, { id: 5 }, { status: AgreementStatus.ACTIVE });
            expect(createdOf(Exchange)).toHaveLength(1);
            expect(createdOf(Obligation)).toHaveLength(1);
        });

        it('en un trueque se crean 2 prestaciones', async () => {
            const swapServices = [
                creditsService,
                { performerId: 2, recipientId: 1, description: 'Clases de inglés', expectedMinutes: 60 },
            ];
            setFindOne(
                new Map<unknown, unknown>([
                    [Agreement, agreementFixture(AgreementStatus.PROPOSED, 1)],
                    [AgreementVersion, versionFixture(swapServices, ExchangeMode.DIRECT_SWAP)],
                ]),
            );
            manager.count.mockResolvedValue(2);

            await service.accept(5, { version: 1 }, ana);

            expect(createdOf(Obligation)).toHaveLength(2);
        });
    });

    describe('cancel', () => {
        it('da 409 si el acuerdo ya está activo', async () => {
            setFindOne(new Map([[Agreement, agreementFixture(AgreementStatus.ACTIVE)]]));
            await expect(service.cancel(5, ana)).rejects.toThrow(ConflictException);
        });

        it('cancela un acuerdo pendiente', async () => {
            setFindOne(new Map([[Agreement, agreementFixture(AgreementStatus.PROPOSED)]]));
            await service.cancel(5, ana);
            expect(manager.update).toHaveBeenCalledWith(Agreement, { id: 5 }, { status: AgreementStatus.CANCELLED });
        });
    });

    describe('findOne', () => {
        it('da 404 a una persona ajena', async () => {
            setFindOne(new Map([[Agreement, agreementFixture(AgreementStatus.PROPOSED)]]));
            await expect(service.findOne(5, carla)).rejects.toThrow(NotFoundException);
        });

        it('un participante ve el acuerdo y quién ha aceptado', async () => {
            setFindOne(new Map([[Agreement, agreementFixture(AgreementStatus.PROPOSED)]]));
            manager.find.mockImplementation(async (entity: unknown) =>
                entity === AgreementVersion ? [versionFixture()] : [{ user: { id: 2 } }],
            );

            const result = await service.findOne(5, ana);

            expect(result.id).toBe(5);
            expect(result.acceptedByUserIds).toEqual([2]);
            expect(result.versions).toHaveLength(1);
        });
    });
});