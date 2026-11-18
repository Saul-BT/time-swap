import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiQuery,
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
import { CategoryRequestService } from './category-request.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiTags('category - Consultas sobre categorías')
@Controller('category')
export class CategoryController {
    constructor(
        private readonly requestService: CategoryRequestService,
        private readonly categoryService: CategoryService
    ) {}

    @Post()
    @Auth(Role.ADMIN) //admin directly creates new category
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createCategory(@Body() categoryDto: CreateCategoryDTO) {
        return this.categoryService.createCategory(categoryDto);
    }

    @Post('request')
    @Auth(Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createRequest(@ActiveUser() user: UserActiveInterface, @Body() categoryDto: CreateCategoryDTO) {
        return this.requestService.createRequest(user, categoryDto);
    }

    @Post('vote/:id')
    @Auth(Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async requestCategory(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.requestService.requestCategory(user, id);
    }

    @Get('request/search')
    @ApiQuery({
        name: 'name',
        required: false,
        type: String
    })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async searchRequest(@Query('name') name?: string) {
        return this.requestService.searchRequest(name);
    }

    @Get('search')
    @ApiQuery({
        name: 'name',
        required: false,
        type: String
    })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async searchCategory(@Query('name') name?: string) {
        return this.categoryService.searchCategory(name);
    }

    @Get('request/:id')
    @Auth(Role.ADMIN, Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getRequest(@Param('id', ParseIntPipe) id: number) {
        return this.requestService.getRequest(id);
    }

    @Get(':id')
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.getCategory(id);
    }

    @Delete('request/:id/vote')
    @Auth(Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async removeVote(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.requestService.removeVote(user, id);
    }

    @Delete('request/:id')
    @Auth(Role.ADMIN)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async removeRequest(@Param('id', ParseIntPipe) id: number) {
        return this.requestService.removeRequest(id);
    }

    @Delete(':id')
    @Auth(Role.ADMIN)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async removeCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.removeCategory(id);
    }
}
