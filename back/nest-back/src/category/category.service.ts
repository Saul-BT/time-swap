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
    ) {}

    async createCategory(categoryDto: CreateCategoryDTO) {
        const name = categoryDto.categoryName.trim().toLowerCase();
        const existingCategory = await this.categoryRepository.findOneBy({ name });
        if (existingCategory) {
            throw new ErrorManager('CONFLICT', 'Category name already in use');
        }

        //if exists, delete request with same name
        await this.requestRepository.delete({ name });

        const newCategory = this.categoryRepository.create({
            name,
            description: categoryDto.categoryDescription
        });

        return this.categoryRepository.save(newCategory);
    }
    
    async getCategory(id: number) {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            throw new ErrorManager('NOT_FOUND', 'Category not found');
        }

        return category;
    }

    async getCategoryByName(name: string) {
        name = name.trim().toLowerCase();
        const category = await this.categoryRepository.findOneBy({ name });
        if (!category) {
            throw new ErrorManager('NOT_FOUND', 'Category not found');
        }

        return category;
    }

    async searchCategory(name?: string) {
        if (!name) //return all if not searching
            return this.categoryRepository.find();

        name = name.trim().toLowerCase();
        return this.categoryRepository.findBy({
            name: ILike(name)
        });
    }

    async removeCategory(id: number) {
        const existingCategory = await this.categoryRepository.findOneBy({ id });
        if (!existingCategory) {
            throw new ErrorManager('NOT_FOUND', 'Category not found');
        }

        return this.categoryRepository.remove(existingCategory);  
    }
}
