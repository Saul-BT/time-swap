import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Auth } from "src/auth/decorators/auth.decorator";
import { Role } from "src/common/enums/role.enum";
import { ExchangeService } from "./exchange.service";
import { ActiveUser } from "src/common/decorators/active-user.decorator";
import type { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { CreateExchangeDTO } from "./dto/create-exchange.dto";
import { SearchExchangeDTO } from "./dto/search-exchange.dto";
import { UpdateExchangeDTO } from "./dto/update-exchange.dto";


@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiTags('exchange - Consulta de información sobre anuncios')
@Controller('exchange')
export class ExchangeController {
    constructor(
        private readonly exchangeService: ExchangeService
    ) {}

    @Post()
    @Auth(Role.ADMIN, Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createExchange(@ActiveUser() user: UserActiveInterface, @Body() createDto: CreateExchangeDTO) {
        return this.exchangeService.createExchange(user, createDto);
    }

    @Patch(':id')
    @Auth(Role.ADMIN, Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async updateExchange(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateExchangeDTO) {
        return this.exchangeService.updateExchange(user, id, updateDto);
    }
    
    @Get('search')
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async searchRequest(@Query() searchDto: SearchExchangeDTO) {
        return this.exchangeService.searchExchanges(searchDto);
    }

    @Get(':id')
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getRequest(@Param('id', ParseIntPipe) id: number) {
        return this.exchangeService.getExchange(id);
    }

    //todo endpoint for revising exchange

    @Post(':id/complete')
    @Auth(Role.ADMIN, Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async completeExchange(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.exchangeService.removeExchange(user, id);
    }

    @Post(':id/cancel')
    @Auth(Role.ADMIN, Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async cancelExchange(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.exchangeService.removeExchange(user, id);
    }

    @Delete(':id')
    @Auth(Role.ADMIN, Role.USER)
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async removeExchange(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.exchangeService.removeExchange(user, id);
    }
}
