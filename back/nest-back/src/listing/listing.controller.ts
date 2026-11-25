import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Auth } from "src/auth/decorators/auth.decorator";
import { Role } from "src/common/enums/role.enum";
import { ActiveUser } from "src/common/decorators/active-user.decorator";
import type { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { ListingService } from "./listing.service";
import { CreateListingDTO } from "./dto/create-listing.dto";
import { ListingOutputDto } from "./dto-outputs/listing.output.dto";
import { UpdateListingDTO } from "./dto/update-listing.dto";
import { SearchListingDTO } from "./dto/search-listing.dto";
import { MineListingDTO } from "./dto/mine-listing.dto";
import { RenewListingDTO } from "./dto/renew-listing.dto";
import { PaginatedResponse } from "src/common/dtos/paginated-output.dto";
import { ListingMode } from "./enums/listing-mode.enum";
import { ErrorManager } from "src/common/error-handling/error.manager";


@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiTags('listing - Anuncios de servicios')
@Controller('listing')
export class ListingController {
    constructor(
        private readonly listingService: ListingService
    ) {}

    @Post('create')
    @Auth(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: 'Publicar un anuncio (oferta o solicitud)', description: 'ADMIN, USER' })
    @ApiResponse({ status: 201, description: 'Anuncio publicado y activo.', type: ListingOutputDto })
    @ApiBadRequestResponse({ description: 'Faltan campos obligatorios o no son válidos.' })
    async create(@ActiveUser() user: UserActiveInterface, @Body() createDto: CreateListingDTO): Promise<ListingOutputDto> {
        if (createDto.mode !== ListingMode.REMOTE && !createDto.location) {
            throw new ErrorManager('BAD_REQUEST', 'Listings need a location when not remote');
        }

        return this.listingService.create(user, createDto);
    }

    @Patch(':id')
    @Auth(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Modificar un anuncio existente (activo o pausado). El tipo no se puede cambiar.' })
    @ApiResponse({ status: 200, description: 'Anuncio modificado', type: ListingOutputDto })
    @ApiBadRequestResponse({ description: 'Valores de modificación no válidos.' })
    async update(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateListingDTO):Promise<ListingOutputDto> {
        return this.listingService.update(user, id, updateDto);
    }
    
    @Get('search')
    @ApiOperation({ summary: 'Buscar anuncios existentes (por defecto, solo activos)' })
    @ApiResponse({ status: 200, description: 'Anuncios encontrados', type: PaginatedResponse<ListingOutputDto> })
    @ApiBadRequestResponse({ description: 'Campos de búsqueda no válidos.' })
    async search(@Query() searchDto: SearchListingDTO): Promise<PaginatedResponse<ListingOutputDto>> {
        return this.listingService.search(searchDto);
    }

    // Va antes de ":id" para que Nest no confunda "mine" con un id
    @Get('mine')
    @Auth(Role.USER, Role.ADMIN)
    @ApiOperation({ summary: 'Mis anuncios, con filtro opcional por estado', description: 'ADMIN, USER' })
    @ApiResponse({ status: 200, description: 'Mis anuncios', type: PaginatedResponse<ListingOutputDto> })
    async mine(@ActiveUser() user: UserActiveInterface, @Query() dto: MineListingDTO): Promise<PaginatedResponse<ListingOutputDto>> {
        return this.listingService.mine(user, dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar anuncio por ID' })
    @ApiResponse({ status: 200, description: 'Anuncio encontrado', type: ListingOutputDto })
    @ApiBadRequestResponse({ description: 'Anuncio no encontrado' })
    async getById(@Param('id', ParseIntPipe) id: number): Promise<ListingOutputDto> {
        return this.listingService.getById(id);
    }

    //todo endpoint for revising exchange

    @Post(':id/pause')
    @Auth(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Pausar un anuncio activo', description: 'ADMIN, USER' })
    @ApiResponse({ status: 201, description: 'Anuncio pausado', type: ListingOutputDto })
    @ApiBadRequestResponse({ description: 'No se pudo encontrar o modificar.' })
    async pause(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number): Promise<ListingOutputDto> {
        return this.listingService.pause(user, id);
    }

    @Post(':id/resume')
    @Auth(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Reactivar un anuncio pausado', description: 'ADMIN, USER' })
    @ApiResponse({ status: 201, description: 'Anuncio activo', type: ListingOutputDto })
    @ApiBadRequestResponse({ description: 'No se pudo encontrar o modificar.' })
    async resume(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number): Promise<ListingOutputDto> {
        return this.listingService.resume(user, id);
    }

    @Post(':id/renew')
    @Auth(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Renovar un anuncio caducado con una nueva fecha límite', description: 'ADMIN, USER' })
    @ApiResponse({ status: 201, description: 'Anuncio renovado', type: ListingOutputDto })
    @ApiBadRequestResponse({ description: 'Fecha no válida o anuncio no caducado.' })
    async renew(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number, @Body() dto: RenewListingDTO): Promise<ListingOutputDto> {
        return this.listingService.renew(user, id, dto);
    }

    @Post(':id/withdraw')
    @Auth(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Retirar un anuncio. No cancela los acuerdos ya formalizados.', description: 'ADMIN, USER' })
    @ApiResponse({ status: 201, description: 'Anuncio retirado', type: ListingOutputDto })
    @ApiBadRequestResponse({ description: 'No se pudo encontrar o modificar.' })
    async withdraw(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number): Promise<ListingOutputDto> {
        return this.listingService.withdraw(user, id);
    }

    @Delete(':id')
    @Auth(Role.ADMIN, Role.USER)
    @ApiOperation({ summary: 'Borrar anuncio', description: 'ADMIN, USER' })
    @ApiResponse({ status: 200, description: 'Anuncio borrado' })
    @ApiBadRequestResponse({ description: 'No se pudo encontrar o borrar.' })
    async remove(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.listingService.remove(user, id);
    }
}