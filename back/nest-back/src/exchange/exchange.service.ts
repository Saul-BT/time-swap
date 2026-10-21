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
        //todo string to datetime transform and validation

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
        if (Object.values(updateDto).some(value => value !== undefined)) {
            throw new ErrorManager('BAD_REQUEST', 'Empty DTO');
        }

        const exchange = await this.exchangeRepository.findOne({
            where: { id },
            relations: { category: true, owner: true } //todo get revisions as well
        })

        if (!exchange) {
            throw new ErrorManager('NOT_FOUND', 'Exchange not found');
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
        //todo string to datetime transform and validation

        //the rest can be copied as is
        Object.assign(exchange, {
            ...updateDto,
            startTime: undefined,
            categoryId: undefined
        });

        return this.exchangeRepository.save(exchange);
    }

    async getExchange(id: number) {
        const exchange = await this.exchangeRepository.findOne({
            where: { id },
            relations: { category:true, owner: true } //todo get revisions as well
        })

        if (!exchange) {
            throw new ErrorManager('NOT_FOUND', 'Exchange not found');
        }

        return exchange;
    }
        
    async searchRequest(searchDto: SearchExchangeDTO) {
        //todo pagination
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

        return this.exchangeRepository.remove(exchange);
    }
}
