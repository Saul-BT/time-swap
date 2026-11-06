import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { CreateListingDTO } from "../listing/dto/create-listing.dto";
import { SearchListingDTO } from "../listing/dto/search-listing.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Listing } from "../listing/entities/listing.entity";
import { Repository } from "typeorm";
import { ErrorManager } from "src/common/error-handling/error.manager";
import { Role } from "src/common/enums/role.enum";
import { UserService } from "src/user/user.service";
import { UpdateListingDTO } from "../listing/dto/update-listing.dto";
import { CategoryService } from "src/category/category.service";
import { ListingOutputDto } from "./dto-outputs/listing.output.dto";
import { ListingStatus } from "./enums/listing-status.enum";
import { PaginatedResponse } from "src/common/dtos/paginated-output.dto";


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
            createdAt: listing.createdAt
        }
    }

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

        //the rest can be copied as is
        Object.assign(listing, {
            ...createDto,
            startTime: undefined,
            categoryId: undefined
        });

        //todo if location is absent from any type other than remote, reject

        return this.mapListingOutput(await this.listingRepository.save(listing));
    }
        
    async update(user: UserActiveInterface, id: number, updateDto: UpdateListingDTO) {
        //all properties in dto are optional, need to check its not empty first
        if (!Object.values(updateDto).some(value => value !== undefined)) {
            throw new ErrorManager('BAD_REQUEST', 'Empty DTO');
        }

        const listing = await this.listingRepository.findOne({
            where: { id },
            relations: { category: true, author: true } //todo get revisions as well
        })

        if (!listing) {
            throw new ErrorManager('NOT_FOUND', 'Listing not found');
        }

        if (listing.status !== ListingStatus.ACTIVE) {
            throw new ErrorManager('FORBIDDEN', 'Listing is not active');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== listing.author.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to delete listing');
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

        //the rest can be copied as is
        Object.assign(listing, {
            ...updateDto,
            startTime: undefined,
            categoryId: undefined
        });

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

    async search(searchDto: SearchListingDTO): Promise<PaginatedResponse<ListingOutputDto>> {
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
                { type: searchDto.kind },
            );
        }

        if (searchDto.mode) {
            query.andWhere(
                'listing.mode = :mode',
                { mode: searchDto.mode },
            );
        }

        if (searchDto.status) {
            //todo search by status
        }

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

    async complete(user:UserActiveInterface, id: number) {
        const listing = await this.listingRepository.findOne({
            where: { id },
            relations: { author: true }
        })

        if (!listing) {
            throw new ErrorManager('NOT_FOUND', 'Listing not found');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== listing.author.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to modify listing');
        }

        if (listing.status !== ListingStatus.ACTIVE) {
            throw new ErrorManager('FORBIDDEN', 'Listing is not active');
        }

        listing.status = ListingStatus.COMPLETED;
        listing.completedTime = new Date();

        return this.listingRepository.save(listing);
    }

    async cancel(user:UserActiveInterface, id: number) {
        const listing = await this.listingRepository.findOne({
            where: { id },
            relations: { author: true }
        })

        if (!listing) {
            throw new ErrorManager('NOT_FOUND', 'Listing not found');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== listing.author.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to modify listing');
        }

        if (listing.status !== ListingStatus.ACTIVE) {
            throw new ErrorManager('FORBIDDEN', 'Listing is not active');
        }

        listing.status = ListingStatus.WITHDRAWN;
        listing.cancelledTime = new Date();

        return this.listingRepository.save(listing);
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

        //only allow superadmin to delete logs
        if (user.role !== Role.SUPER_ADMIN && listing.status === ListingStatus.COMPLETED) {
            throw new ErrorManager('FORBIDDEN', 'Completed listings cannot be deleted');
        }

        return this.listingRepository.remove(listing);
    }
}