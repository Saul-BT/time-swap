import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CategoryRequest } from './entities/category-request.entity';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRequestService } from './category-request.service';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([CategoryRequest, Category]),
    ],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryRequestService],
    exports: [TypeOrmModule, CategoryService, CategoryRequestService],
})
export class CategoryModule {}
