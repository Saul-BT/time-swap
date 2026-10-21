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
export class CategoryRequestService {
    private readonly logger = new Logger(CategoryRequestService.name);

    constructor(
        @InjectRepository(CategoryRequest)
        private readonly requestRepository: Repository<CategoryRequest>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}
    
    async createRequest(user: UserActiveInterface, categoryDto: CreateCategoryDTO) {
        const name = categoryDto.categoryName.trim().toLowerCase();
        const existingCategory = await this.categoryRepository.findOneBy({ name });
        if (existingCategory) {
            throw new ErrorManager('CONFLICT', 'Category name already in use');
        }

        const existingRequest = await this.requestRepository.findOneBy({ name });
        if (existingRequest) {
            throw new ErrorManager('CONFLICT', 'Request name already in use');
        }

        const userEntity = await this.userService.findAllData(user.mail);
        if (!userEntity) {
            throw new ErrorManager('NOT_FOUND', 'User not found');
        }

        const newRequest = this.requestRepository.create({
            name,
            description: categoryDto.categoryDescription,
            voters: [userEntity]
        });

        return this.requestRepository.save(newRequest);
    }
    
    async requestCategory(user: UserActiveInterface, id: number) {
        const request = await this.requestRepository.findOne({
            where: { id },
            relations: { voters: true }
        });

        if (!request) {
            throw new ErrorManager('NOT_FOUND', 'Category not found');
        }

        const userEntity = await this.userService.findAllData(user.mail);
        if (!userEntity) {
            throw new ErrorManager('NOT_FOUND', 'User not found');
        }

        if (request.voters.some((voter => voter.id === user.id))) {
            throw new ErrorManager('CONFLICT', 'User has already voted');
        }

        request.voters.push(userEntity);
        
        await this.categoryRepository.save(request);

        return request; //todo cleanup voters so only email and name is returned
    }
    
    async getRequest(id: number) {
        const request = await this.requestRepository.findOne({
            where: { id },
            relations: { voters: true }
        });
        if (!request) {
            throw new ErrorManager('NOT_FOUND', 'Request not found');
        }

        return request;
    }
    
    async searchRequest(name?: string) {
        if (!name) //return all if not searching
            return this.requestRepository.find();

        name = name.trim().toLowerCase();
        return this.requestRepository.find({
            where: { name: ILike(name) },
            relations: { voters: true }
        });
    }

    async removeVote(user: UserActiveInterface, id: number) {
        const request = await this.requestRepository.findOne({
            where: { id },
            relations: { voters: true }
        });

        if (!request) {
            throw new ErrorManager('NOT_FOUND', 'Category not found');
        }

        const userEntity = await this.userService.findAllData(user.mail);
        if (!userEntity) {
            throw new ErrorManager('NOT_FOUND', 'User not found');
        }

        if (!request.voters.some((voter => voter.id === user.id))) {
            throw new ErrorManager('CONFLICT', 'User has not voted');
        }

        request.voters = request.voters.filter(
            voter => voter.id !== user.id,
        );
        
        await this.categoryRepository.save(request);

        //todo if no voters, delete request?

        return request; //todo cleanup voters so only email and name is returned
    }

    async removeRequest(id: number) {      
        const existingRequest = await this.requestRepository.findOneBy({ id });
        if (!existingRequest) {
            throw new ErrorManager('NOT_FOUND', 'Request not found');
        }

        return this.requestRepository.remove(existingRequest);  
    }
}
