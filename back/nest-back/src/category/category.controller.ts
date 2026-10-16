import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Role } from '../common/enums/role.enum';
import type { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { CategoryService } from './category.service';
import { CreateCategoryDTO } from './dto/create-category.dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiTags('category - Consultas sobre categorías')
@Auth(Role.USER, Role.ADMIN)
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post('create-category')
    @Auth(Role.ADMIN) //admin directly creates new category
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createCategory(@Body() categoryDto: CreateCategoryDTO) {
    }

    @Post('create-request')
    @Auth(Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createRequest(@ActiveUser() user: UserActiveInterface, @Body() categoryDto: CreateCategoryDTO) {
        return this.categoryService.createCategory(categoryDto);
    }

    @Post('request-category/:id')
    @Auth(Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async requestCategory(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.categoryService.requestCategory(user, id);
    }

    @Get('get-request/:id')
    @Auth(Role.ADMIN, Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getRequest(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.getRequest(id);
    }

    @Get('get-category/:id')
    @Auth(Role.ADMIN, Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.getCategory(id);
    }

    @Get('search-request/:name')
    @Auth(Role.ADMIN, Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async searchRequest(@Param('name') name?: string) {
        return this.categoryService.searchRequest(name);
    }

    @Get('search-category/:name')
    @Auth(Role.ADMIN, Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async searchCategory(@Param('name') name?: string) {
        return this.categoryService.searchCategory(name);
    }

    @Get('get-voted/:id')
    @Auth(Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getVoted(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.getVoted(id);
    }

    @Delete('remove-vote/:id')
    @Auth(Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async removeVote(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.categoryService.removeVote(user, id);
    }

    @Delete('remove-request/:id')
    @Auth(Role.ADMIN)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async removeRequest(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.removeRequest(id);
    }

    @Delete('remove-category/:id')
    @Auth(Role.ADMIN)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async removeCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.removeCategory(id);
    }
}
