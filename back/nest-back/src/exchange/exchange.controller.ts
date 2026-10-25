import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Auth } from "src/auth/decorators/auth.decorator";
import { Role } from "src/common/enums/role.enum";
import { ExchangeService } from "./exchange.service";
import { ActiveUser } from "src/common/decorators/active-user.decorator";
import type { UserActiveInterface } from "src/common/interfaces/user-active.interface";
import { CreateExchangeDTO } from "./dto/create-exchange.dto";
import { SearchExchangeDTO } from "./dto/search-exchange.dto";
import { UserService } from "src/user/user.service";
import { ErrorManager } from "src/common/error-handling/error.manager";
import { UpdateExchangeDTO } from "./dto/update-exchange.dto";


@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@ApiTags('exchange - Consulta de información sobre anuncios')
@Auth(Role.USER, Role.ADMIN)
@Controller('exchange')
export class ExchangeController {
    constructor(
        private readonly exchangeService: ExchangeService
    ) {}

    @Post('create-exchange')
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async createExchange(@ActiveUser() user: UserActiveInterface, @Body() createDto: CreateExchangeDTO) {
        return this.exchangeService.createExchange(user, createDto);
    }

    @Patch('update-exchange/:id')
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async updateExchange(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateExchangeDTO) {
        return this.exchangeService.updateExchange(user, id, updateDto);
    }

    @Get('get-exchange/:id')
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getRequest(@Param('id', ParseIntPipe) id: number) {
        return this.exchangeService.getExchange(id);
    }
    
    @Get('search-exchange')
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async searchRequest(searchDto: SearchExchangeDTO) {
        return this.exchangeService.searchRequest(searchDto);
    }

    //todo endpoint for revising exchange

    @Post('complete-exchange/:id')
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async completeExchange(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.exchangeService.removeExchange(user, id);
    }

    @Post('cancel-exchange/:id')
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async cancelExchange(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.exchangeService.removeExchange(user, id);
    }

    @Delete('remove-exchange/:id')
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async removeExchange(@ActiveUser() user: UserActiveInterface, @Param('id', ParseIntPipe) id: number) {
        return this.exchangeService.removeExchange(user, id);
    }
}
