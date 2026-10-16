import { forwardRef, Inject, Injectable, Logger, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsOrder, FindOptionsOrderValue, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ErrorManager } from '../common/error-handling/error.manager';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { UserService } from '../user/user.service';
import { Category } from './entities/category.entity';
import { CategoryRequest } from './entities/category-request.entity';
import { CreateCategoryDTO } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name);

    constructor(
        @InjectRepository(CategoryRequest)
        private readonly requestRepository: Repository<CategoryRequest>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        //private readonly entityManager: EntityManager,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}

    async createCategory(categoryDto: CreateCategoryDTO) {
    }
    
    async createRequest(user: UserActiveInterface, categoryDto: CreateCategoryDTO) {
    }
    
    async requestCategory(user: UserActiveInterface, id: number) {
    }
    
    async getRequest(id: number) {
    }
    
    async getCategory(id: number) {
    }
    
    async searchRequest(name?: string) {
    }

    async searchCategory(name?: string) {
    }

    async getVoted(id: number) {
    }

    async removeVote(user: UserActiveInterface, id: number) {            
    }

    async removeRequest(id: number) {        
    }

    async removeCategory(id: number) {        
    }
    
}
