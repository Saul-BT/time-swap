import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Auth } from "src/auth/decorators/auth.decorator";
import { Role } from "src/common/enums/role.enum";
import { ActiveUser } from "src/common/decorators/active-user.decorator";
import type { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { ReviewOutputDto } from "./dto-outputs/review.output.dto";
import { ReviewService } from "./review.service";
import CreateReviewDto from "./dto/create-review.dto";
import UpdateReviewDto from "./dto/update-review.dto";


@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiTags('review - Valoraciones de intercambios completados')
@Controller('review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService
    ) {}

    @Post('create')
    @Auth(Role.USER, Role.ADMIN)
    @ApiResponse({ status: 201, description: 'Review publicada.', type: ReviewOutputDto })
    @ApiBadRequestResponse({ description: 'Faltan campos obligatorios o no son válidos.' })
    async create(@ActiveUser() user: UserActiveInterface, @Body() createDto: CreateReviewDto): Promise<ReviewOutputDto> {
        return this.reviewService.create(user, createDto);
    }

    @Patch(':id')
    @Auth(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Modificar review existente' })
    @ApiResponse({ status: 200, description: 'Review modificada', type: ReviewOutputDto })
    @ApiBadRequestResponse({ description: 'Valores de modificación no válidos.' })
    async update(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateReviewDto):Promise<ReviewOutputDto> {
        return this.reviewService.update(user, id, updateDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar review por ID' })
    @ApiResponse({ status: 200, description: 'Review encontrada', type: ReviewOutputDto })
    @ApiBadRequestResponse({ description: 'Review no encontrada' })
    async getById(@Param('id', ParseIntPipe) id: number): Promise<ReviewOutputDto> {
        return this.reviewService.getById(id);
    }

    @Delete(':id')
    @Auth(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Borrar review', description: 'ADMIN, USER' })
    @ApiResponse({ status: 200, description: 'Review borrada' })
    @ApiBadRequestResponse({ description: 'No se pudo encontrar o borrar.' })
    async remove(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.reviewService.remove(user, id);
    }
}