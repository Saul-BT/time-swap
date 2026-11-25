import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from 'src/common/enums/role.enum';
import { CategoryService } from 'src/category/category.service';
import { UserService } from 'src/user/user.service';
import { Listing } from '../entities/listing.entity';
import { ListingStatus } from '../enums/listing-status.enum';
import { canTransition } from '../listing-transitions';
import { ListingService } from '../listing.service';

// Servicios ajenos que aquí no hacen falta: los sustituimos por clases vacías
jest.mock('src/user/user.service', () => ({ UserService: class UserService {} }));
jest.mock('src/category/category.service', () => ({ CategoryService: class CategoryService {} }));

const ana = { id: 1, role: Role.USER } as any; // autora
const beto = { id: 2, role: Role.USER } as any; // otra persona

const futureDate = () => new Date(Date.now() + 24 * 60 * 60 * 1000);
const pastDate = () => new Date(Date.now() - 24 * 60 * 60 * 1000);

const listingFixture = (over: Record<string, unknown> = {}) => ({
    id: 1,
    title: 'Clases de guitarra',
    description: 'Clases para empezar',
    kind: 'offer',
    mode: 'remote',
    duration: '1 h',
    location: null,
    status: ListingStatus.ACTIVE,
    expiresAt: null,
    createdAt: new Date(),
    author: { id: 1, name: 'Ana' },
    category: { id: 1, name: 'Música' },
    ...over,
});

describe('canTransition', () => {
    it('permite las transiciones del dominio', () => {
        expect(canTransition(ListingStatus.ACTIVE, ListingStatus.PAUSED)).toBe(true);
        expect(canTransition(ListingStatus.PAUSED, ListingStatus.ACTIVE)).toBe(true);
        expect(canTransition(ListingStatus.ACTIVE, ListingStatus.EXPIRED)).toBe(true);
        expect(canTransition(ListingStatus.EXPIRED, ListingStatus.ACTIVE)).toBe(true);
        expect(canTransition(ListingStatus.DRAFT, ListingStatus.ACTIVE)).toBe(true);
    });

    it('se puede retirar desde cualquier estado menos desde retirado o moderación', () => {
        expect(canTransition(ListingStatus.DRAFT, ListingStatus.REMOVED)).toBe(true);
        expect(canTransition(ListingStatus.ACTIVE, ListingStatus.REMOVED)).toBe(true);
        expect(canTransition(ListingStatus.PAUSED, ListingStatus.REMOVED)).toBe(true);
        expect(canTransition(ListingStatus.EXPIRED, ListingStatus.REMOVED)).toBe(true);
        expect(canTransition(ListingStatus.REMOVED, ListingStatus.REMOVED)).toBe(false);
        expect(canTransition(ListingStatus.MODERATION_HOLD, ListingStatus.REMOVED)).toBe(false);
    });

    it('rechaza las transiciones que no existen', () => {
        expect(canTransition(ListingStatus.REMOVED, ListingStatus.ACTIVE)).toBe(false);
        expect(canTransition(ListingStatus.ACTIVE, ListingStatus.DRAFT)).toBe(false);
        expect(canTransition(ListingStatus.EXPIRED, ListingStatus.PAUSED)).toBe(false);
    });
});

describe('ListingService', () => {
    let service: ListingService;
    let repo: Record<string, jest.Mock>;

    beforeEach(async () => {
        repo = {
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            save: jest.fn(async (x: object) => x),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ListingService,
                { provide: getRepositoryToken(Listing), useValue: repo },
                { provide: CategoryService, useValue: {} },
                { provide: UserService, useValue: {} },
            ],
        }).compile();

        service = module.get(ListingService);
    });

    describe('pause', () => {
        it('pausa un anuncio activo de su autor y antes caduca los vencidos', async () => {
            repo.findOne.mockResolvedValue(listingFixture());
            const result = await service.pause(ana, 1);
            expect(result.status).toBe(ListingStatus.PAUSED);
            expect(repo.update).toHaveBeenCalled();
        });

        it('da FORBIDDEN si no eres el autor', async () => {
            repo.findOne.mockResolvedValue(listingFixture());
            await expect(service.pause(beto, 1)).rejects.toMatchObject({ type: 'FORBIDDEN' });
            expect(repo.save).not.toHaveBeenCalled();
        });

        it('da NOT_FOUND si no existe', async () => {
            repo.findOne.mockResolvedValue(null);
            await expect(service.pause(ana, 99)).rejects.toMatchObject({ type: 'NOT_FOUND' });
        });

        it('da CONFLICT si el anuncio ya está caducado', async () => {
            repo.findOne.mockResolvedValue(listingFixture({ status: ListingStatus.EXPIRED }));
            await expect(service.pause(ana, 1)).rejects.toMatchObject({ type: 'CONFLICT' });
        });
    });

    describe('resume', () => {
        it('reactiva un anuncio pausado', async () => {
            repo.findOne.mockResolvedValue(listingFixture({ status: ListingStatus.PAUSED }));
            const result = await service.resume(ana, 1);
            expect(result.status).toBe(ListingStatus.ACTIVE);
        });

        it('da CONFLICT si la fecha límite ya pasó: hay que renovar', async () => {
            repo.findOne.mockResolvedValue(
                listingFixture({ status: ListingStatus.PAUSED, expiresAt: pastDate() }),
            );
            await expect(service.resume(ana, 1)).rejects.toMatchObject({ type: 'CONFLICT' });
        });
    });

    describe('renew', () => {
        it('da CONFLICT si el anuncio no está caducado', async () => {
            repo.findOne.mockResolvedValue(listingFixture());
            await expect(
                service.renew(ana, 1, { expiresAt: futureDate().toISOString() }),
            ).rejects.toMatchObject({ type: 'CONFLICT' });
        });

        it('da BAD_REQUEST si la nueva fecha ya pasó', async () => {
            repo.findOne.mockResolvedValue(listingFixture({ status: ListingStatus.EXPIRED }));
            await expect(
                service.renew(ana, 1, { expiresAt: pastDate().toISOString() }),
            ).rejects.toMatchObject({ type: 'BAD_REQUEST' });
        });

        it('renueva un anuncio caducado con una fecha futura', async () => {
            repo.findOne.mockResolvedValue(
                listingFixture({ status: ListingStatus.EXPIRED, expiresAt: pastDate() }),
            );
            const result = await service.renew(ana, 1, { expiresAt: futureDate().toISOString() });
            expect(result.status).toBe(ListingStatus.ACTIVE);
            expect(result.expiresAt && result.expiresAt > new Date()).toBe(true);
        });
    });

    describe('withdraw', () => {
        it('retira un anuncio activo y anota la fecha', async () => {
            const listing = listingFixture();
            repo.findOne.mockResolvedValue(listing);
            const result = await service.withdraw(ana, 1);
            expect(result.status).toBe(ListingStatus.REMOVED);
            expect((listing as any).cancelledTime).toBeInstanceOf(Date);
        });

        it('da CONFLICT si ya estaba retirado', async () => {
            repo.findOne.mockResolvedValue(listingFixture({ status: ListingStatus.REMOVED }));
            await expect(service.withdraw(ana, 1)).rejects.toMatchObject({ type: 'CONFLICT' });
        });

        it('da FORBIDDEN si no eres el autor', async () => {
            repo.findOne.mockResolvedValue(listingFixture());
            await expect(service.withdraw(beto, 1)).rejects.toMatchObject({ type: 'FORBIDDEN' });
        });
    });

    describe('mine', () => {
        it('devuelve solo mis anuncios, filtrados por estado y paginados', async () => {
            repo.findAndCount.mockResolvedValue([[listingFixture({ status: ListingStatus.PAUSED })], 11]);

            const result = await service.mine(ana, { status: ListingStatus.PAUSED, page: 2, pageSize: 10 } as any);

            expect(repo.findAndCount).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { author: { id: 1 }, status: ListingStatus.PAUSED },
                    skip: 10,
                    take: 10,
                }),
            );
            expect(result.total).toBe(11);
            expect(result.totalPages).toBe(2);
            expect(result.list[0]?.authorId).toBe(1);
        });
    });

    describe('update', () => {
        it('no deja editar un anuncio retirado', async () => {
            repo.findOne.mockResolvedValue(listingFixture({ status: ListingStatus.REMOVED }));
            await expect(service.update(ana, 1, { title: 'Nuevo' } as any)).rejects.toMatchObject({
                type: 'FORBIDDEN',
            });
        });

        it('deja editar un anuncio pausado', async () => {
            repo.findOne.mockResolvedValue(listingFixture({ status: ListingStatus.PAUSED }));
            const result = await service.update(ana, 1, { title: 'Nuevo título' } as any);
            expect(result.title).toBe('Nuevo título');
            expect(repo.save).toHaveBeenCalled();
        });

        it('no deja editar el anuncio de otra persona', async () => {
            repo.findOne.mockResolvedValue(listingFixture());
            await expect(service.update(beto, 1, { title: 'Nuevo' } as any)).rejects.toMatchObject({
                type: 'FORBIDDEN',
            });
        });
    });
});