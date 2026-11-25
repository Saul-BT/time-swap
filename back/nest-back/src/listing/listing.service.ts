import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { CreateListingDTO } from "../listing/dto/create-listing.dto";
import { SearchListingDTO } from "../listing/dto/search-listing.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Listing } from "../listing/entities/listing.entity";
import { LessThan, Repository } from "typeorm";
import { ErrorManager } from "src/common/error-handling/error.manager";
import { Role } from "src/common/enums/role.enum";
import { UserService } from "src/user/user.service";
import { UpdateListingDTO } from "../listing/dto/update-listing.dto";
import { CategoryService } from "src/category/category.service";
import { ListingOutputDto } from "./dto-outputs/listing.output.dto";
import { ListingStatus } from "./enums/listing-status.enum";
import { PaginatedResponse } from "src/common/dtos/paginated-output.dto";
import { MineListingDTO } from "./dto/mine-listing.dto";
import { RenewListingDTO } from "./dto/renew-listing.dto";
import { canTransition } from "./listing-transitions";


@Injectable()
export class ListingService {
    private readonly logger = new Logger(ListingService.name);

    constructor (
        @InjectRepository(Listing)
        private readonly listingRepository: Repository<Listing>,
        @Inject(CategoryService)
        private readonly categoryService: CategoryService,
        @Inject(UserService)
        private readonly userService: UserService,
    ) {}

    mapListingOutput (listing: Listing): ListingOutputDto {
        return {
            id: listing.id,
            title: listing.title,
            summary: listing.description,
            kind: listing.kind,
            mode: listing.mode,
            byline: `${listing.author.name} · ${listing.location ?? listing.category.name}`,
            hours: listing.duration,
            authorId: listing.author.id,
            authorName: listing.author.name ?? '',
            categoryId: listing.category.id,
            categoryName: listing.category.name,
            status: listing.status,
            expiresAt: listing.expiresAt ?? null,
            createdAt: listing.createdAt
        }
    }

    // ---------- Ayudantes privados ----------

    // Los anuncios activos cuya fecha límite ya pasó se marcan como caducados.
    // Se llama justo antes de listar o de cambiar de estado, así no hace falta ningún proceso programado.
    private async expireOverdue(): Promise<void> {
        await this.listingRepository.update(
            { status: ListingStatus.ACTIVE, expiresAt: LessThan(new Date()) },
            { status: ListingStatus.EXPIRED },
        );
    }

    // Convierte el texto de fecha en fecha y comprueba que es futura
    private parseExpiresAt(value?: string): Date | null {
        if (!value) return null;
        const date = new Date(value);
        if (date <= new Date()) {
            throw new ErrorManager('BAD_REQUEST', 'expiresAt must be in the future');
        }
        return date;
    }

    // Busca el anuncio y comprueba que quien pregunta es su autor (o superadmin)
    private async getOwned(user: UserActiveInterface, id: number): Promise<Listing> {
        const listing = await this.listingRepository.findOne({
            where: { id },
            relations: { category: true, author: true }
        });

        if (!listing) {
            throw new ErrorManager('NOT_FOUND', 'Listing not found');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== listing.author.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to modify listing');
        }

        return listing;
    }

    // Cambia el estado solo si la tabla de transiciones lo permite
    private async applyStatus(listing: Listing, to: ListingStatus): Promise<ListingOutputDto> {
        if (!canTransition(listing.status, to)) {
            throw new ErrorManager('CONFLICT', `A listing cannot go from ${listing.status} to ${to}`);
        }
        listing.status = to;
        if (to === ListingStatus.REMOVED) {
            listing.cancelledTime = new Date();
        }
        return this.mapListingOutput(await this.listingRepository.save(listing));
    }

    // ---------- Crear, editar, consultar ----------

    async create(user: UserActiveInterface, createDto: CreateListingDTO) {
        const listing = this.listingRepository.create();

        const userEntity = await this.userService.findAllData(user.mail);
        if (!userEntity) {
            throw new ErrorManager('NOT_FOUND', 'User not found');
        }
        listing.author = userEntity;

        const category = await this.categoryService.getCategory(createDto.categoryId);
        listing.category = category; //cascade save

        //string to datetime needs separate logic
        /*listing.startDateTime = new Date(createDto.startTime);

        const minimumStartTime = new Date;
        if (listing.startDateTime < minimumStartTime) {
            throw new ErrorManager('CONFLICT', 'startTime cannot be in the past');
        }*/

        //the rest can be copied as is, except the fields that need their own logic
        const { categoryId: _categoryId, expiresAt, ...rest } = createDto;
        Object.assign(listing, rest);
        listing.expiresAt = this.parseExpiresAt(expiresAt);

        //todo if location is absent from any type other than remote, reject

        return this.mapListingOutput(await this.listingRepository.save(listing));
    }
        
    async update(user: UserActiveInterface, id: number, updateDto: UpdateListingDTO) {
        //all properties in dto are optional, need to check its not empty first
        if (!Object.values(updateDto).some(value => value !== undefined)) {
            throw new ErrorManager('BAD_REQUEST', 'Empty DTO');
        }

        await this.expireOverdue();

        const listing = await this.listingRepository.findOne({
            where: { id },
            relations: { category: true, author: true } //todo get revisions as well
        })

        if (!listing) {
            throw new ErrorManager('NOT_FOUND', 'Listing not found');
        }

        // Solo se edita un anuncio activo o pausado
        if (listing.status !== ListingStatus.ACTIVE && listing.status !== ListingStatus.PAUSED) {
            throw new ErrorManager('FORBIDDEN', 'Listing cannot be edited in its current status');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== listing.author.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to modify listing');
        }

        //entity relation needs separate logic
        if (updateDto.categoryId && listing.category.id !== updateDto.categoryId) {
            const category = await this.categoryService.getCategory(updateDto.categoryId);
            listing.category = category; //cascade save
        }

        //string to datetime needs separate logic
        /*if (updateDto.startTime) {
            listing.startDateTime = new Date(updateDto.startTime);

            const minimumStartTime = new Date;
            if (listing.startDateTime < minimumStartTime) {
                throw new ErrorManager('CONFLICT', 'startTime cannot be in the past');
            }
        }*/

        //the rest can be copied as is, except the fields that need their own logic
        const { categoryId: _categoryId, expiresAt, ...rest } = updateDto;
        Object.assign(listing, rest);
        if (expiresAt) {
            listing.expiresAt = this.parseExpiresAt(expiresAt);
        }

        return this.mapListingOutput(await this.listingRepository.save(listing));
    }

    async getById(id: number): Promise<ListingOutputDto> {
        const listing = await this.listingRepository.findOne({
            where: { id },
            relations: { category:true, author: true } //todo get revisions as well
        })

        if (!listing) {
            throw new ErrorManager('NOT_FOUND', 'Listing not found');
        }

        return this.mapListingOutput(listing);
    }

    // Mis anuncios: solo los del usuario, con filtro opcional por estado
    async mine(user: UserActiveInterface, dto: MineListingDTO): Promise<PaginatedResponse<ListingOutputDto>> {
        await this.expireOverdue();

        const page = dto.page ?? 1;
        const pageSize = dto.pageSize ?? 20;

        const [list, total] = await this.listingRepository.findAndCount({
            where: {
                author: { id: user.id },
                ...(dto.status ? { status: dto.status } : {}),
            },
            relations: { category: true, author: true },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            list: list.map(listing => this.mapListingOutput(listing)),
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async search(searchDto: SearchListingDTO): Promise<PaginatedResponse<ListingOutputDto>> {
        await this.expireOverdue();

        const query = this.listingRepository.createQueryBuilder('listing');

        if (searchDto.title) {
            query.andWhere(
                'listing.title ILIKE :title',
                { title: `%${searchDto.title}%` },
            );
        }

        if (searchDto.description) {
            query.andWhere(
                'listing.description ILIKE :description',
                { description: `%${searchDto.description}%` },
            );
        }

        if (searchDto.kind) {
            query.andWhere(
                'listing.kind = :kind',
                { kind: searchDto.kind },
            );
        }

        if (searchDto.mode) {
            query.andWhere(
                'listing.mode = :mode',
                { mode: searchDto.mode },
            );
        }

        // Si no se pide otro estado, el listado público solo enseña anuncios activos
        query.andWhere(
            'listing.status = :status',
            { status: searchDto.status ?? ListingStatus.ACTIVE },
        );

        if (searchDto.duration) {
            query.andWhere(
                'listing.description ILIKE :duration',
                { description: `%${searchDto.duration}%` },
            );
        }

        if (searchDto.lowerStartTime) {
            query.andWhere(
                'listing.startTime >= :lowerStartTime',
                { lowerStartTime: searchDto.lowerStartTime },
            );
        }

        if (searchDto.higherStartTime) {
            query.andWhere(
                'listing.startTime <= :higherStartTime',
                { higherStartTime: searchDto.higherStartTime },
            );
        }

        if (searchDto.categoryIds?.length) {
            query.leftJoinAndSelect('listing.category', 'category')
                .andWhere(
                    'category.id IN (:...categoryIds)',
                    { categoryIds: searchDto.categoryIds },
                );
        }

        else {
            query.leftJoinAndSelect('listing.category', 'category');
        }

        query.leftJoinAndSelect('listing.author', 'user');

        if (!searchDto.page)
            searchDto.page = 1;
        if (!searchDto.pageSize)
            searchDto.pageSize = 20;

        query.skip((searchDto.page - 1) * searchDto.pageSize);
        query.take(searchDto.pageSize);

        const result = await query.getManyAndCount();

        return {
            list: result[0].map(listing => { return this.mapListingOutput(listing)}),
            page: searchDto.page,
            pageSize: searchDto.pageSize,
            total: result[1],
            totalPages: Math.ceil(result[1] / searchDto.pageSize),
        };
    }

    // ---------- Cambios de estado ----------

    // active -> paused
    async pause(user: UserActiveInterface, id: number): Promise<ListingOutputDto> {
        await this.expireOverdue();
        const listing = await this.getOwned(user, id);
        return this.applyStatus(listing, ListingStatus.PAUSED);
    }

    // paused -> active (si ya venció la fecha, hay que renovar)
    async resume(user: UserActiveInterface, id: number): Promise<ListingOutputDto> {
        await this.expireOverdue();
        const listing = await this.getOwned(user, id);
        if (listing.expiresAt && listing.expiresAt < new Date()) {
            throw new ErrorManager('CONFLICT', 'Listing has expired, renew it instead');
        }
        return this.applyStatus(listing, ListingStatus.ACTIVE);
    }

    // expired -> active, con una nueva fecha límite
    async renew(user: UserActiveInterface, id: number, dto: RenewListingDTO): Promise<ListingOutputDto> {
        await this.expireOverdue();
        const listing = await this.getOwned(user, id);
        if (listing.status !== ListingStatus.EXPIRED) {
            throw new ErrorManager('CONFLICT', 'Only expired listings can be renewed');
        }
        listing.expiresAt = this.parseExpiresAt(dto.expiresAt);
        return this.applyStatus(listing, ListingStatus.ACTIVE);
    }

    // cualquier estado permitido -> removed. No cancela acuerdos ya formalizados.
    async withdraw(user: UserActiveInterface, id: number): Promise<ListingOutputDto> {
        const listing = await this.getOwned(user, id);
        return this.applyStatus(listing, ListingStatus.REMOVED);
    }

    async remove(user:UserActiveInterface, id: number) {
        const listing = await this.listingRepository.findOne({
            where: { id },
            relations: { author: true }
        })

        if (!listing) {
            throw new ErrorManager('NOT_FOUND', 'Listing not found');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== listing.author.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to delete listing');
        }

        return this.listingRepository.remove(listing);
    }
}