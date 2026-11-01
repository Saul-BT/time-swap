import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { CreateExchangeDTO } from "./dto/create-exchange.dto";
import { SearchExchangeDTO } from "./dto/search-exchange.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Exchange } from "./entities/exchange.entity";
import { Repository } from "typeorm";
import { ErrorManager } from "src/common/error-handling/error.manager";
import { Role } from "src/common/enums/role.enum";
import { UserService } from "src/user/user.service";
import { UpdateExchangeDTO } from "./dto/update-exchange.dto";
import { CategoryService } from "src/category/category.service";
import { ExchangeStatus } from "./enums/exchange-status.enum";
import ExchangeOutputDto from "./dto/exchange-output.dto";
import { PaginatedResponse } from "src/common/dtos/paginated-output.dto";


@Injectable()
export class ExchangeService {
    private readonly logger = new Logger(ExchangeService.name);

    constructor (
        @InjectRepository(Exchange)
        private readonly exchangeRepository: Repository<Exchange>,
        @Inject(CategoryService)
        private readonly categoryService: CategoryService,
        @Inject(UserService)
        private readonly userService: UserService,
    ) {}

    mapExchangeOutput (exchange: Exchange): ExchangeOutputDto {
        return {
            id: exchange.id,
            title: exchange.title,
            summary: exchange.description,
            kind: exchange.type,
            mode: exchange.mode,
            byline: `${exchange.owner.name} · ${exchange.location ?? exchange.category}`,
            hours: exchange.duration
        }
    }

    async createExchange(user: UserActiveInterface, createDto: CreateExchangeDTO) {
        const exchange = this.exchangeRepository.create();

        const userEntity = await this.userService.findAllData(user.mail);
        if (!userEntity) {
            throw new ErrorManager('NOT_FOUND', 'User not found');
        }
        exchange.owner = userEntity;

        const category = await this.categoryService.getCategory(createDto.categoryId);
        exchange.category = category; //cascade save

        //string to datetime needs separate logic
        exchange.startDateTime = new Date(createDto.startTime);

        const minimumStartTime = new Date;
        if (exchange.startDateTime < minimumStartTime) {
            throw new ErrorManager('CONFLICT', 'startTime cannot be in the past');
        }

        //the rest can be copied as is
        Object.assign(exchange, {
            ...createDto,
            startTime: undefined,
            categoryId: undefined
        });

        return this.exchangeRepository.save(exchange);
    }
        
    async updateExchange(user: UserActiveInterface, id: number, updateDto: UpdateExchangeDTO) {
        //all properties in dto are optional, need to check its not empty first
        if (!Object.values(updateDto).some(value => value !== undefined)) {
            throw new ErrorManager('BAD_REQUEST', 'Empty DTO');
        }

        const exchange = await this.exchangeRepository.findOne({
            where: { id },
            relations: { category: true, owner: true } //todo get revisions as well
        })

        if (!exchange) {
            throw new ErrorManager('NOT_FOUND', 'Exchange not found');
        }

        if (exchange.status !== ExchangeStatus.OPEN) {
            throw new ErrorManager('FORBIDDEN', 'Exchange is not active');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== exchange.owner.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to delete exchange');
        }

        //entity relation needs separate logic
        if (updateDto.categoryId && exchange.category.id !== updateDto.categoryId) {
            const category = await this.categoryService.getCategory(updateDto.categoryId);
            exchange.category = category; //cascade save
        }

        //string to datetime needs separate logic
        if (updateDto.startTime) {
            exchange.startDateTime = new Date(updateDto.startTime);

            const minimumStartTime = new Date;
            if (exchange.startDateTime < minimumStartTime) {
                throw new ErrorManager('CONFLICT', 'startTime cannot be in the past');
            }
        }

        //the rest can be copied as is
        Object.assign(exchange, {
            ...updateDto,
            startTime: undefined,
            categoryId: undefined
        });

        return this.exchangeRepository.save(exchange);
    }

    async getExchange(id: number): Promise<ExchangeOutputDto> {
        const exchange = await this.exchangeRepository.findOne({
            where: { id },
            relations: { category:true, owner: true } //todo get revisions as well
        })

        if (!exchange) {
            throw new ErrorManager('NOT_FOUND', 'Exchange not found');
        }

        return this.mapExchangeOutput(exchange);
    }
        
    async searchExchanges(searchDto: SearchExchangeDTO): Promise<PaginatedResponse<ExchangeOutputDto>> {
        const query = this.exchangeRepository.createQueryBuilder('exchange');

        if (searchDto.title) {
            query.andWhere(
                'exchange.title ILIKE :title',
                { title: `%${searchDto.title}%` },
            );
        }

        if (searchDto.description) {
            query.andWhere(
                'exchange.description ILIKE :description',
                { description: `%${searchDto.description}%` },
            );
        }

        if (searchDto.type) {
            query.andWhere(
                'exchange.type = :type',
                { type: searchDto.type },
            );
        }

        if (searchDto.mode) {
            query.andWhere(
                'exchange.mode = :mode',
                { mode: searchDto.mode },
            );
        }

        if (searchDto.status)
        //todo search by status

        if (searchDto.duration) {
            query.andWhere(
                'exchange.description ILIKE :duration',
                { description: `%${searchDto.duration}%` },
            );
        }

        if (searchDto.lowerStartTime) {
            query.andWhere(
                'exchange.startTime >= :lowerStartTime',
                { lowerStartTime: searchDto.lowerStartTime },
            );
        }

        if (searchDto.higherStartTime) {
            query.andWhere(
                'exchange.startTime <= :higherStartTime',
                { higherStartTime: searchDto.higherStartTime },
            );
        }

        if (searchDto.categoryIds?.length) {
            query.leftJoinAndSelect('exchange.category', 'category')
                .andWhere(
                    'category.id IN (:...categoryIds)',
                    { categoryIds: searchDto.categoryIds },
                );
       }

        query.leftJoinAndSelect('exchange.owner', 'user');

        if (!searchDto.page)
            searchDto.page = 1;
        if (!searchDto.pageSize)
            searchDto.pageSize = 20;

        query.skip((searchDto.page - 1) * searchDto.pageSize);
        query.take(searchDto.pageSize);

        const result = await query.getManyAndCount();

        return {
            list: result[0].map(exchange => { return this.mapExchangeOutput(exchange)}),
            page: searchDto.page,
            pageSize: searchDto.pageSize,
            total: result[1],
            totalPages: Math.ceil(result[1] / searchDto.pageSize),
        };
    }

    async completeExchange(user:UserActiveInterface, id: number) {
        const exchange = await this.exchangeRepository.findOne({
            where: { id },
            relations: { owner: true }
        })

        if (!exchange) {
            throw new ErrorManager('NOT_FOUND', 'Exchange not found');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== exchange.owner.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to modify exchange');
        }

        if (exchange.status !== ExchangeStatus.OPEN) {
            throw new ErrorManager('FORBIDDEN', 'Exchange is not active');
        }

        exchange.status = ExchangeStatus.COMPLETED;
        exchange.completedTime = new Date();

        return this.exchangeRepository.save(exchange);
    }

    async cancelExchange(user:UserActiveInterface, id: number) {
        const exchange = await this.exchangeRepository.findOne({
            where: { id },
            relations: { owner: true }
        })

        if (!exchange) {
            throw new ErrorManager('NOT_FOUND', 'Exchange not found');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== exchange.owner.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to modify exchange');
        }

        if (exchange.status !== ExchangeStatus.OPEN) {
            throw new ErrorManager('FORBIDDEN', 'Exchange is not active');
        }

        exchange.status = ExchangeStatus.CANCELLED;
        exchange.cancelledTime = new Date();

        return this.exchangeRepository.save(exchange);
    }

    async removeExchange(user:UserActiveInterface, id: number) {
        const exchange = await this.exchangeRepository.findOne({
            where: { id },
            relations: { owner: true }
        })

        if (!exchange) {
            throw new ErrorManager('NOT_FOUND', 'Exchange not found');
        }

        if (user.role !== Role.SUPER_ADMIN && user.id !== exchange.owner.id) {
            throw new ErrorManager('FORBIDDEN', 'Not allowed to delete exchange');
        }

        //only allow superadmin to delete logs
        if (user.role !== Role.SUPER_ADMIN && exchange.status !== ExchangeStatus.OPEN) {
            throw new ErrorManager('FORBIDDEN', 'Exchange is not active');
        }

        return this.exchangeRepository.remove(exchange);
    }
}
