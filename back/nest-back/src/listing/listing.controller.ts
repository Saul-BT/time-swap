import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { Role } from 'src/common/enums/role.enum';
import type { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingOutputDto } from './dto-outputs/listing.output.dto';
import { ListingService } from './listing.service';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiTags('listing - Anuncios de servicios (issue #10)')
@Controller('listing')
export class ListingController {
    constructor(private readonly listingService: ListingService) {}

    @Post('create')
    @Auth(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: 'Publicar un anuncio (oferta o solicitud)', description: 'ADMIN, USER' })
    @ApiResponse({ status: 201, description: 'Anuncio publicado y activo.', type: ListingOutputDto })
    @ApiBadRequestResponse({ description: 'Faltan campos obligatorios o no son válidos.' })
    async create(@Body() dto: CreateListingDto, @ActiveUser() user: UserActiveInterface): Promise<ListingOutputDto> {
        return this.listingService.create(dto, user);
    }
}